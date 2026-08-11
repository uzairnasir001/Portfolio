// Music button functionality
document.addEventListener("DOMContentLoaded", function () {
  const musicBtn = document.getElementById("musicBtn");
  const mobileMusicBtn = document.getElementById("mobileMusicBtn");
  const audio = document.getElementById("bgMusic");

  const themeToggle = document.getElementById("themeToggle");
  const mobileThemeToggle = document.getElementById("mobileThemeToggle");
  const html = document.documentElement;

  function setMusicState(isPlaying) {
    if (isPlaying) {
      musicBtn.classList.add("playing");
      if (mobileMusicBtn) mobileMusicBtn.classList.add("playing");
    } else {
      musicBtn.classList.remove("playing");
      if (mobileMusicBtn) mobileMusicBtn.classList.remove("playing");
    }
  }

  function toggleMusic() {
    if (audio.paused) {
      audio.play().catch((e) => console.log("Autoplay prevented:", e));
      audio.volume = 0.5; // Moderate volume
      setMusicState(true);
    } else {
      audio.pause();
      setMusicState(false);
    }
  }

  musicBtn.addEventListener("click", toggleMusic);
  if (mobileMusicBtn) mobileMusicBtn.addEventListener("click", toggleMusic);

  function setTheme(isLight) {
    if (isLight) {
      html.classList.add("light-mode");
      themeToggle.classList.add("active");
      if (mobileThemeToggle) mobileThemeToggle.classList.add("active");
      localStorage.setItem("theme", "light");
    } else {
      html.classList.remove("light-mode");
      themeToggle.classList.remove("active");
      if (mobileThemeToggle) mobileThemeToggle.classList.remove("active");
      localStorage.setItem("theme", "dark");
    }
  }

  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme === "light");

  function toggleTheme() {
    const isLight = !html.classList.contains("light-mode");
    setTheme(isLight);
  }

  themeToggle.addEventListener("click", toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener("click", toggleTheme);

  audio.addEventListener("ended", () => {
    setMusicState(false);
  });
});

const pages = [
  "introduction",
  "about",
  "projects",
  "skills",
  "experience",
  "education",
  "contact",
];
const nextLabels = {
  introduction: "About Me",
  about: "Projects",
  projects: "Skills & Tools",
  skills: "Experience",
  experience: "Education",
  education: "Contact",
  contact: "",
};
let current = "introduction";

function navigateTo(page) {
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("page-" + page).classList.add("active");
  document
    .querySelectorAll(".sidebar-item")
    .forEach((i) => i.classList.toggle("active", i.dataset.page === page));
  current = page;
  const label = nextLabels[page];
  const btn = document.getElementById("bottom-next");
  if (label) {
    document.getElementById("bottom-next-label").textContent = label;
    btn.style.display = "flex";
  } else {
    btn.style.display = "none";
  }
  if (window.innerWidth <= 900) {
    closeSidebar();
  }
  window.scrollTo(0, 0);
}

function navigateNext() {
  const idx = pages.indexOf(current);
  if (idx < pages.length - 1) navigateTo(pages[idx + 1]);
}

function openSidebar() {
  document.querySelector(".sidebar").classList.add("open");
  document.getElementById("sidebarBackdrop").classList.add("open");
}

function closeSidebar() {
  document.querySelector(".sidebar").classList.remove("open");
  document.getElementById("sidebarBackdrop").classList.remove("open");
}

function toggleSidebar() {
  document.querySelector(".sidebar").classList.toggle("open");
  document.getElementById("sidebarBackdrop").classList.toggle("open");
}

function updateClock() {
  const now = new Date();
  const value = [now.getHours(), now.getMinutes(), now.getSeconds()]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
  document.querySelectorAll(".clock").forEach((el) => {
    el.textContent = value;
  });
}
updateClock();
setInterval(updateClock, 1000);

const cmdData = {
  links: [
    { label: "Home", action: () => navigateTo("introduction"), icon: "page" },
  ],
  sections: [
    { label: "Introduction", action: () => navigateTo("introduction") },
    { label: "About Me", action: () => navigateTo("about") },
    { label: "Projects", action: () => navigateTo("projects") },
    { label: "Skills & Tools", action: () => navigateTo("skills") },
    { label: "Experience", action: () => navigateTo("experience") },
    { label: "Education", action: () => navigateTo("education") },
    { label: "Contact", action: () => navigateTo("contact") },
  ],
};

function openCmd() {
  document.getElementById("cmdOverlay").classList.add("open");
  setTimeout(() => document.getElementById("cmdInput").focus(), 50);
  renderCmd("");
}

function closeCmd() {
  document.getElementById("cmdOverlay").classList.remove("open");
  document.getElementById("cmdInput").value = "";
}

function renderCmd(query) {
  const q = query.toLowerCase().trim();
  const results = document.getElementById("cmdResults");

  const filteredLinks = cmdData.links.filter((i) =>
    i.label.toLowerCase().includes(q),
  );
  const filteredSections = cmdData.sections.filter((i) =>
    i.label.toLowerCase().includes(q),
  );

  if (!filteredLinks.length && !filteredSections.length) {
    results.innerHTML = `<div class="cmd-no-results">No results for "<strong>${query}</strong>"</div>`;
    return;
  }

  let html = "";

  if (filteredLinks.length) {
    html += `<div class="cmd-group-label">Links</div>`;
    filteredLinks.forEach((item) => {
      html += `<div class="cmd-item" onclick="selectCmd(this)">
        <div class="cmd-item-icon">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        </div>
        ${item.label}
      </div>`;
    });
  }

  if (filteredSections.length) {
    html += `<div class="cmd-group-label">Sections</div>`;
    filteredSections.forEach((item) => {
      html += `<div class="cmd-item" onclick="selectCmd(this)">
        <div class="cmd-circle-icon"></div>
        ${item.label}
      </div>`;
    });
  }

  results.innerHTML = html;
}

function selectCmd(el) {
  const label = el.textContent.trim();
  const allItems = [...cmdData.links, ...cmdData.sections];
  const match = allItems.find((i) => i.label === label);
  if (match) {
    match.action();
    closeCmd();
  }
}

document
  .getElementById("cmdInput")
  .addEventListener("input", (e) => renderCmd(e.target.value));

document.getElementById("cmdClose").addEventListener("click", closeCmd);

document.getElementById("cmdOverlay").addEventListener("click", function (e) {
  if (e.target === this) closeCmd();
});

document.addEventListener("keydown", function (e) {
  if ((e.metaKey || e.ctrlKey) && e.key === "k") {
    e.preventDefault();
    openCmd();
  }
  if (e.key === "Escape") closeCmd();
});

document.querySelector(".search-box").addEventListener("click", openCmd);
document.getElementById("sidebarToggle").addEventListener("click", toggleSidebar);
document.getElementById("sidebarBackdrop").addEventListener("click", closeSidebar);
window.addEventListener("resize", function () {
  if (window.innerWidth > 900) closeSidebar();
});

const projectsData = [
  {
    id: "weather",
    title: "Weather App | React.js",
    short:
      "A responsive weather dashboard built with React and Vite that fetches live weather data from the OpenWeatherMap API.",
    desc: "This weather app gives users quick access to real-time weather information for any city. It includes a polished interface, live data fetching, and responsive design that works well across devices. The project demonstrates my frontend skills in API integration, state management, and UI development with React.",
    stack: ["React.js", "Vite", "JavaScript", "OpenWeatherMap API", "CSS"],
    features: [
      "Live weather information for any city search",
      "Responsive and modern dashboard layout",
      "Clean UI with mobile-friendly design",
      "Dynamic data rendering from API responses",
      "Deployed live for easy access and testing",
    ],
    challenges: [
      "Handling async API requests and error states gracefully.",
      "Designing a clean weather dashboard that remains readable on smaller screens.",
      "Improving data presentation for multiple weather conditions.",
    ],
    learnings: [
      "Strengthened my knowledge of React component structure and state updates.",
      "Improved API integration and handling asynchronous data flows.",
      "Learned how to build a more polished and user-centric frontend experience.",
    ],
    live: "https://weather-app-peach-omega-36.vercel.app/",
    github: "#",
  },
  {
    id: "spotify",
    title: "Spotify Clone | JavaScript",
    short:
      "A music player-inspired UI built in JavaScript with dynamic song rendering and interactive controls.",
    desc: "This Spotify-inspired clone focuses on creating a familiar and engaging music experience with a responsive interface and interactive controls. The project highlights my ability to build dynamic frontend experiences using JavaScript, including playlist logic, controls, and smooth user interaction.",
    stack: ["JavaScript", "HTML", "CSS", "Responsive Design", "Audio UI"],
    features: [
      "Spotify-inspired music interface with dynamic track display",
      "Interactive play, pause, previous, and next controls",
      "Responsive layout for desktop and mobile screens",
      "Audio playback experience with custom UI states",
      "Clean, polished design built around a music streaming concept",
    ],
    challenges: [
      "Creating a realistic music-player interface with limited assets.",
      "Synchronizing UI states with playback actions and song selection.",
      "Making the design responsive while keeping usability high.",
    ],
    learnings: [
      "Improved my JavaScript logic and DOM manipulation capabilities.",
      "Learned to design interactive audio interfaces with better usability.",
      "Deepened my understanding of responsive front-end UI design.",
    ],
    live: "https://spotify-clone-theta-sooty.vercel.app/",
    github: "#",
  },
];

function openProject(id) {
  const p = projectsData.find((x) => x.id === id);
  if (!p) return;

  document.getElementById("detail-title").textContent = p.title;
  document.getElementById("detail-short").textContent = p.short;
  document.getElementById("detail-desc").textContent = p.desc;

  document.getElementById("detail-stack").innerHTML = p.stack
    .map((s) => `<span class="tech-tag">${s}</span>`)
    .join("");

  document.getElementById("detail-features").innerHTML = p.features
    .map((f) => `<li>${f}</li>`)
    .join("");

  document.getElementById("detail-challenges").innerHTML = p.challenges
    .map((c) => `<li>${c}</li>`)
    .join("");

  document.getElementById("detail-learnings").innerHTML = p.learnings
    .map((l) => `<li>${l}</li>`)
    .join("");

  document.getElementById("detail-links").innerHTML = `
    <a class="btn-live" href="${p.live}" target="_blank" rel="noopener noreferrer">
      View Project
      <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
    ${p.github && p.github !== "#" ? `
      <a class="btn-github-link" href="${p.github}" target="_blank" rel="noopener noreferrer">
        GitHub
        <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>` : ""}
  `;

  navigateTo("project-detail");
}
