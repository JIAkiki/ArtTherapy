let emotionColors = {
  happy: ['#FFD700', '#FFA500', '#FF6347'],
  sad: ['#6495ED', '#4169E1', '#6A5ACD'],
  neutral: ['#90EE90', '#3CB371', '#2E8B57'],
};

let currentEmotion = 'neutral';

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

function draw() {
  background(255);
  let colors = emotionColors[currentEmotion];

  for (let x = 0; x < windowWidth; x += 20) {
    for (let y = 0; y < windowHeight; y += 20) {
      let index = floor(random(colors.length));
      fill(colors[index]);
      noStroke();
      ellipse(x, y, 15, 15);
    }
  }
}

function updatePattern(emotion) {
  currentEmotion = emotion;
  redraw();
}
