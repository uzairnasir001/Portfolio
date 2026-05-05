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
  "stats",
];
const nextLabels = {
  introduction: "About Me",
  about: "Projects",
  projects: "Skills & Tools",
  skills: "Experience",
  experience: "Education",
  education: "Contact",
  contact: "Stats",
  stats: "",
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
    id: "nike",
    title: "Nike Reimagined | Modern Redesign Concept",
    short:
      "A sleek and modern redesign of Nike's official web experience built with React and Tailwind CSS.",
    desc: "Nike Reimagined is a creative redesign project focused on delivering a refined, high-performance web experience inspired by Nike's global brand identity. It highlights a clean, minimal UI with smooth transitions, responsive layouts, and optimized performance across devices. The project demonstrates a balance of aesthetics and functionality for a real-world eCommerce feel.",
    stack: ["React.js", "Tailwind CSS", "Vite", "Framer Motion", "Vercel"],
    features: [
      "Minimalist and modern user interface design",
      "Fully responsive layouts optimized for all devices",
      "Smooth page transitions and animations with Framer Motion",
      "Optimized build process with Vite for fast loading",
      "Deployed on Vercel for production-grade performance",
    ],
    challenges: [
      "Maintaining brand consistency while reimagining Nike's design language.",
      "Achieving smooth animations without affecting performance.",
      "Ensuring pixel-perfect responsiveness across devices.",
      "Optimizing load times for a better user experience.",
    ],
    learnings: [
      "Mastered efficient UI composition with React and Tailwind CSS.",
      "Improved understanding of animation principles using Framer Motion.",
      "Enhanced deployment workflow using Vercel and Vite integration.",
      "Developed better practices for responsive and scalable frontend design.",
    ],
    live: "#",
    github: "#",
  },
  {
    id: "portfolio",
    title: "Portfolio | Your Name",
    short:
      "A dynamic portfolio showcasing my projects, skills, and contributions using the latest web technologies.",
    desc: "A fully responsive personal portfolio website built to highlight my skills, projects, and experience. Designed with a clean dark aesthetic and smooth navigation to provide an engaging user experience.",
    stack: ["HTML", "CSS", "JavaScript"],
    features: [
      "Clean dark theme with smooth section navigation",
      "Fully responsive across all screen sizes",
      "Interactive command palette with search",
      "Dynamic project cards with detail views",
    ],
    challenges: [
      "Building a single-file multi-section SPA without a framework.",
      "Implementing a smooth command palette from scratch.",
      "Keeping the codebase clean and maintainable.",
    ],
    learnings: [
      "Deepened understanding of vanilla JS DOM manipulation.",
      "Learned effective CSS layout techniques without frameworks.",
      "Improved overall UI/UX design sensibility.",
    ],
    live: "#",
    github: "#",
  },
  {
    id: "newshub",
    title: "News Hub | Real-Time News Platform",
    short:
      "A real-time news platform delivering the latest headlines across various categories using the News API.",
    desc: "News Hub is a responsive web application that fetches and displays real-time news articles from multiple categories. Users can browse top headlines, filter by category, and read full articles via external links.",
    stack: ["HTML", "CSS", "JavaScript", "News API"],
    features: [
      "Real-time news fetching from the News API",
      "Category-based filtering for easy browsing",
      "Responsive card layout for all devices",
      "Direct links to full articles",
    ],
    challenges: [
      "Handling API rate limits gracefully.",
      "Displaying varied image sizes consistently in cards.",
      "Managing async data fetching and error states.",
    ],
    learnings: [
      "Learned how to integrate and consume third-party REST APIs.",
      "Improved async JavaScript and fetch API skills.",
      "Practiced responsive grid layout design.",
    ],
    live: "#",
    github: "#",
  },
  {
    id: "freshmart",
    title: "Freshmart Store | Modern Grocery Web App",
    short:
      "A clean, modern, and responsive grocery store web app built with React, Vite, Redux, and Tailwind CSS.",
    desc: "Freshmart is a fully functional grocery store front-end application featuring product listings, a shopping cart, and category filtering. Built with a modern React stack for a fast and seamless shopping experience.",
    stack: ["React.js", "Redux", "Vite", "Tailwind CSS"],
    features: [
      "Product listing with category filters",
      "Shopping cart with quantity management",
      "State management using Redux",
      "Fast build and HMR with Vite",
    ],
    challenges: [
      "Managing complex cart state with Redux.",
      "Keeping UI consistent across many product types.",
      "Optimizing re-renders for a smooth experience.",
    ],
    learnings: [
      "Gained hands-on experience with Redux state management.",
      "Improved component architecture skills in React.",
      "Learned performance optimization techniques in React apps.",
    ],
    live: "#",
    github: "#",
  },
  {
    id: "github-viewer",
    title: "GitHub Profile Viewer | Instant GitHub Insights",
    short:
      "An interactive web app to instantly view GitHub profiles with clean UI built using HTML, CSS, and JavaScript.",
    desc: "GitHub Profile Viewer allows users to enter any GitHub username and instantly see their profile stats, repositories, followers, and more. Built with vanilla JavaScript and the GitHub REST API.",
    stack: ["HTML", "CSS", "JavaScript", "GitHub API"],
    features: [
      "Search any GitHub username instantly",
      "Displays profile stats, repos, and followers",
      "Clean card-based UI",
      "Error handling for invalid usernames",
    ],
    challenges: [
      "Handling GitHub API rate limiting.",
      "Designing a clean layout for varied profile data.",
      "Providing meaningful error messages to users.",
    ],
    learnings: [
      "Practiced working with the GitHub REST API.",
      "Improved skills in dynamic DOM manipulation.",
      "Learned better UX practices for search interfaces.",
    ],
    live: "#",
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
    <a class="btn-live" href="${p.live}" target="_blank">
      Live
      <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
    <a class="btn-github-link" href="${p.github}" target="_blank">
      Github
      <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>`;

  navigateTo("project-detail");
}
