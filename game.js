let bird;
let pipes = [];
let score = 0;
let gameOver = false;
let gameStarted = false;

function setup() {
  createCanvas(1000, 700);  // Increased width and height
  bird = new Bird();
  reset();
}

function draw() {
  background(135, 206, 235);
  
  if (!gameStarted) {
    fill(0);
    textAlign(CENTER);
    textSize(32);
    text('Press SPACE to start', width/2, height/2);
    return;
  }
  
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();
    if (pipes[i].hits(bird)) {
      gameOver = true;
    }
    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
      score++;
    }
  }

  bird.show();
  bird.update();

  if (frameCount % 120 == 0) {
    pipes.push(new Pipe());
  }

  // Draw score with a background for better visibility
  fill(255, 255, 255, 200);
  rect(20, 20, 200, 60, 10);
  fill(0);
  textAlign(LEFT, TOP);
  textSize(32);
  text('Score: ' + score, 30, 35);

  if (gameOver) {
    textAlign(CENTER);
    fill(0);
    text('Game Over', width/2, height/2);
    text('Press SPACE to restart', width/2, height/2 + 40);
  }
}

function keyPressed() {
  if (key == ' ') {
    if (!gameStarted) {
      gameStarted = true;
    } else if (gameOver) {
      reset();
    } else {
      bird.up();
    }
  }
}

function reset() {
  bird = new Bird();
  pipes = [];
  score = 0;
  gameOver = false;
  loop();
}

class Bird {
  constructor() {
    this.y = height/2;
    this.x = 150;  // Moved further right
    this.gravity = 0.4;
    this.lift = -10;
    this.velocity = 0;
    this.size = 40;
  }

  show() {
    push();
    translate(this.x, this.y);
    rotate(this.velocity * 0.05);
    fill(255, 255, 0);
    triangle(0, 0, this.size, -this.size/2, this.size, this.size/2);
    pop();
  }

  up() {
    this.velocity += this.lift;
  }

  update() {
    if (!gameOver) {
      this.velocity += this.gravity;
      this.velocity *= 0.9;
      this.y += this.velocity;
      this.y = constrain(this.y, this.size, height - this.size);
    }
  }

  getBoundingBox() {
    return {
      left: this.x,
      right: this.x + this.size,
      top: this.y - this.size/2,
      bottom: this.y + this.size/2
    };
  }
}

class Pipe {
  constructor() {
    this.spacing = 200;  // Increased spacing
    this.top = random(height / 6, 2 / 3 * height);
    this.bottom = height - (this.top + this.spacing);
    this.x = width;
    this.w = 100;  // Increased width
    this.speed = 1.5;
  }

  show() {
    this.drawBrickPipe(this.x, 0, this.w, this.top);
    this.drawBrickPipe(this.x, height - this.bottom, this.w, this.bottom);
  }

  drawBrickPipe(x, y, w, h) {
    push();
    translate(x, y);
    let brickWidth = 25;
    let brickHeight = 12;
    for (let i = 0; i < h; i += brickHeight) {
      for (let j = 0; j < w; j += brickWidth) {
        fill(139, 69, 19);
        rect(j, i, brickWidth - 1, brickHeight - 1);
        fill(165, 42, 42);
        rect(j, i, brickWidth - 2, brickHeight - 2);
      }
    }
    pop();
  }

  update() {
    if (!gameOver) {
      this.x -= this.speed;
    }
  }

  offscreen() {
    return (this.x < -this.w);
  }

  hits(bird) {
    let box = bird.getBoundingBox();
    return (box.
