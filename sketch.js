let video;
let net;
let emotions;

let colorPicker;
let brushSizeSlider;

async function setup() {
  createCanvas(windowWidth, windowHeight - 50);
  background(255);

  // Your existing toolbar code...
  const toolbar = select('#toolbar');

  colorPicker = createColorPicker('black');
  colorPicker.parent(toolbar);

  createElement('br').parent(toolbar);
  createElement('br').parent(toolbar);

  createSpan('Brush size: ').parent(toolbar);
  brushSizeSlider = createSlider(1, 20, 4);
  brushSizeSlider.parent(toolbar);

  createElement('br').parent(toolbar);
  createElement('br').parent(toolbar);

  const clearButton = createButton('Clear');
  clearButton.mousePressed(clearCanvas);
  clearButton.parent(toolbar);

  // Set up video capture
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // Load face-api.js model
  await loadFaceApiModel();
  net = new faceapi.FaceLandmark68Net();
  detectFaces();
}

async function loadFaceApiModel() {
  const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
  await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
  await faceapi.loadFaceLandmarkModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
}


async function detectFaces() {
  const detections = await faceapi.detectAllFaces(video.elt, new faceapi.SsdMobilenetv1Options()).withFaceExpressions();

  if (detections.length > 0) {
    emotions = detections[0].expressions;
  }

  setTimeout(() => detectFaces(), 100);
}

function draw() {
  if (emotions) {
    let dominantEmotion = Object.keys(emotions).reduce((a, b) => (emotions[a] > emotions[b] ? a : b));

    if (dominantEmotion === 'happy') {
      background(255, 255, 100);
    } else if (dominantEmotion === 'sad') {
      background(100, 100, 255);
    } else if (dominantEmotion === 'angry') {
      background(255, 100, 100);
    } else {
      background(255);
    }
  }

  if (mouseIsPressed) {
    stroke(colorPicker.color());
    strokeWeight(brushSizeSlider.value());
    line(mouseX, mouseY, pmouseX, pmouseY);
  }
}

function clearCanvas() {
  background(255);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 50);
  background(255);
}
