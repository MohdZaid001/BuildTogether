
//========================DATABASE========================
const peoples = [
  { id: 1, name: "Aarav Sharma", role: "Frontend developer", skills: ["Frontend", "UI/UX"], initials: "AS" },
  { id: 2, name: "Meera Kapoor", role: "Machine learning student", skills: ["AI/ML", "Python"], initials: "MK" },
  { id: 3, name: "Kabir Singh", role: "Backend developer", skills: ["Backend", "Frontend"], initials: "KS" },
  { id: 4, name: "Ananya Verma", role: "Product designer", skills: ["UI/UX"], initials: "AV" },
  { id: 5, name: "Rohan Das", role: "IoT enthusiast", skills: ["Hardware/IoT", "Backend"], initials: "RD" },
  { id: 6, name: "Ishita Rao", role: "AI developer", skills: ["AI/ML", "Backend"], initials: "IR" },
  { id: 7, name: "Dev Malhotra", role: "Web developer", skills: ["Frontend"], initials: "DM" },
  { id: 8, name: "Sara Khan", role: "UX researcher", skills: ["UI/UX", "Frontend"], initials: "SK" }
];

const allTeams = [
  { id: 101, name: "Team Orbit", skill: "AI/ML", vacancies: 1, total: 4, description: "Building a smarter way to understand health data." },
  { id: 102, name: "Pixel Pioneers", skill: "UI/UX", vacancies: 2, total: 4, description: "Designing a simple and useful campus experience." },
  { id: 103, name: "Code Harbour", skill: "Backend", vacancies: 1, total: 3, description: "Creating tools that make open source easier." },
  { id: 104, name: "FinStack", skill: "Frontend", vacancies: 1, total: 4, description: "Making personal finance easier for students." }
];

//=========================================================


const readData = (key, fallback) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
};
let people = readData("bt_people", peoples);
let teams = readData("bt_teams", allTeams);
let submissions = readData("bt_submissions", []);

function saveData() {
  localStorage.setItem("bt_people", JSON.stringify(people));
  localStorage.setItem("bt_teams", JSON.stringify(teams));
  localStorage.setItem("bt_submissions", JSON.stringify(submissions));
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}

function renderPeople() {
  const grid = document.getElementById("peopleGrid");
  const query = document.getElementById("peopleSearch").value.toLowerCase().trim();
  const skill = document.getElementById("skillFilter").value;

  const filtered = people.filter(person => {
    const matchesText = person.name.toLowerCase().includes(query) ||
      person.skills.join(" ").toLowerCase().includes(query);
    const matchesSkill = skill === "All" || person.skills.includes(skill);
    return matchesText && matchesSkill;
  });

  grid.innerHTML = "";
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state">No matches found. Try another search or skill.</div>';
    return;
  }

  filtered.forEach(person => {
    const card = document.createElement("article");
    card.className = "person-card";
    card.innerHTML = `
      <div class="avatar">${person.initials}</div>
      <h3>${person.name}</h3>
      <p class="card-role">${person.role}</p>
      <div class="tag-row">${person.skills.map(skillName => `<span class="tag">${skillName}</span>`).join("")}</div>
      <button class="card-button" data-person="${person.id}">Connect</button>`;
    grid.appendChild(card);
  });
}

function renderTeams() {
  const grid = document.getElementById("teamGrid");
  grid.innerHTML = "";
  if (teams.length === 0) {
    grid.innerHTML = '<div class="empty-state">No team openings yet. Be the first to post one.</div>';
    return;
  }

  teams.forEach(team => {
    const card = document.createElement("article");
    card.className = "team-card";
    card.innerHTML = `
      <div class="team-top"><div class="team-icon">${team.name.charAt(0)}</div>
      <span class="vacancy">${team.vacancies} spot${(team.vacancies === 1 || team.vacancies === 0) ? "" : "s"} open</span></div>
      <h3>${team.name}</h3>
      <div class="card-role">Looking for: ${team.skill}</div>
      <p>${team.description || "A team looking for someone to build something useful."}</p>
      <div class="team-meta"><span>${team.total - team.vacancies}/${team.total} members</span><span>${team.skill}</span></div>
      <button class="card-button" data-team="${team.id}" ${team.vacancies === 0 ? "disabled" : ""}>${team.vacancies === 0 ? "Team is full" : "Join team"}</button>`;
    grid.appendChild(card);
  });
}

function renderSubmissions() {
  const list = document.getElementById("submissionList");
  list.innerHTML = "";
  if (submissions.length === 0) {
    list.innerHTML = '<div class="empty-state">No projects submitted yet. Your first pitch will appear here.</div>';
    return;
  }

  submissions.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "submission-item";
    card.innerHTML = `
      <h3>${item.title}</h3>
      <p>${item.track} · Submitted ${item.date}</p>
      <div class="submission-links">
        <a href="${item.github}" target="_blank" rel="noopener">GitHub ↗</a>
        <a href="${item.demo}" target="_blank" rel="noopener">Live demo ↗</a>
        <a href="${item.video}" target="_blank" rel="noopener">Video pitch ↗</a>
        <a href="#" data-delete="${index}">Remove</a>
      </div>`;
    list.appendChild(card);
  });
}

function updateStats() {
  document.getElementById("participantCount").textContent = people.length;
  document.getElementById("teamCount").textContent = teams.filter(team => team.vacancies > 0).length;
  document.getElementById("submissionCount").textContent = submissions.length;
}

document.getElementById("peopleSearch").addEventListener("input", renderPeople);
document.getElementById("skillFilter").addEventListener("change", renderPeople);

document.getElementById("peopleGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-person]");
  if (button) showToast("Connection request sent (demo).");
});

document.getElementById("teamGrid").addEventListener("click", event => {
  const button = event.target.closest("[data-team]");
  if (!button) return;
  const team = teams.find(item => item.id === Number(button.dataset.team));
  if (team && team.vacancies > 0) {
    team.vacancies--;
    saveData();
    renderTeams();
    updateStats();
    showToast(`You joined ${team.name}! (Demo)`);
  }
});

const postModal = document.getElementById("postModal");
document.getElementById("openPostModal").addEventListener("click", () => postModal.showModal());
document.getElementById("closePostModal").addEventListener("click", () => postModal.close());

document.getElementById("postForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.target;
  const values = new FormData(form);
  const newTeam = {
    id: Date.now(),
    name: values.get("team").trim(),
    skill: values.get("skill"),
    vacancies: Number(values.get("vacancies")),
    total: Number(values.get("vacancies")) + 1,
    description: values.get("description").trim()
  };
  teams.unshift(newTeam);
  saveData();
  renderTeams();
  updateStats();
  form.reset();
  postModal.close();
  showToast("Your team opening is now live.");
});

document.getElementById("pitchForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.target;
  if (!form.reportValidity()) return;
  const values = new FormData(form);
  const newSubmission = {
    title: values.get("title").trim(),
    github: values.get("github").trim(),
    demo: values.get("demo").trim(),
    video: values.get("video").trim(),
    track: values.get("track"),
    date: new Date().toLocaleDateString()
  };
  submissions.unshift(newSubmission);
  saveData();
  renderSubmissions();
  updateStats();
  form.reset();
  document.getElementById("formMessage").textContent = "Your project has been submitted successfully.";
  showToast("Project pitch submitted.");
});

document.getElementById("submissionList").addEventListener("click", event => {
  const link = event.target.closest("[data-delete]");
  if (!link) return;
  event.preventDefault();
  submissions.splice(Number(link.dataset.delete), 1);
  saveData();
  renderSubmissions();
  updateStats();
  showToast("Submission removed.");
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.querySelector(".main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});
mainNav.addEventListener("click", event => {
  if (event.target.closest("a")) {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

// First render when the page opens.
renderPeople();
renderTeams();
renderSubmissions();
updateStats();
