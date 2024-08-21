'use strict';

const SIZE = 500;

const STEP = .01;
const START_X = 10;
const START_Y = 20;

/** @type HTMLCanvasElement */ const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.style.width =  SIZE + 'px';
canvas.style.height = SIZE + 'px';
canvas.width =  SIZE;
canvas.height = SIZE;


function perlinFunction(x) {
    //sin (2 * x) + sin(pi * x)
    const value = Math.sin(2 * x) + Math.sin(Math.PI * x); // -2..+2
    const normalized = (value + 2) / 4; // 0..1
    return normalized;
}


for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
        const colorX = perlinFunction(START_X + (STEP * i));
        const colorY = perlinFunction(START_Y + (STEP * j));

        const color = colorX * colorY;
        const colorValue = Math.round(color * 255);
        // console.log(colorValue);

        context.fillStyle = `rgb(${colorX * 255}, ${colorY * 255}, ${255})`;
        context.fillRect(i, j, 1, 1);
    }
}
