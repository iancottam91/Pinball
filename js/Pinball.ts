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
    releaseFromRight?: boolean;
    obstacles: Array<rectangle | circle>;
}

export default class Pinball {

    obstacles: Array<rectangle | circle>;
    table: HTMLCanvasElement;
    tableWidth: number;
    tableHeight: number;
    releaseAngle: number;
    releaseLineLength: number;
    releaseFromRight: boolean;
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
        this.releaseFromRight = options.releaseFromRight !== undefined ? options.releaseFromRight : true;
        options.releaseAngle ? options.releaseAngle : this.releaseAngle = 48;
        options.releaseLineLength ? options.releaseLineLength : this.releaseLineLength = 50;
        this.drawPinballAngle(this.releaseAngle, this.releaseFromRight);

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
            ctx.rect(rectangle.x0, rectangle.y0, rectangle.x1 - rectangle.x0, rectangle.y1 - rectangle.y0);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
    }

    /*
    * Draw the angle at which the pinball will be fired
    *
    * @param - number - angle 0 < angle < 90
    * @param - boolean - right fire from the right if true, left if not
    *
    */
    drawPinballAngle = (angle: number, right = true) => {
        let ctx = this.table.getContext('2d');
        if(ctx){
            ctx.beginPath();
            ctx.strokeStyle = '#0095DD';

            // set pinball start position
            if(right) {
                ctx.clearRect(this.tableWidth, this.tableHeight, -this.releaseLineLength, -this.releaseLineLength);
                ctx.moveTo(this.tableWidth, this.tableHeight);
                this.pinball.x = this.tableWidth - (this.releaseLineLength * Math.cos((angle * Math.PI)/180));
                this.pinball.y = this.tableHeight - (this.releaseLineLength * Math.sin((angle * Math.PI)/180));

                // set pinball initial velocities
                this.pinball.dx = -((this.tableWidth - this.pinball.x)/ this.releaseLineLength) * 2;
                this.pinball.dy = -((this.tableHeight - this.pinball.y)/ this.releaseLineLength) * 2;
            } else {
                ctx.clearRect(0, this.tableHeight, this.releaseLineLength, -this.releaseLineLength);
                ctx.moveTo(0, this.tableHeight);
                this.pinball.x = this.releaseLineLength * Math.cos((angle * Math.PI)/180);
                this.pinball.y = this.tableHeight - (this.releaseLineLength * Math.sin((angle * Math.PI)/180));

                // set pinball initial velocities
                this.pinball.dx = ((this.pinball.x/ this.releaseLineLength) * 2);
                this.pinball.dy = -((this.tableHeight - this.pinball.y)/ this.releaseLineLength) * 2;
            }

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
            this.releaseAngle++;
            this.drawPinballAngle(this.releaseAngle, this.releaseFromRight);
        } else if(e.keyCode == 40) { // down pressed
            this.releaseAngle--;
            this.drawPinballAngle(this.releaseAngle, this.releaseFromRight);
        } else if(e.keyCode == 13) {
            ctx.clearRect(this.tableWidth, this.tableHeight, -this.releaseLineLength, -this.releaseLineLength);
            // fire the pinball
            this.startGame();
        }
    }

    wallCollision() {
        var x = this.pinball.x;
        var y = this.pinball.y;
        var dx = this.pinball.dx;
        var dy = this.pinball.dy;
        // left or right boudnry collision
        if(x + dx > this.tableWidth-this.pinball.radius || x + dx < this.pinball.radius) {
            this.pinball.dx = -dx;
        }
        // top or bottom boudnry collision
        if(y + dy < this.pinball.radius || y + dy > this.tableHeight-this.pinball.radius) {
            this.pinball.dy = -dy;
        }    
    }

    // ** COLLIDING ** //

    rectCollisionRight(rectangle){
        if(this.pinball.x - this.pinball.radius < rectangle.x1 // hit the right side of the rect
            && this.pinball.x - this.pinball.dx - this.pinball.radius > rectangle.x1 // ball starts on the right of the rect
            && this.pinball.y - this.pinball.radius < rectangle.y1 // below the top of the rect
            && this.pinball.y + this.pinball.radius > rectangle.y0) // above the top of the rect
        {
            this.pinball.dx = - this.pinball.dx;
            return true;
        }
    }

    rectCollisionLeft(rectangle){
        if(this.pinball.x + this.pinball.radius > rectangle.x0 // hit the right side of the rect
            && this.pinball.x - this.pinball.dx - this.pinball.radius < rectangle.x0 // ball starts on the left of the rect
            && this.pinball.y - this.pinball.radius < rectangle.y1 // below the top of the rect
            && this.pinball.y + this.pinball.radius > rectangle.y0) // above the top of the rect
        {
            this.pinball.dx = - this.pinball.dx;
            return true;
        }
    }

    rectCollisionTop(rectangle){
        if(this.pinball.y + this.pinball.radius > rectangle.y0 // hit the top side of the rect
            && this.pinball.y - this.pinball.dy + this.pinball.radius < rectangle.y0 // ball starts above the rect
            && this.pinball.x + this.pinball.radius > rectangle.x0 // inside the right of the rect
            && this.pinball.x - this.pinball.radius < rectangle.x1) // inside the left of the rect
        {
            this.pinball.dy = - this.pinball.dy;
            return true;
        }
    }

    rectCollisionBottom(rectangle){
        if(this.pinball.y - this.pinball.radius < rectangle.y1 // hit the top side of the rect
            && this.pinball.y - this.pinball.dy + this.pinball.radius > rectangle.y1 // ball starts above the rect
            && this.pinball.x + this.pinball.radius > rectangle.x0 // inside the right of the rect
            && this.pinball.x - this.pinball.radius < rectangle.x1) // inside the left of the rect
        {
            this.pinball.dy = - this.pinball.dy;
            return true;
        }
    }

    postBallCollisionVector(pinball, ball) {

        // reposition the ball to prevent overlap - think i need to do this to make it actaully work
        // https://gist.github.com/CollectionOfAtoms/db3a44d71c8308f355bba472f25f848b
        // could do with some more test cases
        // mBallX = pos2x - (collisionDistance * (-Dx/D) + (float).1); //-Dx/D = sin(theta)
        // mBallY = pos2y + (collisionDistance * ( Dy/D) + (float).1); // Dy/D = cos(theta)

        var Vix = pinball.dx;
        var Viy = pinball.dy;
        var dx = pinball.x - ball.x
        var dy = pinball.y - ball.y
        var D2 = Math.pow(dx, 2) + Math.pow(dy, 2);

        var Vfx = -(((Math.pow(dx, 2) - Math.pow(dy, 2)) * Vix) - (2 * dx * dy * Viy)) / D2
        var Vfy = (((Math.pow(dy, 2) - Math.pow(dx, 2)) * -Viy) - (2 * dx * dy * Vix)) / D2

        return {
            Vfx,
            Vfy
        }
    }

    collisionDetection(obstacles){

        for(let i=0; i<obstacles.length; i++) {

            // check for circle obstacles
            if(obstacles[i].type === 'circle'){
                const balls = new Balls();
                if(balls.detectBallCollision(this.pinball, obstacles[i], this.tableHeight)) {
                    console.log('hit the ball');
                    var ball = obstacles[i];

                    var newVelocity = this.postBallCollisionVector(this.pinball, ball);

                    this.pinball.dx = newVelocity.Vfx;
                    this.pinball.dy = newVelocity.Vfy;

                }
            }

            // check for rectangle collision
            if(obstacles[i].type === 'rectangle') {
                const rectange = obstacles[i];
                // right wall
                this.rectCollisionRight(rectange);
                this.rectCollisionLeft(rectange);
                this.rectCollisionTop(rectange);
                this.rectCollisionBottom(rectange);

            }

            // check for wall collisions
            this.wallCollision();

        }

    }

    // ** COLLIDING END ** //

}
