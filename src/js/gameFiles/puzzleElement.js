import Konva from 'konva';
import { possiblePuzzles } from './possiblePuzzles';
import { setBoxSize } from './utils';
const boxSize = setBoxSize();

// Generate random puzzles and adding them to Konva's Puzzle Layer
export const createRandomPuzzles = (puzzleLayer) => {
    const availablePuzzles = [];
    const gap = boxSize*2 / 3;

    for(let i = 0; i < 3; i++){
        const randomNumber = Math.round(Math.random() * (possiblePuzzles.length - 1));

        const puzzleElement = new Konva.Group({
            id: i, 
            x: (boxSize*2 + gap)*i,
            y:0,
            scaleX: 0.5,
            scaleY: 0.5,
            draggable: true
        });

        possiblePuzzles[randomNumber].forEach(puzzleBox => {
            const box = new Konva.Rect({
                x: puzzleBox.x,
                y: puzzleBox.y,
                width: boxSize,
                height: boxSize,
                fill: '#fff',
                stroke: '#353535',
                strokeScaleEnabled: false
            });
    
            puzzleElement.add(box);
        });

        availablePuzzles.push(puzzleElement);
        puzzleLayer.add(puzzleElement);
    }

    return availablePuzzles;
};