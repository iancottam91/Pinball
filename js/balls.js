var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;

var balls = [];
var inverted = false;

// create the balls
// for(ball=1; ball<=ballCount; ball++) {
//     balls[ball-1] = {
//         x: ball * ballRadius * 2,
//         y: ball * ballRadius * 2,
//         dx: 2,
//         dy: inverted ? 2 : -2,
//         inverted: inverted,
//     };
//     inverted = !inverted;
// }

balls[0] = {
    name: 'bottom left',
    x: 15,
    y: canvas.height -20,
    dx: 2, // ball velocity
    dy: -2, // ball velocity
    inverted: inverted,
}

balls[1] = {
    name: 'top right',
    x: canvas.height -20,
    y: 20,
    dx: -2, // ball velocity
    dy: 2, // ball velocity
    inverted: inverted,
}

balls[2] = {
    name: 'ball 2',
    x: 25,
    y: 50,
    dx: -2, // ball velocity
    dy: 2, // ball velocity
    inverted: inverted,
}

balls[3] = {
    name: 'ball 3',
    x: canvas.height -100,
    y: 100,
    dx: -2, // ball velocity
    dy: 2, // ball velocity
    inverted: inverted,
}


function drawBalls() {
    ctx.beginPath();

    for(i=0; i<balls.length; i++) {
        var ball = balls[i];
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI*2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
}

// following formula at bottom of https://en.wikipedia.org/wiki/Elastic_collision
function newVelocity(ball, ballCollidedWith) {
    var newVelocity = {
        dx: 0,
        dy: 0
    };

    var magnitude =  Math.pow(ball.x - ballCollidedWith.x, 2) + Math.pow(ball.y - ballCollidedWith.y, 2);
    // console.log(magnitude);

    var velocityDeltaX = ball.dx - ballCollidedWith.dx;
    var velocityDeltaY = ball.dy - ballCollidedWith.dy;
    var positionDeltaX = ball.x - ballCollidedWith.x;
    var positionDeltaY = ball.y - ballCollidedWith.y;
    var dotProduct = velocityDeltaX * positionDeltaX + velocityDeltaY * positionDeltaY;
    // console.log(dotProduct);

    newVelocity.dx = ball.dx - (dotProduct / magnitude) * positionDeltaX;
    newVelocity.dy = ball.dy - (dotProduct / magnitude) * positionDeltaY;
    console.log(ball.name + 'new vel x:' + newVelocity.dx);
    console.log(ball.name + 'new vel y:' + newVelocity.dy);
    // these are correct - ball should go back the way it came
    // BUT the first ball in the collision has already changed direction!


    return newVelocity;
}


function ballCollisionDetection(){
    for(i=0; i<balls.length; i++) {
        // consider a ball
        var ball = balls[i];
        // check for collision against all other balls
        for(j=0; j<balls.length; j++) {
            if (i === j){ // skip if we're looking at the same ball
                continue;
            } else {
                var otherBall = balls[j];
                // check for collision
                var dxsqu = Math.pow(ball.x - otherBall.x, 2);
                var dysqu = Math.pow((canvas.height - ball.y) - (canvas.height - otherBall.y), 2);
                var drsqu = Math.pow(ballRadius + ballRadius, 2);
                // console.log('distance: ' + (dxsqu - dysqu));
                // console.log('rad squd: ' + drsqu);

                // if they've collided
                if(dxsqu + dysqu <= drsqu) {
                    console.log('collision!');
                    // change their directions (get their new velocities or directions)
                    var newVelocityball = newVelocity(ball, otherBall);
                    // var newVelocityOtherBall = newVelocity(otherBall, ball);
                    // cache new velocities - must apply them after all balls have been considered to avoid 
                    // issue where the second ball in the collision doesn't have it's velocity changed
                    ball.pendingdx = newVelocityball.dx;
                    ball.pendingdy = newVelocityball.dy;
                    // break;
                }
            }
        }
    }

    // apply all pendingdx and pendingdy to dx and dy
    applyNewVelocities();

    // dont actually change dx until all of this has happened - have a holding value - change all dxs and dys after for loop??
}

applyNewVelocities = () => {
    balls.map((ball) => {
        ball.pendingdx ? ball.dx = ball.pendingdx : undefined;
        ball.pendingdy ? ball.dy = ball.pendingdy : undefined;
    });
}

function move_ball(ball) {
    var x = ball.x;
    var y = ball.y;
    var dx = ball.dx;
    var dy = ball.dy;
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        ball.pendingdx = -dx;
    }
    if(y + dy < ballRadius || y + dy > canvas.height-ballRadius) {
        ball.pendingdy = -dy;
    }

    x += dx;
    y += dy;
    ball.x = x;
    ball.y = y;
    ball.dx = dx;
    ball.dy = dy;
}

function draw() {
    // repaint
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ballCollisionDetection();
    drawBalls();

    // move the balls
    for (var i = balls.length - 1; i >= 0; i--) {
        move_ball(balls[i]);
    }

    requestAnimationFrame(draw);
}

draw();
