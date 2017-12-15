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
