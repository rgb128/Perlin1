'use strict';

// It MUST have position = 0 and position = 1
const COLOR_PALETTE = [
    {
        position: 0.0,
        r: 255,
        g: 255,
        b: 255,
    },
    {
        position: (1/6),
        r: 0,
        g: 0,
        b: 255,
    },
    {
        position: .25,
        r: 255,
        g: 0,
        b: 0,
    },
    {
        position: .5,
        r: 0,
        g: 255,
        b: 0,
    },
    {
        position: 1.0,
        r: 0,
        g: 0,
        b: 0,
    },
]
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
