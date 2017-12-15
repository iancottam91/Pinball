import Balls from '../js/experiment/balls';

describe('newVelocity', () => {

    // Set up our document body
    document.body.innerHTML =
        '<div>' +
        '  <canvas id="myCanvas" width="480" height="320"></canvas>' +
        '  <button id="button" />' +
        '</div>';

    test('the correct new velocities are calculated', () => {

        const balls = new Balls();

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

        expect(balls.newVelocityPostBallCollision(balla, ballb)).toEqual(result);

    });

});


describe('detectBallCollision', () => {

    // Set up our document body
    document.body.innerHTML =
        '<div>' +
        '  <canvas id="myCanvas" width="480" height="320"></canvas>' +
        '  <button id="button" />' +
        '</div>';

    test('two balls overlapping should register as colliding', () => {

        const balls = new Balls();

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

        expect(balls.detectBallCollision(balla, ballb)).toEqual(true);

    });

});

