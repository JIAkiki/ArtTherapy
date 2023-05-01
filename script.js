const video = document.getElementById("video");
const emotionText = document.getElementById("emotion-text");
const numParticles = 200;
let audioPlaying = null;
let timeoutId = null;

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

  video.addEventListener("loadedmetadata", () => {
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    video.addEventListener("play", () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);

      setInterval(async () => {
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        if (detections[0]) {
          updateMainEmotion(detections[0].expressions);
        }
      }, 100);
    });
  });
}

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
      playAudio("happy");
      break;
    case "sad":
      emotionText.textContent = "Sad";
      updatePattern("sad");
      playAudio("sad");
      break;
    default:
      emotionText.textContent = "Normal";
      updatePattern("neutral");
      playAudio("neutral");
      break;
  }
}


let intervalId = null;

function playAudio(emotion) {
  if (audioPlaying === emotion) {
    return;
  }

  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    const audioElement = document.getElementById(`${emotion}-audio`);
    audioElement.play().then(() => {
      audioPlaying = emotion;
    }).catch((error) => {
      console.error('Error playing audio:', error);
    });
  }, 1000);
}

function initializeAudioPlayback() {
  const audioElements = document.querySelectorAll('audio');
  audioElements.forEach((audioElement) => {
    audioElement.load();
  });
}


function handleFirstInteraction() {
  initializeAudioPlayback();
  document.removeEventListener('click', handleFirstInteraction);
  document.removeEventListener('touchstart', handleFirstInteraction);
  document.removeEventListener('keypress', handleFirstInteraction);
}


document.addEventListener('click', handleFirstInteraction);
document.addEventListener('touchstart', handleFirstInteraction);
document.addEventListener('keypress', handleFirstInteraction);

