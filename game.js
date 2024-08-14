const canvas = document.getElementById('game-canvas');
 const ctx = canvas.getContext('2d');
 const startScreen = document.getElementById('start-screen');
 const gameOverScreen = document.getElementById('game-over-screen');
 const startButton = document.getElementById('start-button');
 const restartButton = document.getElementById('restart-button');
 const finalScoreElement = document.getElementById('final-score');
 const voiceLevelBar = document.getElementById('voice-level-bar');

 let bird, pipes, score, audioContext, analyser, dataArray;
 let isGameOver = false;
 let lastJumpTime = 0;
 const PIPE_SPACING = 200;
 const PIPE_SPEED = 2;
 const BIRD_JUMP_SPEED = -5;
 const GRAVITY = 0.35;
 const JUMP_COOLDOWN = 150; // Cooldown in milliseconds

const SENSITIVITY = 3

 class Bird {
     constructor() {
         this.x = canvas.width / 4;
         this.y = canvas.height / 2;
         this.radius = 20;
         this.velocity = 0;
     }

     draw() {
         ctx.fillStyle = 'yellow';
         ctx.beginPath();
         ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
         ctx.fill();
     }

     update() {
         this.velocity += GRAVITY;
         this.y += this.velocity;

         if (this.y + this.radius > canvas.height) {
             this.y = canvas.height - this.radius;
             this.velocity = 0;
             gameOver();
         }
     }

     jump() {
         const currentTime = Date.now();
         if (currentTime - lastJumpTime > JUMP_COOLDOWN) {
             this.velocity = BIRD_JUMP_SPEED;
             lastJumpTime = currentTime;
         }
     }
 }
 class Pipe {
     constructor(x) {
         this.x = x;
         this.width = 50;
         this.gapStart = Math.random() * (canvas.height - 200) + 100;
         this.gapHeight = 150;
         this.passed = false;
     }

     draw() {
         ctx.fillStyle = 'green';
         ctx.fillRect(this.x, 0, this.width, this.gapStart);
         ctx.fillRect(this.x, this.gapStart + this.gapHeight, this.width, canvas.height - (this.gapStart + this.gapHeight));
     }

     update() {
         this.x -= PIPE_SPEED;
         if (!this.passed && this.x + this.width < bird.x) {
             this.passed = true;
             score++;
         }
     }
 }

 function initGame() {
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
     bird = new Bird();
     pipes = [new Pipe(canvas.width)];
     score = 0;
     isGameOver = false;
 }

 function drawScore() {
     ctx.fillStyle = 'white';
     ctx.font = '24px Arial';
     ctx.fillText(`Score: ${score}`, 10, 30);
 }

 function gameLoop() {
     if (isGameOver) return;

     ctx.clearRect(0, 0, canvas.width, canvas.height);

     bird.update();
     bird.draw();

     pipes.forEach((pipe, index) => {
         pipe.update();
         pipe.draw();

         if (pipe.x + pipe.width < 0) {
             pipes.splice(index, 1);
         }

         if (checkCollision(bird, pipe)) {
             gameOver();
             return;
         }
     });

     if (pipes[pipes.length - 1].x < canvas.width - PIPE_SPACING) {
         pipes.push(new Pipe(canvas.width));
     }

     drawScore();

     analyseAudio();

     requestAnimationFrame(gameLoop);
 }

 function checkCollision(bird, pipe) {
     return (
         bird.x + bird.radius > pipe.x &&
         bird.x - bird.radius < pipe.x + pipe.width &&
         (bird.y - bird.radius < pipe.gapStart || bird.y + bird.radius > pipe.gapStart + pipe.gapHeight)
     );
 }

 function gameOver() {
     isGameOver = true;
     gameOverScreen.classList.remove('hidden');
     finalScoreElement.textContent = score;
 }

 function analyseAudio() {
     analyser.getByteFrequencyData(dataArray);
     let average = dataArray.reduce((a, b) => a + b) / dataArray.length ;
     average *= SENSITIVITY
    console.log('Audio level:', average);
     
     // Update voice level indicator
     const normalizedLevel = Math.min(average / 128, 1);
     voiceLevelBar.style.height = `${normalizedLevel * 100}%`;
     
     if (average > 50) { // Adjust this threshold as needed
         bird.jump();
     }
 }

 async function startAudioContext() {
     audioContext = new (window.AudioContext || window.webkitAudioContext)();
     analyser = audioContext.createAnalyser();
     analyser.fftSize = 256;
     dataArray = new Uint8Array(analyser.frequencyBinCount);

     try {
         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
         const source = audioContext.createMediaStreamSource(stream);
         source.connect(analyser);
     } catch (err) {
         console.error('Error accessing microphone:', err);
         alert('Unable to access the microphone. Please ensure you have given permission and try again.');
     }
 }

 startButton.addEventListener('click', () => {
     startScreen.classList.add('hidden');
     startAudioContext().then(() => {
         initGame();
         gameLoop();
     });
 });

 restartButton.addEventListener('click', () => {
     gameOverScreen.classList.add('hidden');
     initGame();
     gameLoop();
 });

 window.addEventListener('resize', () => {
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
 });