let videoContainer = document.querySelector(".video-container");
let container = document.querySelector(".container");
let myVideo = document.getElementById("my-video");
let rotateContainer = document.querySelector(".rotate-container");
let videoControls = document.querySelector(".controls");
let playButton = document.getElementById("play-btn");
let pauseButton = document.getElementById("pauseButton");
let volume = document.getElementById("volume");
let volumeRange = document.getElementById("volume-range");
let volumeNum = document.getElementById("volume-num");
let high = document.getElementById("high");
let low = document.getElementById("low");
let mute = document.getElementById("mute");
let sizeScreen = document.getElementById("size-screen");
let screenCompress = document.getElementById("screen-compress");
let screenExpand = document.getElementById("screen-expand");
const currentProgress = document.getElementById("current-progress");
const currentTimeRef = document.getElementById("current-time");
const maxDuration = document.getElementById("max-duration");
const progressBar = document.getElementById("progress-bar");
const playbackSpeedButton = document.getElementById("playback-speed-btn");
const playbackContainer = document.querySelector(".playback");
const playbackSpeedOptions = document.querySelector(".playback-options");

function slider() {
  valPercent = (volumeRange.value / volumeRange.max) * 100;
  volumeRange.style.background = `linear-gradient(to right, #2887e3 ${valPercent}%, #000000 ${valPercent}%)`;
}

let events = {
  mouse: {
    click: "click",
  },
  touch: {
    click: "touchstart",
  },
};

let deviceType = "";

const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

playButton.addEventListener("click", () => {
  myVideo.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

pauseButton.addEventListener(
  "click",
  (pauseVideo = () => {
    myVideo.pause();
    pauseButton.classList.add("hide");
    playButton.classList.remove("hide");
  })
);

playbackContainer.addEventListener("click", () => {
  playbackSpeedOptions.classList.remove("hide");
});

window.addEventListener("click", (e) => {
  if (!playbackContainer.contains(e.target)) {
    playbackSpeedOptions.classList.add("hide");
  } else if (playbackSpeedOptions.contains(e.target)) {
    playbackSpeedOptions.classList.add("hide");
  }
});

const setPlayback = (value) => {
  playbackSpeedButton.innerText = value + "x";
  myVideo.playbackRate = value;
};

const muter = () => {
  mute.classList.remove("hide");
  high.classList.add("hide");
  low.classList.add("hide");
  myVideo.volume = 0;
  volumeNum.innerHTML = 0;
  volumeRange.value = 0;
  slider();
};

high.addEventListener("click", muter);
low.addEventListener("click", muter);

volumeRange.addEventListener("input", () => {
  let volumeValue = volumeRange.value / 100;
  myVideo.volume = volumeValue;
  volumeNum.innerHTML = volumeRange.value;

  if (volumeRange.value < 50) {
    low.classList.remove("hide");
    high.classList.add("hide");
    mute.classList.add("hide");
  } else if (volumeRange.value > 50) {
    low.classList.add("hide");
    high.classList.remove("hide");
    mute.classList.add("hide");
  }
});

screenExpand.addEventListener("click", () => {
  screenCompress.classList.remove("hide");
  screenExpand.classList.add("hide");
  videoContainer
    .requestFullscreen()
    .catch((err) => alert("Your device doesn't support full screen API"));
  if (isTouchDevice) {
    let screenOrientation =
      screen.orientation || screen.mozOrientation || screen.msOrientation;
    if (screenOrientation.type == "portrait-primary") {
      pauseVideo();
      rotateContainer.classList.remove("hide");
      const myTimeout = setTimeout(() => {
        rotateContainer.classList.add("hide");
      }, 3000);
    }
  }
});

document.addEventListener("fullscreenchange", exitHandler);
document.addEventListener("webkitfullscreenchange", exitHandler);
document.addEventListener("mozfullscreenchange", exitHandler);
document.addEventListener("MSFullscreenchange", exitHandler);

function exitHandler() {
  if (
    !document.fullscreenElement &&
    !document.webkitIsFullScreen &&
    !document.mozFullScreen &&
    !document.msFullscreenElement
  ) {
    normalScreen();
  }
}

screenCompress.addEventListener(
  "click",
  (normalScreen = () => {
    screenCompress.classList.add("hide");
    screenExpand.classList.remove("hide");
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  })
);

const timeFormatter = (timeInput) => {
  let minute = Math.floor(timeInput / 60);
  minute = minute < 10 ? "0" + minute : minute;
  let second = Math.floor(timeInput % 60);
  second = second < 10 ? "0" + second : second;
  return `${minute}:${second}`;
};


setInterval(() => {
  currentTimeRef.innerHTML = timeFormatter(myVideo.currentTime);
  currentProgress.style.width =
    (myVideo.currentTime / myVideo.duration.toFixed(3)) * 100 + "%";
}, 1000);


myVideo.addEventListener("timeupdate", () => {
  currentTimeRef.innerText = timeFormatter(myVideo.currentTime);
});


isTouchDevice();
progressBar.addEventListener(events[deviceType].click, (event) => {

  let coordStart = progressBar.getBoundingClientRect().left;

  let coordEnd = !isTouchDevice() ? event.clientX : event.touches[0].clientX;
  let progress = (coordEnd - coordStart) / progressBar.offsetWidth;

  currentProgress.style.width = progress * 100 + "%";

  myVideo.currentTime = progress * myVideo.duration;

  myVideo.play();
  pauseButton.classList.remove("hide");
  playButton.classList.add("hide");
});

window.onload = () => {

  myVideo.onloadedmetadata = () => {
    maxDuration.innerText = timeFormatter(myVideo.duration);
  };
  slider();
};
