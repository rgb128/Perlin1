'use strict';

const STYLE_ID = 6; // todo random

const STYLES = [
	// Lava Lamp
	{
		backgroundColor: 'black',
		speed: .001,
		stylesPath: 'lava_lamp.css',
		palette: [
			{position: 0.0, r: 10, g: 0, b: 0,},
			{position: .28, r: 250, g: 0, b: 0,},
			{position: .54, r: 10, g: 0, b: 0,},
			{position: 1.0, r: 10, g: 0, b: 0,},
		],
	},

	// Son of a beach
	{
		backgroundColor: 'white',
		speed: .001,
		defaultBlur: 0,
		palette: [
			{position: (0/7), r: 255, g: 255, b: 255},
			{position: (1/7), r: 222, g: 50, b: 76},
			{position: (2/7), r: 244, g: 137, b: 95},
			{position: (3/7), r: 248, g: 225, b: 111},
			{position: (4/7), r: 149, g: 207, b: 146},
			{position: (5/7), r: 54, g: 154, b: 204},
			{position: (6/7), r: 150, g: 86, b: 162},
			{position: (7/7), r: 255, g: 255, b: 255},
		],
	},

	// Pressure eyes
	{
		backgroundColor: 'white',
		speed: .002,
		defaultBlur: 50,
		palette: [
			{position: .00, r: 0,   g: 0,   b: 0},
			{position: .05, r: 255, g: 0,   b: 0},
			{position: .10, r: 255, g: 127, b: 0},
			{position: .15, r: 255, g: 255, b: 0},
			{position: .20, r: 0,   g: 255, b: 0},
			{position: .25, r: 0,   g: 0,   b: 255},
			{position: .30, r: 106, g: 13,  b: 173},
		
			{position: .35, r: 255, g: 0,   b: 0},
			{position: .40, r: 255, g: 127, b: 0},
			{position: .45, r: 255, g: 255, b: 0},
			{position: .50, r: 0,   g: 255, b: 0},
			{position: .55, r: 0,   g: 0,   b: 255},
			{position: .60, r: 106, g: 13,  b: 173},
		
			{position: .65, r: 255, g: 0,   b: 0},
			{position: .70, r: 255, g: 127, b: 0},
			{position: .75, r: 255, g: 255, b: 0},
			{position: .80, r: 0,   g: 255, b: 0},
			{position: .85, r: 0,   g: 0,   b: 255},
			{position: .90, r: 106, g: 13,  b: 173},
			{position: .95, r: 255, g: 0,   b: 0},
			{position: 1.0, r: 0,   g: 0,   b: 0},
		],
	},

	// Сops on tail
	{
		backgroundColor: 'black',
		speed: .01,
		defaultBlur: 150,
		palette: [
			{position: 0.0,r: 0, g: 0, b: 0,},

			{position: .25, r: 400, g: 0, b: 0,},
			{position: .40, r: 0, g: 0, b: 0,},

			{position: .45, r: 0, g: 0, b: 400,},
			{position: .46, r: 0, g: 0, b: 0,},

			{position: 1.0, r: 0, g: 0, b: 0,},
		],
	},

	// This cloud looks like...
	{
		backgroundColor: '#194a7a',
		speed: .0003,
		defaultBlur: 50,
		palette: [
			{position: 0.0, r: 0, g: 0, b: 0,},

			{position: .25, r: 255, g: 255, b: 255,},

			{position: .45, r: 25, g: 74, b: 122,},

			{position: 1.0, r: 255, g: 255, b: 255,},
		],
	},

	// Fireflies in a box
	{
		backgroundColor: 'black',
		speed: 0.0035,
		defaultBlur: 50,
		palette: [
			{position: .00, r: 0, g: 0, b: 0},
			{position: .20, r: 0, g: 0, b: 0},
			{position: .25, r: 255, g: 180, b: 77},
			{position: .28, r: 0, g: 0, b: 0},
			{position: .75, r: 0, g: 0, b: 0},
			{position: .80, r: 255, g: 180, b: 77},
			{position: .82, r: 0, g: 0, b: 0},
			{position: 1.0, r: 0, g: 0, b: 0},
		],
	},

	// Rorschach
	{
		backgroundColor: 'white',
		speed: .001,
		defaultBlur: 25,
		palette: [
			{position: 0.0, r: 255, g: 255, b: 255,},
			{position: .28, r: 255, g: 255, b: 255,},
			{position: .30, r: 0, g: 0, b: 0,},
			{position: .45, r: 0, g: 0, b: 0,},
			{position: .50, r: 255, g: 255, b: 255,},
			{position: 1.0, r: 255, g: 255, b: 255,},
		],
	},
];
// rgb(224, 187, 77)

// It MUST have position = 0 and position = 1
const COLOR_PALETTE = STYLES[STYLE_ID]
.palette
.filter(filterColorPaletteFunc)
.sort(sortColorPaletteFunc);


if (!COLOR_PALETTE.find(x => x.position === 0)) throw new Error('COLOR PALETTE MUST HAVE position=0');
if (!COLOR_PALETTE.find(x => x.position === 1)) throw new Error('COLOR PALETTE MUST HAVE position=1');

function sortColorPaletteFunc(a, b) {
	return a.position - b.position;
}

function filterColorPaletteFunc(x) {
	return x.position >= 0 && x.position <= 1;
}


/** @param position [0..1] */
function getColor(position) {
	if (position < 0) position = 0;
	if (position > 1) position = 1;

	let i = 0;
	for (i = 0; i < COLOR_PALETTE.length; i++) {
		if (COLOR_PALETTE[i].position >= position) break;
	}

	if (COLOR_PALETTE[i].position === position) {
		return {
			r: COLOR_PALETTE[i].r,
			g: COLOR_PALETTE[i].g,
			b: COLOR_PALETTE[i].b,
		};
	}

	// const bigger = COLOR_PALETTE[i];
	// const smaller = COLOR_PALETTE[i - 1];

	// const r = map(position, 0, 1, smaller.r, bigger.r);
	// const g = map(position, 0, 1, smaller.g, bigger.g);
	// const b = map(position, 0, 1, smaller.b, bigger.b);

	// return { r, g, b };

	const bigger = COLOR_PALETTE[i];
	const smaller = COLOR_PALETTE[i - 1];

	const r = map(position, smaller.position, bigger.position, smaller.r, bigger.r);
	const g = map(position, smaller.position, bigger.position, smaller.g, bigger.g);
	const b = map(position, smaller.position, bigger.position, smaller.b, bigger.b);

	return { r, g, b };

	// const bigger = COLOR_PALETTE[i];
	// const smaller = COLOR_PALETTE[i - 1];

	// // Map position relative to the smaller and bigger positions
	// const relativePosition = (position - smaller.position) / (bigger.position - smaller.position);

	// const r = map(relativePosition, 0, 1, smaller.r, bigger.r);
	// const g = map(relativePosition, 0, 1, smaller.g, bigger.g);
	// const b = map(relativePosition, 0, 1, smaller.b, bigger.b);

	// return { r, g, b };

}
