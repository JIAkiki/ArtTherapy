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
  clearCanvas();

  if (videoReady && faceApiModelReady) {
    const displaySize = { width: video.width, height: video.height };
    const detections = faceapi.detectAllFaces(video.elt, options).withFaceLandmarks();

    if (detections && detections.length > 0) {
      const landmarks = detections[0].landmarks;
      const nose = landmarks.getNose();
      const nosePosition = nose[3];

      if (nosePosition) {
        const colorValue = map(nosePosition.y, 0, video.height, 0, 255);
        bgColor = color(colorValue, 100, 200);
      }
    }
  }

  background(bgColor);
  image(video, 0, 0, video.width, video.height);
}

function clearCanvas() {
  background(255);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 50);
  background(255);
}
