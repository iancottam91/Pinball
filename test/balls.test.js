var expect = require('expect')
var newVelocity from '../js/balls';

var balla = {
    x: 3,
    y: 5,
    dx: 1, // ball velocity
    dy: 1, // ball velocity
}

var ballb = {
    x: 6,
    y: 9,
    dx: -1, // ball velocity
    dy: -1, // ball velocity
}

var result = {
	dx: -0.6800000000000002,
	dy: -1.2400000000000002
}

expect(newVelocity(balla, ballb)).toEqual(10);
