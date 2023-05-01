const video = document.getElementById("video");
const emotionText = document.getElementById("emotion-text");

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("libs"),
  faceapi.nets.faceExpressionNet.loadFromUri("libs")

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

    if (detections[0]) {
      const emotions = detections[0].expressions;
      const maxValue = Math.max(...Object.values(emotions));
      const mainEmotion = Object.keys(emotions).find(
        (key) => emotions[key] === maxValue
      );

      switch (mainEmotion) {
        case "happy":
          emotionText.textContent = "Happy";
          break;
        case "sad":
          emotionText.textContent = "Sad";
          break;
        case "neutral":
          emotionText.textContent = "Normal";
          break;
        default:
          emotionText.textContent = "Detecting...";
      }
    } else {
      emotionText.textContent = "Detecting...";
    }
  }, 100);
});
