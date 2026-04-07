// ================= STORAGE HELPERS =================
const getData = key => JSON.parse(localStorage.getItem(key)) || [];
const setData = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// ================= WORKOUT =================
let workouts = getData("workouts");

function addWorkout() {
  const exercise = document.getElementById("exercise")?.value.trim();
  const reps = document.getElementById("reps")?.value.trim();

  if (!exercise || !reps) return;

  workouts.push({ exercise, reps });
  setData("workouts", workouts);

  document.getElementById("exercise").value = "";
  document.getElementById("reps").value = "";

  renderWorkouts();
}

function deleteWorkout(index) {
  workouts.splice(index, 1);
  setData("workouts", workouts);
  renderWorkouts();
}

function renderWorkouts() {
  const list = document.getElementById("workoutList");
  if (!list) return;

  list.innerHTML = workouts.map(
    (w, i) => `<li>${w.exercise} - ${w.reps} reps 
      <button onclick="deleteWorkout(${i})">❌</button></li>`
  ).join("");
}

// ================= DIET =================
let caloriesArr = getData("calories");
let proteinArr = getData("protein");

function addDiet() {
  const calories = Number(document.getElementById("calories")?.value);
  const protein = Number(document.getElementById("protein")?.value);

  if (!calories || !protein) return;

  caloriesArr.push(calories);
  proteinArr.push(protein);

  setData("calories", caloriesArr);
  setData("protein", proteinArr);

  document.getElementById("calories").value = "";
  document.getElementById("protein").value = "";

  updateTotal();
  updateChart();
}

function updateTotal() {
  const totalC = caloriesArr.reduce((a, b) => a + b, 0);
  const totalP = proteinArr.reduce((a, b) => a + b, 0);

  const totalEl = document.getElementById("total");
  if (totalEl) totalEl.innerText = `Calories: ${totalC} | Protein: ${totalP}g`;

  const goal = 120; // protein goal
  const progress = Math.min((totalP / goal) * 100, 100);

  const fill = document.getElementById("progressFill");
  if (fill) fill.style.width = progress + "%";
}

// ================= CHART =================
let chart;

function updateChart() {
  const canvas = document.getElementById("chart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: caloriesArr.map((_, i) => `Day ${i + 1}`),
      datasets: [
        { label: "Calories", data: caloriesArr, borderWidth: 2 },
        { label: "Protein", data: proteinArr, borderWidth: 2 }
      ]
    }
  });
}

// ================= CALENDAR =================
let days = getData("days");

function generateCalendar() {
  const grid = document.getElementById("calendarGrid");
  if (!grid) return;

  grid.innerHTML = "";
  for (let i = 1; i <= 30; i++) {
    const div = document.createElement("div");
    div.className = "day";
    div.innerText = i;

    if (days.includes(i)) div.classList.add("active");
    div.onclick = () => toggleDay(i);

    grid.appendChild(div);
  }
  updateStreak();
}

function toggleDay(day) {
  days = days.includes(day) ? days.filter(d => d !== day) : [...days, day];
  setData("days", days);
  generateCalendar();
}

function updateStreak() {
  const streakEl = document.getElementById("streak");
  if (!streakEl) return;

  if (days.length === 0) {
    streakEl.innerText = "🔥 Streak: 0 days";
    return;
  }

  const sorted = [...days].sort((a, b) => a - b);
  let streak = 1;

  for (let i = sorted.length - 1; i > 0; i--) {
    if (sorted[i] === sorted[i - 1] + 1) streak++;
    else break;
  }

  streakEl.innerText = `🔥 Streak: ${streak} days`;
}

// ================= MISSION =================
function loadMission() {
  const missions = [
    "Complete 1 workout",
    "Hit your protein goal",
    "Stay consistent today",
    "Avoid junk food",
    "Drink enough water"
  ];
  const today = new Date().getDate();
  const mission = missions[today % missions.length];

  const el = document.getElementById("missionText");
  if (el) el.innerText = mission;
}

// ================= INIT =================
window.onload = () => {
  loadMission();
  renderWorkouts();
  updateTotal();
  updateChart();
  generateCalendar();
};