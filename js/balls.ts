// this.balls[0] = {
//     name: 'bottom left',
//     x: 15, // 480
//     y: 20, //320
//     dx: 2, // ball velocity
//     dy: -2, // ball velocity
// }

// this.balls[1] = {
//     name: 'top right',
//     x: 470,
//     y: 310,
//     dx: -2, // ball velocity
//     dy: 2, // ball velocity
// }

// this.balls[2] = {
//     name: 'ball 2',
//     x: 25,
//     y: 50,
//     dx: -2, // ball velocity
//     dy: 2, // ball velocity
// }

// this.balls[3] = {
//     name: 'ball 3',
//     x: this.canvas.height -100,
//     y: 100,
//     dx: -2, // ball velocity
//     dy: 2, // ball velocity
// }

interface Ball {
    name: string,
    x: number,
    y: number,
    dx: number, // ball velocity
    dy: number, // ball velocity 
    pendingdx: number,
    pendingdy: number
}

export default class Balls {

    balls: Array<any>;
    canvas: HTMLCanvasElement;
    ctx: any;
    ballRadius: number;
    ballCount: number;
    ballsDrawn: boolean;

    constructor(){
        this.balls = [];
        this.ballCount = 10;
        this.ballRadius = 10;
        this.canvas = <HTMLCanvasElement>document.getElementById("myCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.addBalls();
    }


    addBalls = () => {

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        for(var i = 0; i<=this.ballCount; i++) {
            this.balls[i] = {
                x: getRandomArbitrary(10, 470),
                y: getRandomArbitrary(10, 310),
                dx: Math.random() > 0.2 ? 2 : -2,
                dy: Math.random() > 0.5 ? 2 : -2,
            };
        }

    }

    drawBalls() {
        this.ballsDrawn = true;

        this.ctx.beginPath();

        for(var i=0; i<this.balls.length; i++) {
            var ball = this.balls[i];
            this.ctx.arc(ball.x, ball.y, this.ballRadius, 0, Math.PI*2);
            this.ctx.fillStyle = "#0095DD";
            this.ctx.fill();
            this.ctx.closePath();
        }
    }

    // following formula at bottom of https://en.wikipedia.org/wiki/Elastic_collision

    /*
    * Calculate the new velocity vector of a ball colliding with another ball
    *
    * ball - initial position as x,y 
    * ball - initial velocity vector as dx,dy 
    * ballCollidedWith - initial position as x,y 
    * ballCollidedWith - initial velocity vector as dx,dy 
    *
    * @return - newVelocity - an object representing new vector of new velocity
    */

    newVelocity(ball: Ball, ballCollidedWith: Ball) {
        var newVelocity = {
            dx: 0,
            dy: 0
        };

        var magnitude =  Math.pow(ball.x - ballCollidedWith.x, 2) + Math.pow(ball.y - ballCollidedWith.y, 2);
        var velocityDeltaX = ball.dx - ballCollidedWith.dx;
        var velocityDeltaY = ball.dy - ballCollidedWith.dy;
        var positionDeltaX = ball.x - ballCollidedWith.x;
        var positionDeltaY = ball.y - ballCollidedWith.y;
        var dotProduct = velocityDeltaX * positionDeltaX + velocityDeltaY * positionDeltaY;

        newVelocity.dx = ball.dx - (dotProduct / magnitude) * positionDeltaX;
        newVelocity.dy = ball.dy - (dotProduct / magnitude) * positionDeltaY;

        return newVelocity;
    }

    ballCollisionDetection(){
        for(let i=0; i<this.balls.length; i++) {
            var ball = this.balls[i]; // consider a ball
            // check for collision against all other balls
            for(let j=0; j<this.balls.length; j++) {
                if (i === j){ // skip if we're looking at the same ball
                    continue;
                } else {
                    var otherBall = this.balls[j];
                    // if they've collided
                    if(this.detectBallCollision(ball, otherBall)) {
                        // delete balls that have been generated as colliding in initial positions
                        if(!this.ballsDrawn){
                            this.balls.splice(i, 1);
                        }

                        // cache new velocities - must apply them after all balls have been considered to avoid 
                        // issue where the second ball in the collision doesn't have it's velocity changed
                        var newVelocityVector = this.newVelocity(ball, otherBall);
                        ball.pendingdx = newVelocityVector.dx;
                        ball.pendingdy = newVelocityVector.dy;
                    }
                }
            }
        }

        // apply all pendingdx and pendingdy to dx and dy
        this.applyNewVelocities();

    }

    detectBallCollision = (ballA: Ball, ballB: Ball) => {
        var dxsqu = Math.pow(ballA.x - ballB.x, 2);
        var dysqu = Math.pow((this.canvas.height - ballA.y) - (this.canvas.height - ballB.y), 2);
        var drsqu = Math.pow(this.ballRadius + this.ballRadius, 2);
        return dxsqu + dysqu <= drsqu;
    }

    applyNewVelocities = () => {
        this.balls.map((ball) => {
            ball.pendingdx ? ball.dx = ball.pendingdx : undefined;
            ball.pendingdy ? ball.dy = ball.pendingdy : undefined;
        });
    }

    wallCollisionDetection = (ball: Ball) => {
        var x = ball.x;
        var y = ball.y;
        var dx = ball.dx;
        var dy = ball.dy;
        // left or right boudnry collision
        if(x + dx > this.canvas.width-this.ballRadius || x + dx < this.ballRadius) {
            ball.pendingdx = -dx;
        }
        // top or bottom boudnry collision
        if(y + dy < this.ballRadius || y + dy > this.canvas.height-this.ballRadius) {
            ball.pendingdy = -dy;
        }
    }

    move_ball(ball) {
        var x = ball.x;
        var y = ball.y;
        var dx = ball.dx;
        var dy = ball.dy;
        if(x + dx > this.canvas.width-this.ballRadius || x + dx < this.ballRadius) {
            ball.pendingdx = -dx;
        }
        if(y + dy < this.ballRadius || y + dy > this.canvas.height-this.ballRadius) {
            ball.pendingdy = -dy;
        }

        x += dx;
        y += dy;
        ball.x = x;
        ball.y = y;
        ball.dx = dx;
        ball.dy = dy;
    }

    draw = () => {
        // repaint
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ballCollisionDetection();
        // for (var i = this.balls.length - 1; i >= 0; i--) {
        //     this.wallCollisionDetection(this.balls[i]);
        // }

        this.drawBalls();

        // move the balls
        for (var i = this.balls.length - 1; i >= 0; i--) {
            this.move_ball(this.balls[i]);
        }

        requestAnimationFrame(this.draw);
    }

};
