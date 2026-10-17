const fallbackProfile = {
  name: "notnyxzs",
  role: "UI/UX & Scripter",
  email: "hipolice36@gmail.com",
  github: "https://github.com/yourusername",
  summary: "What you ask, I deliver."
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
