const colors = {
  happy: "#FFD700",
  sad: "#3498db",
  neutral: "#95a5a6",
};

let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  for (let i = 0; i < numParticles; i++) {
    particles[i] = new Particle(random(width), random(height));
  }
}

function draw() {
  background(0, 0, 0, 25);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.alpha = 255;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 3;
  }

  show() {
    noStroke();
    fill(colors[currentEmotion], this.alpha);
    ellipse(this.x, this.y, 4);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function updatePattern(emotion) {
  currentEmotion = emotion;
}
