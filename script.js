const demos = {
  realestate: {
    title: "Real estate pre-sales qualifier",
    description:
      "Handles fresh project inquiries, confirms budget and location intent, then passes qualified buyers to the sales team.",
    src: "assets/audio/real-estate-demo.mp3",
    note: "Add assets/audio/real-estate-demo.mp3 to enable this demo.",
    highlights: [
      "Budget and inventory qualification",
      "Site visit scheduling",
      "Sales-ready lead summaries"
    ]
  },
  hospitality: {
    title: "Hospitality guest engagement agent",
    description:
      "Handles booking support, repeat outreach, and guest service calls built on your hospitality-tech operating experience.",
    src: "assets/audio/hospitality-demo.mp3",
    note: "Add assets/audio/hospitality-demo.mp3 to enable this demo.",
    highlights: [
      "Collect pre-checkin info",
      "Upsell hotel amenities",
      "Understand guest preference",
      "Personalize stays"
    ]
  }
};

const demoTabs = document.querySelectorAll(".demo-tab");
const demoTitle = document.querySelector("#demo-title");
const demoDescription = document.querySelector("#demo-description");
const demoSource = document.querySelector("#demo-source");
const demoAudio = document.querySelector("#demo-audio");
const audioNote = document.querySelector("#audio-note");
const demoHighlights = document.querySelector("#demo-highlights");
const spotlightPoints = document.querySelectorAll(".spotlight-points span");
const waveform = document.querySelector(".waveform");
const audioToggle = document.querySelector("#audio-toggle");
const audioProgress = document.querySelector("#audio-progress");
const audioVolume = document.querySelector("#audio-volume");
const audioTime = document.querySelector("#audio-time");

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

function setRangeProgress(element, value, max) {
  if (!element) {
    return;
  }

  const safeMax = max > 0 ? max : 1;
  const percent = `${(value / safeMax) * 100}%`;
  element.style.setProperty("--range-progress", percent);
}

function updateAudioUI() {
  if (!demoAudio) {
    return;
  }

  const duration = Number.isFinite(demoAudio.duration) ? demoAudio.duration : 0;
  const currentTime = Number.isFinite(demoAudio.currentTime) ? demoAudio.currentTime : 0;

  if (audioTime) {
    audioTime.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
  }

  if (audioProgress) {
    audioProgress.max = String(duration || 100);
    audioProgress.value = String(currentTime);
    setRangeProgress(audioProgress, currentTime, duration || 100);
  }

  if (audioVolume) {
    setRangeProgress(audioVolume, demoAudio.volume, 1);
  }

  if (audioToggle) {
    const isPlaying = !demoAudio.paused && !demoAudio.ended;
    audioToggle.classList.toggle("is-playing", isPlaying);
    audioToggle.setAttribute("aria-label", isPlaying ? "Pause audio" : "Play audio");
  }
}

function renderHighlights(items) {
  demoHighlights.innerHTML = "";
  items.forEach((item) => {
    const chip = document.createElement("span");
    chip.textContent = item;
    demoHighlights.appendChild(chip);
  });
}

function setActiveDemo(key) {
  const demo = demos[key];
  if (!demo) {
    return;
  }

  demoTabs.forEach((tab) => {
    const isActive = tab.dataset.demo === key;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  demoTitle.textContent = demo.title;
  demoDescription.textContent = demo.description;
  demoSource.src = demo.src;
  demoAudio.load();
  if (waveform) {
    waveform.classList.remove("is-playing");
  }
  if (audioToggle) {
    audioToggle.classList.remove("is-playing");
  }
  if (audioNote) {
    audioNote.innerHTML = `${demo.note.replace("assets/audio/", "<code>assets/audio/").replace(".mp3", ".mp3</code>")}`;
  }
  renderHighlights(demo.highlights);
  updateAudioUI();
}

demoTabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveDemo(tab.dataset.demo));
});

renderHighlights(demos.realestate.highlights);
updateAudioUI();

if (spotlightPoints.length > 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let activeSpotlightIndex = 0;

  function setActiveSpotlight(index) {
    spotlightPoints.forEach((point, pointIndex) => {
      point.classList.toggle("is-active", pointIndex === index);
    });
  }

  setActiveSpotlight(activeSpotlightIndex);

  window.setInterval(() => {
    activeSpotlightIndex = (activeSpotlightIndex + 1) % spotlightPoints.length;
    setActiveSpotlight(activeSpotlightIndex);
  }, 2200);
}

if (demoAudio && waveform) {
  demoAudio.addEventListener("play", () => {
    waveform.classList.add("is-playing");
    updateAudioUI();
  });

  const stopWaveform = () => {
    waveform.classList.remove("is-playing");
    updateAudioUI();
  };

  demoAudio.addEventListener("timeupdate", updateAudioUI);
  demoAudio.addEventListener("loadedmetadata", updateAudioUI);
  demoAudio.addEventListener("volumechange", updateAudioUI);
  demoAudio.addEventListener("pause", stopWaveform);
  demoAudio.addEventListener("ended", stopWaveform);
  demoAudio.addEventListener("emptied", stopWaveform);
}

if (audioToggle && demoAudio) {
  audioToggle.addEventListener("click", async () => {
    if (demoAudio.paused) {
      try {
        await demoAudio.play();
      } catch {
        updateAudioUI();
      }
    } else {
      demoAudio.pause();
    }
  });
}

if (audioProgress && demoAudio) {
  audioProgress.addEventListener("input", () => {
    demoAudio.currentTime = Number(audioProgress.value);
    setRangeProgress(audioProgress, Number(audioProgress.value), Number(audioProgress.max) || 100);
    updateAudioUI();
  });
}

if (audioVolume && demoAudio) {
  audioVolume.addEventListener("input", () => {
    demoAudio.volume = Number(audioVolume.value);
    setRangeProgress(audioVolume, Number(audioVolume.value), 1);
  });
}

const tiltCards = document.querySelectorAll(".tilt-card");

tiltCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
    const rotateX = -((event.clientY - bounds.top) / bounds.height - 0.5) * 8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});
