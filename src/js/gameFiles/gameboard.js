import Konva from 'konva';
import { setBoxSize } from './utils';

const boxSize = setBoxSize();

// Create main gameboard elements (gameboardLayer, gameboardBoxes, gameboardGroup)
export const createGameBoard = () => {
    const gameboardLayer = new Konva.Layer();
    const gameboardBoxes = [[]];

    const gameboardGroup = new Konva.Group({
        x: (window.innerWidth - boxSize*10) / 2,
        y: 20 + boxSize*1.5
    });
    
    const startBoxPosition = {
        x: 0,
        y: 0
    }

    for(let i = 0; i < 100; i++){
        if(i !== 0 && i%10 === 0){
            startBoxPosition.x = 0;
            startBoxPosition.y += boxSize; 

            gameboardBoxes.push([]);
        }
    
        const box = new Konva.Rect({
            x: startBoxPosition.x,
            y: startBoxPosition.y,
            width: boxSize,
            height: boxSize,
            fill: '#353535',
            stroke: '#fff'
        });

        gameboardGroup.add(box);
        gameboardBoxes[gameboardBoxes.length - 1].push(box);
    
        startBoxPosition.x += boxSize;   
    };

    gameboardLayer.add(gameboardGroup);

    return {
        gameboardLayer,
        gameboardBoxes,
        gameboardGroup
    };

};

// Create topBarLayer for gameboard
export const createTopBar = () => {
    const topBarLayer = new Konva.Layer({
        x: (window.innerWidth - boxSize*10) / 2,
        y: 10,
    });

    const topBar = new Konva.Rect({
        x: 0,
        y: 0,
        width: boxSize*10,
        height: boxSize*1.5,
        fill: '#353535',
        stroke: '#FFF'
    });

    topBarLayer.add(topBar);

    return topBarLayer;
}

// Create layer for available puzzles
export const createPuzzlesLayer = () => {
    const puzzleLayer = new Konva.Layer({
        x: ((window.innerWidth - boxSize*10) / 2 ),  
        y: (window.innerWidth > window.innerHeight *.62) ? window.innerHeight *0.74 : window.innerHeight * 0.63
    });

    const gap = boxSize*2 / 3;

    for(let i = 0; i < 3; i++){

        const rect = new Konva.Rect({
            x: (boxSize*2 + gap)*i, 
            y: 0, 
            width: boxSize*2, 
            height: boxSize*2, 
            fill: '#3C6E71',
            stroke: '#FFF'
        });
        
        puzzleLayer.add(rect);
    }

    return puzzleLayer;
}
