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
  if (audioNote) {
    audioNote.innerHTML = `${demo.note.replace("assets/audio/", "<code>assets/audio/").replace(".mp3", ".mp3</code>")}`;
  }
  renderHighlights(demo.highlights);
}

demoTabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveDemo(tab.dataset.demo));
});

renderHighlights(demos.realestate.highlights);

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
  });

  const stopWaveform = () => {
    waveform.classList.remove("is-playing");
  };

  demoAudio.addEventListener("pause", stopWaveform);
  demoAudio.addEventListener("ended", stopWaveform);
  demoAudio.addEventListener("emptied", stopWaveform);
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
