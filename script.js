const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

// game state
let cnt = 0;
let score = 0;
let jump = false;
let getScore = false;

// game parameters
const pipeWidth = 30;
const pipeInterval = 200;
const pipeToPipe = 400;
const birdWidth = 30;
const birdHeight = 30;
const birdX = 60;
const velX = 2;
const gravity = 36;
const jumpHeight = 90;
const velY = 80;
const dt = 0.1;

let pipes = [];
let bird = [];
let birdVelY = 0;

let start_btn = document.getElementById("start_btn");
start_btn.addEventListener("click", (e) => {
	start_btn.style.display = "none";
	best_score.style.display = "none";
	setup();
	window.requestAnimationFrame(step);
})

let scoreBoard = document.getElementById("score");
let bestScoreBoard = document.getElementById("best_score");

bestScoreBoard.innerHTML = "Your best score : "+localStorage.getItem("score");

//setup 
setup = () => {
	// initialize state
	cnt = 0;
	score = 0;
	scoreBoard.innerHTML = "Score : 0";
	jump = false;
	getScore = false;
	// initialize pipes
	pipes = [];
	for(let i in [0,1,2]) pipes.push([width + i*pipeToPipe, Math.random()*(height-pipeInterval)]);
	// initialize bird
	bird = [];
	birdVelY = 0;
	bird.push(birdX);
	bird.push(height/2-birdHeight/2);
}


//step
step = () => {
	cnt++;
	// initialize ctx
	ctx.clearRect(0, 0, width, height);
	// update & draw pipes
	if(pipes[0][0]<-1*pipeInterval){
		pipes[0] = pipes[1];
		pipes[1] = pipes[2];
		pipes[2] = [pipes[2][0] + pipeToPipe, Math.random()*(height-pipeInterval)];
		getScore = false;
	}
	
	for(let pipe of pipes){
		pipe[0] -= velX;
		ctx.fillRect(pipe[0], 0, pipeWidth, pipe[1]);
		ctx.fillRect(pipe[0], pipe[1]+pipeInterval, pipeWidth, height-pipe[1]-pipeInterval);
	}
	// update & draw bird
	// if jump
	if(jump){
		birdVelY = velY;
		cnt = 0;
		jump = false;
	}
	bird[1] -= birdVelY*dt;
	birdVelY -= gravity*dt;
	
	ctx.fillRect(bird[0], bird[1], birdWidth, birdHeight);
	
	//count score
	if(!getScore && pipes[0][0]+pipeWidth < birdX){
		score ++;
		scoreBoard.innerHTML = "Score : "+score;
		getScore = true;
	}
	
	//collision detection 
	
	if(pipes[0][0] < birdX+birdWidth && pipes[0][0] > birdX-pipeWidth
	  	&& (pipes[0][1] > bird[1] || pipes[0][1]+pipeInterval < bird[1]+birdHeight)
	  ){
		// game end
		if(parseInt(localStorage.getItem("score")) < score) {
			localStorage.removeItem("score");
			localStorage.setItem("score", score);
			console.log('check');
		}
		if(window.confirm("Your Score : " + score + "\nRetry?")) {
			// retry
			setup();
			window.requestAnimationFrame(step);
		}
		else {
			// move to main
			ctx.clearRect(0, 0, width, height);
			start_btn.style.display = "";
			scoreBoard.innerHTML = "";
			bestScoreBoard.style.display = "";
			bestScoreBoard.innerHTML = "Your best score : "+localStorage.getItem("score");
		}
	}
	else window.requestAnimationFrame(step);
	
}

window.addEventListener("keydown", (e) => {
	if(e.code == "Space") jump = true;
});
