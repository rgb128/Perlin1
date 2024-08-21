'use strict';

// FOR DEBUG ONLY. REMOVE ON RELEASE
document.getElementById('description').classList.remove('hidden');

const SIZE = 100;
const SEED = 10;
const CELLS = 2; // each side is divided by CELLS (CELLS=2 means we have 4 cells etc)
const SPEED = .001;
const HSL_DATA = '96%, 47%';
const MIN_WAIT_SEC = 1; // 10
const MAX_WAIT_SEC = 5; // 20

const PLAY_BUTTON_TEXT = 'Play';
const PAUSE_BUTTON_TEXT = 'Pause';

const BUTTON_BACK_FORWARD_STEP = 200;
const SAVE_CANVAS_SIZE = 1000;

const TEXT_FONT = 'bold 50px Arial'
const TEXT_MARGIN = 20;
const TEXT_COLOR = 'white';
const TEXT_STROKE_COLOR = 'black';
const TEXT_STROKE_WIDTH = 10;

class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }

    // Random function similar to Math.random(), but with a seed
    random() {
        // return Math.random();
        // Use a simple linear congruential generator (LCG) formula
        // Constants are chosen based on the Numerical Recipes LCG
        this.seed = (this.seed * 1664525 + 1013904223) % 0x100000000;
        return this.seed / 0x100000000;
    }
}

const random = new SeededRandom(SEED);

/** @type HTMLCanvasElement */ const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width =  SIZE;
canvas.height = SIZE;

const waitTimeMs = map(random.random(), 0, 1, MIN_WAIT_SEC, MAX_WAIT_SEC) * 1000;
console.log('waitTimeMs', waitTimeMs);

function map(num, frombottom, fromtop, tobottom, totop) {
    let a = num - frombottom;
    a *= (totop-tobottom)/(fromtop-frombottom);
    a += tobottom;
    return a;
}

// fade function
function smoothstep(x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return 6 * Math.pow(x, 5) - 15 * Math.pow(x, 4) + 10 * Math.pow(x, 3);
}
function interpolate(a, b, x) {
    // return a + x * (b - a);
    return a + smoothstep(x) * (b - a);
}


// Calculate grid vectors
const gridAngles = [];
const gridAnglesStart = [];
const gridAnglesSpeedMultiplier = [];
for(let i = 0; i < (CELLS + 1) * (CELLS + 1); i++) {
    gridAngles.push(2 * Math.PI * random.random());
    gridAnglesStart.push(gridAngles[i]);
    gridAnglesSpeedMultiplier.push(random.random());
}



// gridVectors are topLeft, topRight, bottomLeft, bottomRight
function fillCell(startX, startY, gridVectors) {
    const cellSize = SIZE / CELLS;
    for(let i = 0; i < cellSize; i++) {
        for(let j = 0; j < cellSize; j++) {

            const x = i / cellSize;
            const y = j / cellSize;

            let dotProductTopLeft, dotProductTopRight, dotProductBottomLeft, dotProductBottomRight;

            // top left
            {
                const vectorX = x;
                const vectorY = -y;

                if (vectorX < 0 || vectorY > 0) console.error('top left');
        
                const gradientX = Math.cos(gridVectors[0]);
                const gradientY = Math.sin(gridVectors[0]);

                dotProductTopLeft = vectorX * gradientX + vectorY * gradientY;
            }

            // top right
            {
                const vectorX = x - 1;
                const vectorY = -y;

                if (vectorX > 0 || vectorY > 0) console.error('top right');
        
                const gradientX = Math.cos(gridVectors[1]);
                const gradientY = Math.sin(gridVectors[1]);

                dotProductTopRight = vectorX * gradientX + vectorY * gradientY;
            }

            // bottom left
            {
                const vectorX = x;
                const vectorY = 1 - y;

                if (vectorX < 0 || vectorY < 0) console.error('bottom left');
        
                const gradientX = Math.cos(gridVectors[2]);
                const gradientY = Math.sin(gridVectors[2]);

                dotProductBottomLeft = vectorX * gradientX + vectorY * gradientY;
            }

            // bottom right
            {
                const vectorX = x - 1;
                const vectorY = 1 - y;

                if (vectorX > 0 || vectorY < 0) console.error('bottom right');
        
                const gradientX = Math.cos(gridVectors[3]);
                const gradientY = Math.sin(gridVectors[3]);

                dotProductBottomRight = vectorX * gradientX + vectorY * gradientY;
            }

            const topInterpolated = interpolate(dotProductTopLeft, dotProductTopRight, x);
            const bottomInterpolated = interpolate(dotProductBottomLeft, dotProductBottomRight, x);

            const interpolated = interpolate(topInterpolated, bottomInterpolated, y);

            const colorValue = interpolated * 360;

            context.fillStyle = `hsl(${colorValue}, ${HSL_DATA})`;
            context.fillRect(startX + i, startY + j, 1, 1);
        }
    }
}

function fillAll() {
    const cellSize = SIZE / CELLS;
    for (let i = 0; i < CELLS; i++) {
        for (let j = 0; j < CELLS; j++) {
            const startY = i * cellSize;
            const startX = j * cellSize;

            const topLeftAngleIndex = i * (CELLS + 1) + j;
            const topRightAngleIndex = topLeftAngleIndex + 1;
            const bottomLeftAngleIndex = topLeftAngleIndex + (CELLS + 1);
            const bottomRightAngleIndex = bottomLeftAngleIndex + 1;

            fillCell(startX, startY, [
                gridAngles[topLeftAngleIndex], 
                gridAngles[topRightAngleIndex], 
                gridAngles[bottomLeftAngleIndex], 
                gridAngles[bottomRightAngleIndex],
            ]);
        }
    }
}
fillAll();

let timePlaying = 0;
let timeStopped = 0;
let timeWhenStopped = -1;
let playing = true;

let previousAnimation = 0;
function onAnimationFrame(x) {
    const delta = x - previousAnimation;
    previousAnimation = x;

    if (playing) {
        timePlaying += delta;
        fillAllDependingOnTimePlaying();
    } else {
        timeStopped += delta;
        if (timeStopped > waitTimeMs && timeWhenStopped < 0) {
            timeWhenStopped = timeStopped;
            document.getElementById('description').classList.remove('hidden');
            window.scrollTo(0, document.body.scrollHeight);
        }
    }
    
    window.requestAnimationFrame(onAnimationFrame);
}
window.requestAnimationFrame(onAnimationFrame);

function fillAllDependingOnTimePlaying() {
    for (let i = 0; i < gridAngles.length; i++) {
        // gridAngles[i] += gridAnglesSpeedMultiplier[i] * delta * SPEED;
        gridAngles[i] = gridAnglesStart[i] + gridAnglesSpeedMultiplier[i] * timePlaying * SPEED;
    }
    fillAll();
}

function pausePlaying() {
    playing = false;
    document.getElementById('play-pause').innerText = PLAY_BUTTON_TEXT;
}
function resumePlaying() {
    playing = true;
    document.getElementById('play-pause').innerText = PAUSE_BUTTON_TEXT;
}

canvas.onmousedown = _ => {
    pausePlaying();
}
canvas.onmouseup = _ => {
    resumePlaying();
}
if (canvas.ontouchstart) canvas.ontouchstart = _ => {
    pausePlaying();
}
if (canvas.ontouchend) canvas.ontouchend = _ => {
    resumePlaying();
}

resumePlaying();

document.getElementById('play-pause').onclick = _ => {
    if (playing) pausePlaying();
    else resumePlaying();
}
document.getElementById('play-back').onclick = _ => {
    timePlaying -= BUTTON_BACK_FORWARD_STEP;
    fillAllDependingOnTimePlaying();
}
document.getElementById('play-forward').onclick = _ => {
    timePlaying += BUTTON_BACK_FORWARD_STEP;
    fillAllDependingOnTimePlaying();
}
document.getElementById('play-replay').onclick = _ => {
    timePlaying = 0;
    fillAllDependingOnTimePlaying();
}
document.getElementById('play-time-i-stopped').onclick = _ => {
    timePlaying = timeWhenStopped;
    fillAllDependingOnTimePlaying();
}



function createCanvasToCopyOrDownload() {
    const newCanvas = document.createElement('canvas');
    newCanvas.width = SAVE_CANVAS_SIZE;
    newCanvas.height = SAVE_CANVAS_SIZE;
    newCanvas.style.width = SAVE_CANVAS_SIZE + 'px';
    newCanvas.style.height = SAVE_CANVAS_SIZE + 'px';
    newCanvas.style.display = 'none';

    const newCtx = newCanvas.getContext('2d');

    newCtx.drawImage(
        canvas, // Assuming this is the smaller canvas with size 100x100
        0, 0, SIZE, SIZE, // Source rectangle: start at (0,0), covering the entire small canvas
        0, 0, SAVE_CANVAS_SIZE, SAVE_CANVAS_SIZE // Destination rectangle: scale it to fill the new canvas
    );

    // drawText
    {
        // Draw "some text" at the bottom right
        const text = '#808080';
        newCtx.font = TEXT_FONT
        newCtx.textAlign = 'right';
        newCtx.textBaseline = 'bottom';

        const xPos = SAVE_CANVAS_SIZE - TEXT_MARGIN; // 20 pixels from the right edge
        const yPos = SAVE_CANVAS_SIZE - TEXT_MARGIN; // 20 pixels from the bottom edge

        // Draw black stroke first
        newCtx.strokeStyle = TEXT_STROKE_COLOR;
        newCtx.lineWidth = TEXT_STROKE_WIDTH;
        newCtx.strokeText(text, xPos, yPos);

        // Draw white fill on top
        newCtx.fillStyle = TEXT_COLOR;
        newCtx.fillText(text, xPos, yPos);
    }

    // document.body.appendChild(newCanvas);

    return newCanvas;
}

document.getElementById('copy').onclick = _ => {
    document.getElementById('copy').innerText = 'Copying...';
    const newCanvas = createCanvasToCopyOrDownload();
    
    // Convert the canvas to a Blob (PNG format)
    newCanvas.toBlob(async blob => {
        const item = new ClipboardItem({ 'image/png': blob });
        
        // Copy the blob to the clipboard
        await navigator.clipboard.write([item]);
        
        console.log('Canvas copied to clipboard');

        document.getElementById('copy').innerText = 'Copied!';
        setTimeout(() => {
            document.getElementById('copy').innerText = 'Copy';
        }, 1000);
    });

    // newCanvas.remove();
}

document.getElementById('download').onclick = _ => {
    const newCanvas = createCanvasToCopyOrDownload();

    // Convert the canvas to a data URL (PNG format)
    const dataURL = newCanvas.toDataURL('image/png');

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = dataURL;

    // Generate a filename with the current timePlaying
    const timePlaying = Math.floor(Date.now() / 1000); // Example: seconds since epoch
    link.download = `perlin-rgb128-${timePlaying}.png`;

    // Trigger the download
    link.click();

    // newCanvas.remove();
}
