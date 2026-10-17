const fallbackProfile = {
  name: "notnyxzs",
  role: "UI/UX & Scripter",
  email: "hipolice36@gmail.com",
  github: "https://github.com/yourusername",
  linkedin: "https://www.linkedin.com/in/yourusername",
  summary: "What you ask, I deliver.",
  projects: [
    { title: "Combat Framework", description: "Responsive, server-authoritative combat with reusable weapons and abilities", stack: "Luau, RemoteEvents, raycasting" },
    { title: "Inventory & Data", description: "Persistent player inventories with safe server-side validation", stack: "Luau, DataStoreService, ModuleScripts" },
    { title: "Lobby & Match System", description: "Round flow, team assignment, map rotation, and polished game UI", stack: "Roblox Studio, Luau, TweenService" }
  ]
};

function safeExternalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function applyProfile(profile) {
  document.querySelectorAll("[data-profile]").forEach((element) => {
    const value = profile[element.dataset.profile];
    if (typeof value === "string" && value) element.textContent = value;
  });

  document.querySelectorAll("[data-profile-link]").forEach((link) => {
    const field = link.dataset.profileLink;
    const value = profile[field];
    if (field === "email" && typeof value === "string") link.href = `mailto:${value}`;
    else if (safeExternalUrl(value)) link.href = value;
    else link.hidden = true;
  });

  const projectList = document.querySelector("[data-project-list]");
  projectList.replaceChildren();
  profile.projects.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = "command-card";
    const title = document.createElement("strong");
    title.textContent = `${String(index + 1).padStart(2, "0")} // ${project.title}`;
    const description = document.createElement("span");
    description.textContent = `${project.description} · ${project.stack}`;
    card.append(title, description);
    projectList.appendChild(card);
  });
}

async function loadProfile() {
  try {
    const response = await fetch("./content.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load content");
    const content = await response.json();
    applyProfile(content.profile ?? fallbackProfile);
  } catch {
    applyProfile(fallbackProfile);
  }
}

document.querySelectorAll("[data-public-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    const selected = button.dataset.publicTab;
    document.querySelectorAll("[data-public-tab]").forEach((tab) => {
      const active = tab.dataset.publicTab === selected;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
    });
    document.querySelectorAll("[data-public-panel]").forEach((panel) => {
      const active = panel.dataset.publicPanel === selected;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  });
});

function updateClock() {
  document.querySelector("[data-clock]").textContent = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
}

loadProfile();
updateClock();
setInterval(updateClock, 1000);
