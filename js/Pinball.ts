import Balls from './experiment/balls';

interface rectangle {
    type: string;
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}

interface circle {
    type: string;
    x: number;
    y: number;
    radius: number;
}

interface pinball {
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
    pendingdx: number;
    pendingdy: number;
}

interface constructorOpts {
    table: {
        wrapper: string;
        tableWidth: number
        tableHeight: number
    }
    releaseAngle?: number;
    releaseLineLength?: number;
    obstacles: Array<rectangle | circle>;
}

export default class Pinball {

    obstacles: Array<rectangle | circle>;
    table: HTMLCanvasElement;
    tableWidth: number;
    tableHeight: number;
    releaseAngle: number;
    releaseLineLength: number;
    pinball: pinball;

    constructor(options: constructorOpts){

        // Add table
        if(options && options.table){
            const { table } = options;
            this.table = <HTMLCanvasElement>this.addPinballTable(table.wrapper, table.tableWidth, table.tableHeight);
            this.tableWidth = table.tableWidth;
            this.tableHeight = table.tableHeight;
        } else {
            throw new Error('No table option provided');
        }

        // Add obstacles
        if(options && options.obstacles){
            this.obstacles = options.obstacles;
            this.drawObstacles(this.obstacles);
        }

        // Add pinball
        this.pinball = {
            x: 0,
            y: 0,
            dx: 0,
            dy: 0,
            pendingdx: 0,
            pendingdy: 0,
            radius: 10
        }

        // Draw pinball shooting angle
        options.releaseAngle ? options.releaseAngle : this.releaseAngle = 45;
        options.releaseLineLength ? options.releaseLineLength : this.releaseLineLength = 50;
        this.drawPinballAngle(this.releaseAngle);

        // listen for keyboard up and down press
        document.addEventListener("keydown", this.handleKeyDown, false);

    }

    addPinballTable(wrapper: string, tableWidth: number, tableHeight: number){
        var gameWrapper = <HTMLElement>document.getElementById('pinball');
        gameWrapper.innerHTML = `<canvas width=${tableWidth} height=${tableHeight}></canvas>`;
        return gameWrapper.firstElementChild;
    }

    // ** DRAWING ** //

    drawObstacles(obstacles: Array<rectangle | circle>){

        // do this with typescript somehow?
        obstacles.map((obstacle) => {
            switch (obstacle.type) {
                case "circle":
                    this.drawCircle(obstacle);
                    break;

                case "rectangle":
                    this.drawRectangle(obstacle);
                    break;
                
                default:
                    // code...
                    break;
            }
        });
    }

    // would be good to throw error if shape is drawn off the canvas 
    drawCircle(circle){
        let ctx = this.table.getContext('2d');
        if(ctx){    
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI*2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
    }

    // would be good to throw error if shape is drawn off the canvas
    drawRectangle(rectangle){
        let ctx = this.table.getContext('2d');
        if(ctx){
            ctx.beginPath();
            ctx.rect(rectangle.x0, rectangle.y0, rectangle.x0 - rectangle.x1, rectangle.y0 - rectangle.y1);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
    }

    /*
    * Draw the angle at which the pinball will be fired
    *
    * @param - angle - number 0 < angle < 90
    *
    */
    drawPinballAngle = (angle: number) => {
        let ctx = this.table.getContext('2d');
        if(ctx){
            ctx.beginPath();
            ctx.strokeStyle = '#0095DD';
            ctx.moveTo(this.tableWidth, this.tableHeight);

            // set pinball start position
            this.pinball.x = this.tableWidth - (this.releaseLineLength * Math.cos((angle * Math.PI)/180));
            this.pinball.y = this.tableHeight - (this.releaseLineLength * Math.sin((angle * Math.PI)/180));

            // set pinball initial velocities
            this.pinball.dx = -((this.tableWidth - this.pinball.x)/ this.releaseLineLength) * 2;
            this.pinball.dy = -((this.tableHeight - this.pinball.y)/ this.releaseLineLength) * 2;

            ctx.lineTo(this.pinball.x, this.pinball.y);
            ctx.stroke();
        }
    }

    // ** DRAWING END ** //

    /* 
    * Begin the animation
    * Need to redraw everything after each frame
    */
    startGame = () => {
        let ctx = this.table.getContext('2d');
        ctx.clearRect(0, 0, this.tableWidth, this.tableHeight);
        this.collisionDetection(this.obstacles);
        this.drawCircle(this.pinball);        
        this.drawObstacles(this.obstacles);
        this.pinball.x += this.pinball.dx;
        this.pinball.y += this.pinball.dy;

        // re draw it all
        requestAnimationFrame(this.startGame);
    }

    handleKeyDown = (e) => {
        // remove the path visually by deleting all pixels in the chunck where the shooter is
        let ctx = this.table.getContext('2d');

        if(e.keyCode == 38) { // up pressed
            ctx.clearRect(this.tableWidth, this.tableHeight, -this.releaseLineLength, -this.releaseLineLength);
            this.releaseAngle++;
            this.drawPinballAngle(this.releaseAngle);
        } else if(e.keyCode == 40) { // down pressed
            ctx.clearRect(this.tableWidth, this.tableHeight, -this.releaseLineLength, -this.releaseLineLength);
            this.releaseAngle--;
            this.drawPinballAngle(this.releaseAngle);
        } else if(e.keyCode == 13) {
            ctx.clearRect(this.tableWidth, this.tableHeight, -this.releaseLineLength, -this.releaseLineLength);
            // fire the pinball
            this.startGame();
        }
    }

    // ** COLLIDING ** //

    collisionDetection(obstacles){

        for(let i=0; i<obstacles.length; i++) {

            // check for circle obstacles
            if(obstacles[i].type === 'circle'){
                const balls = new Balls();
                if(balls.detectBallCollision(this.pinball, obstacles[i], this.tableHeight)) {
                    console.log('hit the ball');
                    var newVelocityVector = balls.newVelocityPostBallCollision(this.pinball, obstacles[i]); // cant use this as the other ball is static
                    // need https://collectionofatoms.com/2016/05/16/ball_collisions
                    this.pinball.dx = newVelocityVector.dx;
                    this.pinball.dy = newVelocityVector.dy;
                }
            }

        }

    }

    // ** COLLIDING END ** //

}
