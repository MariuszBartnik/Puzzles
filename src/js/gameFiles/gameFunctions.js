import Konva from 'konva';
import {setBoxSize} from './utils';
import { createRandomPuzzles } from './puzzleElement';

// Global variables
const boxSize = setBoxSize();

// Show score and number of available reloads in gameboard top bar
export const showScore = (topBarLayer, score, availableReloads) => {
    const existingText = topBarLayer.find('Text');
    existingText.destroy();

    const scoreText = new Konva.Text({
        text: `Score: 
${score}`,
        x: 0,
        y: 0,
        width: boxSize*5,
        height: boxSize*1.5,
        align: 'center',
        verticalAlign: 'middle',
        fontFamily: 'Montserrat',
        fontSize: 24,
        fill: '#fff'
    });
    
    const divider = new Konva.Rect({
        x: boxSize*5 - 1,
        y: 0,
        width: 2,
        height: boxSize*1.5,
        fill: "#fff"
    });


    const reloadsText = new Konva.Text({
        text: `Reloads: 
${availableReloads}`,
        x: boxSize*5,
        y: 0,
        width: boxSize*5,
        height: boxSize*1.5,
        align: 'center',
        verticalAlign: 'middle',
        fontFamily: 'Montserrat',
        fontSize: 24,
        fill: '#fff'
    })
    
    topBarLayer.add(scoreText);
    topBarLayer.add(divider);
    topBarLayer.add(reloadsText);
};

// Check if whole puzzle element can be dropped inside gameboard based on location of first Rect of Konva's Group
export const checkGameboardBoundaries = (puzzleElement, gameboardDimensions, fixedPuzzlePosition) => {
    const puzzleBoxCoordinates = puzzleElement.children.map(puzzleBox => {
        return { x: Math.round(puzzleBox.attrs.x / boxSize), y: Math.round(puzzleBox.attrs.y/ boxSize) }
    });

    const maxPuzzleX = Math.max(...puzzleBoxCoordinates.map(o => o.x));
    const maxPuzzleY = Math.max(...puzzleBoxCoordinates.map(o => o.y));

    if(fixedPuzzlePosition.x < gameboardDimensions.x || 
        fixedPuzzlePosition.x >= gameboardDimensions.width - maxPuzzleX  * boxSize|| 
        fixedPuzzlePosition.y < gameboardDimensions.y || 
        fixedPuzzlePosition.y >= gameboardDimensions.height - maxPuzzleY * boxSize
    ){
        return false;
    }

    return true;
};

// Check if all required boxes, where puzzle should be dropped, are empty
export const checkRoomForDroppedPuzzle = (dropCoordinates, gameboardBoxes) => {
    let isEmpty = true;
    dropCoordinates.forEach(box => {
        isEmpty = isEmpty && (gameboardBoxes[box.y][box.x].getAttr('fill') === '#353535');
    });

    return isEmpty;
};

// Check if there are full rows and columns in a gameboard
export const checkFullLines = (gameboardBoxes) => {
    const fullLines = [];
    
    // Check for full rows
    for(let r = 0; r < gameboardBoxes.length; r++){
        let isRowFull = true;
        for(let c = 0; c < gameboardBoxes[r].length; c++){
            isRowFull = isRowFull && (gameboardBoxes[r][c].getAttr('fill') === '#FFF');
        }
        
        if(isRowFull){
            fullLines.push({type: 'row', id: r});
        }
        
    };
    
    // Check for full columns
    for(let c = 0; c < gameboardBoxes.length; c++){
        let isColumnFull = true;
        for(let r = 0; r < gameboardBoxes[c].length; r++){
            isColumnFull = isColumnFull && (gameboardBoxes[r][c].getAttr('fill') === '#FFF');
        }

        if(isColumnFull){
            fullLines.push({type: 'column', id: c});
        }
    }

    return fullLines;
};

// Check if there is place on gameboard to drop existing available puzzles elements
export const checkRoomForAvailablePuzzles = (puzzleElement, gameboardBoxes, stage) => {
        
    const puzzleBoxCoordinates = puzzleElement.children.map(puzzleBox => {
        return { x: Math.round(puzzleBox.getAttr('x') / boxSize), y: Math.round(puzzleBox.getAttr('y') / boxSize)};
    });
    
    const maxPuzzleX = Math.max(...puzzleBoxCoordinates.map(o => o.x));
    const maxPuzzleY = Math.max(...puzzleBoxCoordinates.map(o => o.y));
    
    for(let row = 0; row < gameboardBoxes.length - maxPuzzleY; row++){
        for(let col = 0; col < gameboardBoxes[row].length - maxPuzzleX; col++){
            let fillColors = [];

            puzzleBoxCoordinates.forEach(box => {
                fillColors.push(gameboardBoxes[row + box.y][col + box.x].getAttr('fill'));
            });

            if(fillColors.every(color => color === '#353535')) {
                if(puzzleElement.children[0].getAttr('fill') === '#fff') return null;

                changePuzzleProperties(puzzleElement, true);
                stage.batchDraw();
                
                return true;
            };
        };
    };

    if(puzzleElement.children[0].getAttr('fill') === 'orange') return null;

    changePuzzleProperties(puzzleElement, false);
    stage.batchDraw();    

    return false;
};

// Destroy existing puzzles and creating a new one
export const reloadPuzzles = (availablePuzzles, puzzleLayers) => {
    availablePuzzles.forEach(puzzleElement => {
        puzzleElement.destroy();
    });

    const newPuzzles = createRandomPuzzles(puzzleLayers);

    return newPuzzles;
};

// Check if game should be over
export const checkGameOver = (availablePuzzles, availableReloads) => {
    const fillColors = [];
    availablePuzzles.forEach(puzzleElement => {
        fillColors.push(puzzleElement.children[0].getAttr('fill'));
    });

    const gameOverStatus = fillColors.every(color => color === 'orange') && availableReloads == 0;

    return gameOverStatus;
};

const changePuzzleProperties = (puzzleElement, isAvailable) => {
    const color = isAvailable ? "#fff" : "orange";
    const draggable = isAvailable ? true : false;

    puzzleElement.children.forEach(child => {
        child.setAttr('fill', color);
    });

    puzzleElement.draggable(draggable);
};
