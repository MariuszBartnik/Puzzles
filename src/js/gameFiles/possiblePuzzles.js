import { setBoxSize } from './utils';

const boxSize = setBoxSize();

export const possiblePuzzles = [
    // squares
    [{x: 0, y: 0}],
    [{x: 0, y: 0}, {x: boxSize, y : 0}, {x: 0, y: boxSize}, {x: boxSize, y: boxSize}],
    [{x: 0, y: 0}, {x: boxSize, y : 0}, {x: boxSize*2, y: 0}, {x: 0, y: boxSize}, {x: boxSize, y: boxSize}, {x: boxSize*2, y: boxSize}, {x: 0, y: boxSize*2}, {x: boxSize, y: boxSize*2}, {x: boxSize*2, y: boxSize*2}],
    
    // Vertical lines
    [{x: 0, y: 0}, {x: 0, y : boxSize}],
    [{x: 0, y: 0}, {x: 0, y : boxSize}, {x: 0, y: boxSize*2}],
    [{x: 0, y: 0}, {x: 0, y : boxSize}, {x: 0, y: boxSize*2}, {x: 0, y: boxSize*3}],

    // Horizontal Lines
    [{x: 0, y: 0}, {x: boxSize, y : 0}],
    [{x: 0, y: 0}, {x: boxSize, y : 0}, {x: boxSize*2, y: 0}],
    [{x: 0, y: 0}, {x: boxSize, y : 0}, {x: boxSize*2, y: 0}, {x: boxSize*3, y: 0}],

    // L shapes - different variants
    [{x: 0, y: 0}, {x: boxSize, y: 0}, {x: 0, y: boxSize}],
    [{x: 0, y: 0}, {x: boxSize, y: 0}, {x: boxSize*2, y: 0}, {x: 0, y: boxSize}, {x: 0, y: boxSize*2}],

    [{x: 0, y: 0}, {x: boxSize, y: 0}, {x: boxSize, y: boxSize}],    
    [{x: 0, y: 0}, {x: boxSize, y: 0}, {x: boxSize*2, y: 0}, {x: boxSize*2, y: boxSize}, {x: boxSize*2, y: boxSize*2}],

    [{x: 0, y: 0}, {x: 0, y: boxSize}, {x: boxSize, y: boxSize}],    
    [{x: 0, y: 0}, {x: 0, y: boxSize}, {x: 0, y: boxSize*2}, {x: boxSize, y: boxSize*2}, {x: boxSize*2, y: boxSize*2}],

    [{x: boxSize, y: 0}, {x: 0, y: boxSize}, {x: boxSize, y: boxSize}],    
    [{x: boxSize*2, y: 0}, {x: boxSize*2, y: boxSize}, {x: 0, y: boxSize*2}, {x: boxSize, y: boxSize*2}, {x: boxSize*2, y: boxSize*2}],

    // T shapes - different variants
    [{x: 0, y: 0}, {x: 0, y: boxSize}, {x: 0, y: boxSize*2}, {x: boxSize, y: boxSize}],
    [{x: 0, y: boxSize}, {x: boxSize, y: 0}, {x: boxSize, y: boxSize}, {x: boxSize, y: boxSize*2}],
    [{x: boxSize, y: 0}, {x: 0, y: boxSize}, {x: boxSize, y: boxSize}, {x: boxSize*2, y: boxSize}],
    [{x: 0, y: 0}, {x: boxSize, y: 0}, {x: boxSize*2, y: 0}, {x: boxSize, y: boxSize}],
];