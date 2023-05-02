// Get the video and emotion text elements from the HTML
const video = document.getElementById("video");
const emotionText = document.getElementById("emotion-text");

// Initialize variables
const numParticles = 200;
let audioPlaying = null;
let timeoutId = null;

// Load the face detection and face expression models
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("models/tiny_face_detector_model"),
  faceapi.nets.faceExpressionNet.loadFromUri("models/face_expression_model"),
]).then(startVideo);

// Start the video stream and setup face detection
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );

  // When the video metadata is loaded, setup canvas and face expression detection
  video.addEventListener("loadedmetadata", () => {
    const displaySize = { width: video.videoWidth, height: video.videoHeight };
    faceapi.matchDimensions(canvas, displaySize);

    // When the video starts playing, setup face detection loop
    video.addEventListener("play", () => {
      const canvas = faceapi.createCanvasFromMedia(video);
      document.body.append(canvas);

      // Detect faces and expressions every 100ms
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

// Get the main emotion from the face expressions
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

// Update the displayed emotion and pattern
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

// Play the audio corresponding to the emotion
function playAudio(emotion) {
  if (audioPlaying === emotion) {
    return;
  }

  const currentAudio = document.getElementById(`${audioPlaying}-audio`);
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audioElement = document.getElementById(`${emotion}-audio`);
  audioElement.play().then(() => {
    audioPlaying = emotion;
  }).catch((error) => {
    console.error('Error playing audio:', error);
  });

    audioElement.addEventListener('ended', () => {
      audioElement.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    });
}

// Initialize audio playback
function initializeAudioPlayback() {
  const audioElements = document.querySelectorAll('audio');
  audioElements.forEach((audioElement) => {
    audioElement.load();
  });
}

// Handle the first user interaction
function handleFirstInteraction() {
  initializeAudioPlayback();
  document.removeEventListener('click', handleFirstInteraction);
  document.removeEventListener('touchstart', handleFirstInteraction);
  document.removeEventListener('keypress', handleFirstInteraction);
}

// Add event listeners for user interactions
document.addEventListener('click', handleFirstInteraction);
document.addEventListener('touchstart', handleFirstInteraction);
document.addEventListener('keypress', handleFirstInteraction);

