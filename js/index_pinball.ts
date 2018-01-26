import Pinball from './Pinball';


const table = {
    wrapper: "pinball",
    tableWidth: 500,
    tableHeight: 400
}

const obstacles = [{
	type: 'circle',
    x: 200,
    y: 200,
    dx: 0,
    dy: 0,
    radius: 20
},
{
	type: 'rectangle',
    x0: 300,
    y0: 200,
    x1: 350,
    y1: 250,
}]


const pinball = new Pinball({table, obstacles, releaseFromRight: false});
