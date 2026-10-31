const video = document.getElementById("backgroundVideo");
const pauseOverlay = document.getElementById("pauseOverlay");
const brandLink = document.getElementById("brandLink");

// Zoom in on the card once playback reaches this many seconds
const ZOOM_AT_SECONDS = 4;

function showPauseOverlay() {
  pauseOverlay.classList.add("visible");
  pauseOverlay.inert = false; // Make it focusable again when shown
}

function hidePauseOverlay() {
  pauseOverlay.classList.remove("visible");
  pauseOverlay.inert = true;  // Completely remove from focus and screen readers when hidden
}

function pauseAtStart() {
  video.pause();
  showPauseOverlay();
}

async function startVideoLoading() {
  try {
    video.currentTime = 0;
    await video.play();
    pauseAtStart();
  } catch (error) {
    showPauseOverlay();
  }
}

async function resumeVideo() {
  if (video.ended) return;

  try {
    await video.play();
    hidePauseOverlay();
  } catch (error) {
    showPauseOverlay();
  }
}

pauseOverlay.addEventListener("click", () => {
  resumeVideo();
});

pauseOverlay.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    resumeVideo();
  }
});

brandLink.addEventListener("click", (event) => {
  event.preventDefault();
  video.currentTime = 0;
  resumeVideo();
});

// Toggle the zoom from the video's own playback time,
// so it triggers 4s after play starts (and resets on restart)
video.addEventListener("timeupdate", () => {
  video.classList.toggle("is-zoomed", video.currentTime >= ZOOM_AT_SECONDS);
});

video.addEventListener("error", () => {
  console.error(
    "Video could not be loaded.",
    video.error
  );
});

// Initial state setup on load
pauseOverlay.inert = false;
startVideoLoading();