let canvas;
let particles = [];
let particleColors = {
  happy: [255, 153, 0],
  sad: [0, 102, 255],
  neutral: [0, 255, 0],
};
let currentParticleColor = particleColors.neutral;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  clear();
  for (let i = 0; i < particles.length; i++) {
    particles[i].createParticle();
    particles[i].moveParticle();
    particles[i].show();
  }
}

class Particle {
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.size = random(15, 30);
    this.speedX = random(-1, 1);
    this.speedY = random(-1, 1);
  }

  createParticle() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.size > 0) {
      this.size -= 0.05;
    }
  }

  moveParticle() {
    if (this.x < 0 || this.x > width) {
      this.speedX *= -1;
    }

    if (this.y < 0 || this.y > height) {
      this.speedY *= -1;
    }
  }

  show() {
    noStroke();
    fill(currentParticleColor[0], currentParticleColor[1], currentParticleColor[2], this.size * 10);
    circle(this.x, this.y, this.size);
  }
}

function updatePattern(emotion) {
  currentParticleColor = particleColors[emotion];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
