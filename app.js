'use strict';

const SIZE = 500;
const SEED = 30;
const CELLS = 4; // each side is divided by CELLS (CELLS=2 means we have 4 cells etc)

class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }

    // Random function similar to Math.random(), but with a seed
    random() {
        // Use a simple linear congruential generator (LCG) formula
        // Constants are chosen based on the Numerical Recipes LCG
        this.seed = (this.seed * 1664525 + 1013904223) % 0x100000000;
        return this.seed / 0x100000000;
    }
}

const random = new SeededRandom(SEED);

/** @type HTMLCanvasElement */ const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.style.width =  SIZE + 'px';
canvas.style.height = SIZE + 'px';
canvas.width =  SIZE;
canvas.height = SIZE;

function map(num, frombottom, fromtop, tobottom, totop) {
    let a = num - frombottom;
    a *= (totop-tobottom)/(fromtop-frombottom);
    a += tobottom;
    return a;
}

function smoothstep(x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    // return 3 * x * x - 2 * x * x * x;
    return 6 * Math.pow(x, 5) - 15 * Math.pow(x, 4) + 10 * Math.pow(x, 3);
}
function interpolate(a, b, x) {
    return a + smoothstep(x) * (b - a);
}


// Calculate grid vectors
const gridAngles = [];
for(let i = 0; i < (CELLS + 1) * (CELLS + 1); i++) {
    const angleDeg = 360 * random.random();
    const angleRad = angleDeg * Math.PI / 180;
    gridAngles.push(angleRad);
}

// gridVectors are topLeft, topRight, bottomLeft, bottomRrght
function fillCell(startX, startY, gridVectors) {
    const cellSize = SIZE / CELLS;
    for(let i = 0; i < cellSize; i++) {
        for(let j = 0; j < cellSize; j++) {

            const x = i / cellSize;
            const y = j / cellSize;

            let dotProductTopLeft;
            let dotProductTopRight;
            let dotProductBottomLeft;
            let dotProductBottomRight;

            // top left
            {
                const vectorX = x;
                const vectorY = -y;
        
                const gradientX = Math.cos(gridVectors[0]);
                const gradientY = Math.sin(gridVectors[0]);

                dotProductTopLeft = vectorX * gradientX + vectorY * gradientY;
            }

            // top right
            {
                const vectorX = x - 1;
                const vectorY = -y;
        
                const gradientX = Math.cos(gridVectors[1]);
                const gradientY = Math.sin(gridVectors[1]);

                dotProductTopRight = vectorX * gradientX + vectorY * gradientY;
            }

            // bottom left
            {
                const vectorX = x;
                const vectorY = 1 - y;
        
                const gradientX = Math.cos(gridVectors[2]);
                const gradientY = Math.sin(gridVectors[2]);

                dotProductBottomLeft = vectorX * gradientX + vectorY * gradientY;
            }

            // bottom right
            {
                const vectorX = x - 1;
                const vectorY = 1 - y;
        
                const gradientX = Math.cos(gridVectors[3]);
                const gradientY = Math.sin(gridVectors[3]);

                dotProductBottomRight = vectorX * gradientX + vectorY * gradientY;
            }

            const topInterpolated = interpolate(dotProductTopLeft, dotProductTopRight, x);
            const bottomInterpolated = interpolate(dotProductBottomLeft, dotProductBottomRight, x);

            const interpolated = interpolate(topInterpolated, bottomInterpolated, y);
            // const interpolated = interpolate(topInterpolated, bottomInterpolated, y);

            const colorValue = Math.round(Math.abs(interpolated) * 255);
            // const colorValue = Math.round((interpolated + 1) / 2 * 255);
            // const colorValue = Math.round((interpolated + 1) / 2 * 255);
            // console.log(interpolated);

            context.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
            context.fillRect(startX + i, startY + j, 1, 1);
        }
    }
}

function fillAll() {
    const cellSize = SIZE / CELLS;
    for (let i = 0; i < CELLS; i++) {
        for (let j = 0; j < CELLS; j++) {
            const startX = i * cellSize;
            const startY = j * cellSize;

            const topLeftAngleIndex = i * (CELLS + 1) + j;
            const topRightAngleIndex = topLeftAngleIndex + 1;
            const bottomLeftAngleIndex = topLeftAngleIndex + 4;
            const bottomRightAngleIndex = bottomLeftAngleIndex + 1;

            fillCell(startX, startY, [topLeftAngleIndex, topRightAngleIndex, bottomLeftAngleIndex, bottomRightAngleIndex]);
            console.log([topLeftAngleIndex, topRightAngleIndex, bottomLeftAngleIndex, bottomRightAngleIndex]);
        }
    }
}
fillAll();




// setTimeout(() => {
//     window.location.reload();
// }, 1000);
