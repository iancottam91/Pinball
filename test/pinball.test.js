import Pinball from '../js/Pinball';

describe('addPinballTable', () => {

    // Set up our document body
    document.body.innerHTML =
        '<div id="pinball"></div>';

    test('add valid table', () => {
        const table = {
            wrapper: "pinball",
            tableWidth: 500,
            tableHeight: 400
        }

        const obstacles = [];

        const pinball = new Pinball({table, obstacles});

        expect(pinball.addPinballTable('pinball', 400, 500).tagName).toEqual('CANVAS');

    });

});

describe('postBallCollisionVector', () => {

    const table = {
        wrapper: "pinball",
        tableWidth: 500,
        tableHeight: 400
    }

    const obstacles = [];

    const pinball = new Pinball({table, obstacles});


    it('should calculate the correct vector for a collision in the x plane', () => {
        const movingBall = {
            x: 1,
            y: 3,
            dx: 4,
            dy: 0
        }

        const staticBall = {
            x: 2,
            y: 3
        }

        expect(pinball.postBallCollisionVector(movingBall, staticBall)).toEqual({
            Vfx: -4,
            Vfy: 0,
        });
    });

    it('should calculate the correct vector for a collision in the y plane', () => {
        const movingBall = {
            x: 1,
            y: 1,
            dx: 0,
            dy: 4
        }

        const staticBall = {
            x: 1,
            y: 3
        }

        expect(pinball.postBallCollisionVector(movingBall, staticBall)).toEqual({
            Vfx: -0,
            Vfy: -4,
        });
    });

    it('should calculate the correct vector for a collision where tangent is 45 degrees', () => {
        const movingBall = {
            x: 0,
            y: 0,
            dx: 3,
            dy: 0
        }

        const staticBall = {
            x: 7,
            y: 7
        }

        expect(pinball.postBallCollisionVector(movingBall, staticBall)).toEqual({
            Vfx: -0,
            Vfy: -3,
        });
    });

    it('should calculate the correct vector for a complex collison', () => {
        const movingBall = {
            x: 0,
            y: 0,
            dx: 1,
            dy: 5
        }

        const staticBall = {
            x: 7,
            y: 7
        }

        expect(pinball.postBallCollisionVector(movingBall, staticBall)).toEqual({
            Vfx: -0,
            Vfy: -3,
        });
    });

})

describe('drawObstacles', () => {

    // Set up our document body
    document.body.innerHTML =
        '<div id="pinball"></div>';

    const table = {
        wrapper: "pinball",
        tableWidth: 500,
        tableHeight: 400
    }
    const obstacles = [];
    const pinball = new Pinball({table, obstacles});

    test('draw ball', () => {
        const spy = jest.spyOn(pinball, 'drawCircle');

        pinball.drawObstacles([{
            type: 'circle',
            x: 1,
            y: 1,
            radius: 1
        }]);

        expect(spy).toHaveBeenCalled();

        spy.mockReset();
        spy.mockRestore();

    });

    test('draw rectangle', () => {
        const spy = jest.spyOn(pinball, 'drawRectangle');

        pinball.drawObstacles([{
            type: 'rectangle',
            x: 1,
            y: 1,
            radius: 1
        }]);
        expect(spy).toHaveBeenCalled();

        spy.mockReset();
        spy.mockRestore();
    });

});


// need to use jsdom for canvas support
// test('drawBall', () => {
//         // Set up our document body
//     document.body.innerHTML =
//         '<div id="pinball"></div>';
//     const obstacles = [];
//     const pinball = new Pinball({table, obstacles});
//     pinball.drawCircle(circle);
// });
