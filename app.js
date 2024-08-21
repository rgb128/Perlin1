'use strict';

const SIZE = 500;
const SEED = 10;
const CELLS = 1; // each side is divided by CELLS (CELLS=2 means we have 4 cells etc)

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
    return 3 * x * x - 2 * x * x * x;
}
function interpolate(a, b, x) {
    return a + smoothstep(x) * (b - a);
}


// Calculate grid vectors
const gridAngles = [45, 135, 135, 225].map(x => x * Math.PI / 180);
// for(let i = 0; i < (CELLS + 1) * (CELLS + 1); i++) {
//     const angleDeg = 360 * random.random();
//     const angleRad = angleDeg * Math.PI / 180;
//     gridAngles.push(angleRad);
// }
//todo calculate them for real


function fillCell(startX, startY, cellSize, gridVectors) {

}

// Calculate each pixel
for(let i = 0; i < SIZE; i++) {
    for(let j = 0; j < SIZE; j++) {

        const x = i / SIZE;
        const y = -j / SIZE;

        let dotProductTopLeft;
        let dotProductTopRight;
        let dotProductBottomLeft;
        let dotProductBottomRight;

        // top left
        {
            const vectorX = x;
            const vectorY = -y;
    
            const gradienxX = Math.cos(gridAngles[0]);
            const gradienxY = Math.sin(gridAngles[0]);

            dotProductTopLeft = vectorX * gradienxX + vectorY * gradienxY;
        }

        // top right
        {
            const vectorX = x - 1;
            const vectorY = -y;
    
            const gradienxX = Math.cos(gridAngles[1]);
            const gradienxY = Math.sin(gridAngles[1]);

            dotProductTopRight = vectorX * gradienxX + vectorY * gradienxY;
        }

        // bottom left
        {
            const vectorX = x;
            const vectorY = 1 - y;
    
            const gradienxX = Math.cos(gridAngles[2]);
            const gradienxY = Math.sin(gridAngles[2]);

            dotProductBottomLeft = vectorX * gradienxX + vectorY * gradienxY;
        }

        // bottom right
        {
            const vectorX = x - 1;
            const vectorY = 1 - y;
    
            const gradienxX = Math.cos(gridAngles[3]);
            const gradienxY = Math.sin(gridAngles[3]);

            dotProductBottomRight = vectorX * gradienxX + vectorY * gradienxY;
        }

        const topInterpolated = interpolate(dotProductTopLeft, dotProductTopRight, x);
        const bottomInterpolated = interpolate(dotProductBottomLeft, dotProductBottomRight, x);

        const interpolated = interpolate(topInterpolated, bottomInterpolated, y);

        const colorValue = Math.round(interpolated * 255);
        // console.log(interpolated);

        context.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
        context.fillRect(i, j, 1, 1);
    }
}


setTimeout(() => {
    // window.location.reload();
}, 1000);
