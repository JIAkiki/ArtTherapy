let video;
let faceapi;
let emotions;

let colorPicker;
let brushSizeSlider;

function setup() {
    createCanvas(windowWidth, windowHeight - 50);
    background(255);

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

    // Set up video capture and Face API
    video = createCapture(VIDEO);
    video.size(width, height);
    video.hide();

    const faceapi_options = {
    withLandmarks: false,
    withDescriptors: false,
    withExpressions: true,
    model: 'FaceLandmark68TinyNet'
    };
    faceapi = ml5.faceApi(video, faceapi_options, onFaceapiReady);
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

function onFaceapiReady() {
    console.log('Face API model ready!');
    faceapi.detect(gotFaces);
}

function gotFaces(error, result) {
    if (error) {
        console.error(error);
        return;
    }

    if (result) {
        emotions = result[0].expressions;
    }

    faceapi.detect(gotFaces);
}
