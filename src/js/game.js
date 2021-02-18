import Konva from 'konva';
import Modal from 'bootstrap/js/dist/modal';
import axios from 'axios';
import { setBoxSize} from './gameFiles/utils';
import { createGameBoard, createTopBar, createPuzzlesLayer } from './gameFiles/gameboard';
import { createRandomPuzzles } from './gameFiles/puzzleElement';
import { showScore, checkGameboardBoundaries, checkRoomForDroppedPuzzle, checkFullLines, checkRoomForAvailablePuzzles, reloadPuzzles, checkGameOver } from './gameFiles/gameFunctions';
import reloadImg from '../img/reload-icon.png';

const navbar = document.querySelector('nav');
const modal = new Modal(document.querySelector('#game-over-modal'), {backdrop: "static", keyboard: false});

// Global variables;
const width = window.innerWidth;
const height = window.innerHeight - navbar.clientHeight;
let score = 0;
let availableReloads = 5;
const boxSize = setBoxSize();

// Create Konva stage
const stage = new Konva.Stage({
    container: 'game-stage',
    width,  
    height
});

// Create gameboard elements
const topBarLayer = createTopBar();
let { gameboardLayer, gameboardBoxes, gameboardGroup } = createGameBoard();
const puzzleLayer = createPuzzlesLayer();
// Create random puzzles
let availablePuzzles = createRandomPuzzles(puzzleLayer);

const createRefreshButton = () => {
    Konva.Image.fromURL(reloadImg, (image) => {
        image.setAttrs({
            x: boxSize*8,
            y: 0,
            width: boxSize*2,
            height: boxSize*2,
            fill: '#353535',
            stroke: '#fff'
        });

        image.on('mouseenter', () => {
            mouseOverImageHandler(image, true);
        });

        image.on('mouseout', () => {
            mouseOverImageHandler(image, false);
        });

        image.on('click', () => {
            clickImageHandler();
        });

        image.on('tap', () => {
            clickImageHandler();            
        });

        puzzleLayer.add(image);
        puzzleLayer.draw();
    });
};
createRefreshButton();

const addListenersForPuzzles = () => {
    availablePuzzles.forEach(puzzleElement => {
        puzzleElement.on('mouseover', mouseOverHandler);
        puzzleElement.on('mouseout', mouseOutHandler);
        puzzleElement.on('dragstart', () => dragStartHandler(puzzleElement));
        puzzleElement.on('dragend', () => dragEndHandler(puzzleElement));
    });
};

const toggleMouseOverEvent = (puzzleElement, isActive) => {
    // No change in active status
    if(isActive === null) return;

    // Active status changed - toggle event listener
    if(isActive) {
        puzzleElement.addEventListener('mouseover', mouseOverHandler)
    }else{
        puzzleElement.removeEventListener('mouseover', mouseOverHandler);
    };
};

const mouseOverImageHandler = (image, isMouseOver) => {
    const color = isMouseOver ? "#212121": "#353535";
    const cursor = isMouseOver ? "pointer" : "default";

    image.setAttr('fill', color);
    document.body.style.cursor = cursor;
    stage.batchDraw();
};

const clickImageHandler = () => {
    if(availableReloads > 0) {
        // Reload available puzzles
        availablePuzzles = reloadPuzzles(availablePuzzles, puzzleLayer);
        addListenersForPuzzles();
        
        // Reduce number of available reloads
        availableReloads -= 1;
        showScore(topBarLayer, score, availableReloads);
        stage.batchDraw();

        // Loop through available puzzles to check if they can be put into gameboard
        loopThroughAvailablePuzzles();

        // Check if game should be over
        const isGameOver = checkGameOver(availablePuzzles, availableReloads);
        if(isGameOver) {
            gameOverHandler();
        };

    } else{
        // Display alert when no more reloads are available
        const alertOutput = document.querySelector("#alert-output");
        const alertHtml = `<div class="alert alert-warning  alert-dismissible fade show reloads-alert" role="alert">
                There is no more reloads available.
                <button class="btn-close" role="button" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`

        alertOutput.innerHTML = alertHtml;
    };
};

const mouseOverHandler = () => {
    document.body.style.cursor = 'pointer';
};

const mouseOutHandler = () => {
    document.body.style.cursor = 'default';
};

const dragStartHandler = (puzzleElement) => {
    puzzleElement.attrs.startPosition = {
        x: puzzleElement.attrs.x,
        y: puzzleElement.attrs.y
    };

    puzzleElement.zIndex(puzzleElement.parent.children.length -1);

    puzzleElement.scale({x: 1, y: 1});
};

const dragEndHandler = (puzzleElement) => {
    const gameboardDimensions = {
        x: gameboardGroup.getAttr('x'),
        y:  gameboardGroup.getAttr('y'),
        width: gameboardGroup.getAttr('x') + boxSize*10,
        height: gameboardGroup.getAttr('y') + boxSize*10
    }

    const fixedPuzzlePosition = {
        x: Math.round((puzzleElement._lastPos.x - gameboardDimensions.x) / boxSize) * boxSize + gameboardDimensions.x,
        y: Math.round((puzzleElement._lastPos.y - gameboardDimensions.y) / boxSize) * boxSize + gameboardDimensions.y
    }

    const dropCoordinates = [];

    puzzleElement.children.forEach(puzzleBox => {
        dropCoordinates.push({
            x: Math.round((fixedPuzzlePosition.x - gameboardDimensions.x + puzzleBox.attrs.x) / boxSize),
            y: Math.round((fixedPuzzlePosition.y - gameboardDimensions.y + puzzleBox.attrs.y) / boxSize)
        }) 

    });

    if(checkGameboardBoundaries(puzzleElement, gameboardDimensions, fixedPuzzlePosition) && checkRoomForDroppedPuzzle(dropCoordinates, gameboardBoxes)) {
        dropPuzzleElement(puzzleElement, dropCoordinates);
    } else{
        resetPuzzleElement(puzzleElement);
    }

};

const resetPuzzleElement = (puzzleElement) => {
    puzzleElement.scale({X: .5, y: .5});
    puzzleElement.position({
        x: puzzleElement.attrs.startPosition.x,
        y: puzzleElement.attrs.startPosition.y
    });
    
    stage.batchDraw();
};

const dropPuzzleElement = (puzzleElement, dropCoordinates) => {
    // Change color of gameboard boxes when element is dropped
    dropCoordinates.forEach(box => {
        gameboardBoxes[box.y][box.x].attrs.fill = '#FFF';
        gameboardBoxes[box.y][box.x].attrs.stroke = '#353535';
    });

    // destroy available puzzle element and remove it from availablePuzzles array
    puzzleElement.destroy();
    availablePuzzles = availablePuzzles.filter(puzzle => puzzle.attrs.id !== puzzleElement.attrs.id);
    
    mouseOutHandler();
    stage.batchDraw();
    

    if(availablePuzzles.length === 0){
        availablePuzzles = createRandomPuzzles(puzzleLayer);
        addListenersForPuzzles();
    };

    loopThroughAvailablePuzzles();

    const fullLines = checkFullLines(gameboardBoxes);
    
    if(fullLines.length > 0) {
        clearFullLines(fullLines);
    };
    
    const isGameOver = checkGameOver(availablePuzzles, availableReloads);
    
    if(isGameOver){
        gameOverHandler();
    } 
};

// Clear full rows and columns + add points
const clearFullLines = (fullLines) => {
    // clear full lines on gameboard
    fullLines.forEach(line => {
        for(let i = 0; i < 10; i++){
            if(line.type === 'row') {
                gameboardBoxes[line.id][i].attrs.fill = '#353535';
                gameboardBoxes[line.id][i].attrs.stroke = '#FFF';
            };

            if(line.type === 'column') {
                gameboardBoxes[i][line.id].attrs.fill = '#353535'
                gameboardBoxes[i][line.id].attrs.stroke = '#FFF'
            };
        };
    });
    stage.batchDraw();
    
    // add score and refresh topBar
    score += (fullLines.length * 10);
    showScore(topBarLayer, score, availableReloads);

    // check available room for puzzles -> new function
    loopThroughAvailablePuzzles();
};

const loopThroughAvailablePuzzles = () => {
    availablePuzzles.forEach(puzzleElement => {
        let availableRoom = checkRoomForAvailablePuzzles(puzzleElement, gameboardBoxes, stage);
        toggleMouseOverEvent(puzzleElement, availableRoom);
    });
};

const setHighScore = async () => {
    if(score > 0) {
        const currentScore = await axios.get('http://localhost:5000/game/ranking/user-data');
    
        if(!currentScore.data.userHighScore){
            await axios.post('http://localhost:5000/game/ranking/user-data', {newScore: score});
        }else{
            if(currentScore.data.userHighScore.score < score){
                await axios.put('http://localhost:5000/game/ranking/user-data', {newScore: score});
            }
        }
    }
}

const gameOverHandler = () => {
    const pointsOutput = document.querySelector('#points-output');
    pointsOutput.innerHTML = `${score} points`;
    
    setHighScore();
    modal.show();
};

// Restart game after game over
const restartGame = () => {
    // Reset gameboard boxes fill color
    for(let r = 0; r < gameboardBoxes.length; r++){
        for(let c = 0; c <gameboardBoxes[r].length; c++){
            gameboardBoxes[r][c].setAttrs({fill: "#353535", stroke: "#fff"});
        };
    };
    
    // reset score and number of available reloads 
    score = 0;
    availableReloads = 5;
    showScore(topBarLayer, score, availableReloads);

    // reset available puzzles and start event listeners
    availablePuzzles = reloadPuzzles(availablePuzzles, puzzleLayer);
    addListenersForPuzzles();

    stage.batchDraw();
    modal.hide();
};

const restartGameButton = document.querySelector('#restart-game-button');
restartGameButton.addEventListener('click', restartGame);

// Basic game functions
showScore(topBarLayer, score, availableReloads);
addListenersForPuzzles();


// Add gameboard elements to Konva stage
stage.add(gameboardLayer);
stage.add(topBarLayer);
stage.add(puzzleLayer);
