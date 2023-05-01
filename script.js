const video = document.getElementById("video");
const emotionText = document.getElementById("emotion-text");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("models/tiny_face_detector_model"),
  faceapi.nets.faceExpressionNet.loadFromUri("models/face_expression_model"),
]).then(startVideo);

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    if (detections[0]) {
      updateMainEmotion(detections[0].expressions);
    }
  }, 100);
});

function getMainEmotion(expressions) {
  const emotions = Object.keys(expressions);
  let mainEmotion = emotions[0];
  let maxConfidence = expressions[mainEmotion];

  emotions.forEach((emotion) => {
    if (expressions[emotion] > maxConfidence) {
      mainEmotion = emotion;
      maxConfidence = expressions[emotion];
    }
  });

  return mainEmotion;
}

function updateMainEmotion(expressions) {
  const mainEmotion = getMainEmotion(expressions);
  switch (mainEmotion) {
    case "happy":
      emotionText.textContent = "Happy";
      updatePattern("happy");
      break;
    case "sad":
      emotionText.textContent = "Sad";
      updatePattern("sad");
      break;
    default:
      emotionText.textContent = "Normal";
      updatePattern("neutral");
      break;
  }
}
