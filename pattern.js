const numParticles = 200;
let particles = [];

let particleColors = {
  happy: [255, 153, 0],
  sad: [0, 102, 255],
  neutral: [0, 255, 0],
};
let currentParticleColor = particleColors.neutral;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (let i = 0; i < numParticles; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  background(255);
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].show();
  }
}

class Particle {
  constructor() {
    this.position = createVector(random(width), random(height));
    this.velocity = createVector(random(-1, 1), random(-1, 1));
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 2;
    this.size = random(15, 30);
  }

  update() {
    this.position.add(this.velocity);
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);

    if (this.position.x > width || this.position.x < 0) {
      this.velocity.x *= -1;
    }
    if (this.position.y > height || this.position.y < 0) {
      this.velocity.y *= -1;
    }
  }

  show() {
    noStroke();
    fill(currentParticleColor[0], currentParticleColor[1], currentParticleColor[2], this.size * 10);
    circle(this.position.x, this.position.y, this.size);
  }
}

function updatePattern(emotion) {
  currentParticleColor = particleColors[emotion];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
