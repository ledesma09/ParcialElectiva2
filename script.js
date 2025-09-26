const lastDateInput = document.getElementById("lastDate");
const cycleLengthInput = document.getElementById("cycleLength");
const periodLengthInput = document.getElementById("periodLength");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");

const nextPeriodEl = document.getElementById("nextPeriod");
const fertileRangeEl = document.getElementById("fertileRange");
const ovulationDayEl = document.getElementById("ovulationDay");

const monthLabel = document.getElementById("monthLabel");
const yearLabel = document.getElementById("yearLabel");
const daysGrid = document.getElementById("daysGrid");

let currentDate = new Date();
let data = JSON.parse(localStorage.getItem("cycleData")) || null;

function saveData() {
  data = {
    lastDate: lastDateInput.value,
    cycleLength: parseInt(cycleLengthInput.value),
    periodLength: parseInt(periodLengthInput.value)
  };
  localStorage.setItem("cycleData", JSON.stringify(data));
  updateSummary();
  renderCalendar();
}

function clearData() {
  localStorage.removeItem("cycleData");
  data = null;
  nextPeriodEl.textContent = "—";
  fertileRangeEl.textContent = "—";
  ovulationDayEl.textContent = "—";
  daysGrid.innerHTML = "";
}

function updateSummary() {
  if (!data || !data.lastDate) return;

  const lastDate = new Date(data.lastDate);
  const nextPeriod = new Date(lastDate);
  nextPeriod.setDate(nextPeriod.getDate() + data.cycleLength);

  const ovulation = new Date(nextPeriod);
  ovulation.setDate(ovulation.getDate() - 14);

  const fertileStart = new Date(ovulation);
  fertileStart.setDate(fertileStart.getDate() - 5);

  const fertileEnd = new Date(ovulation);
  fertileEnd.setDate(fertileEnd.getDate() + 1);

  nextPeriodEl.textContent = nextPeriod.toLocaleDateString();
  ovulationDayEl.textContent = ovulation.toLocaleDateString();
  fertileRangeEl.textContent = `${fertileStart.toLocaleDateString()} - ${fertileEnd.toLocaleDateString()}`;
}

function renderCalendar() {
  daysGrid.innerHTML = "";
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  monthLabel.textContent = currentDate.toLocaleString("es-ES", { month: "long" });
  yearLabel.textContent = year;

  const firstDay = new Date(year, month, 1).getDay() || 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i < firstDay; i++) {
    daysGrid.appendChild(document.createElement("div"));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.textContent = day;

    if (data && data.lastDate) {
      const lastDate = new Date(data.lastDate);
      const dayDate = new Date(year, month, day);

      // período
      for (let i = 0; i < data.periodLength; i++) {
        const periodDay = new Date(lastDate);
        periodDay.setDate(periodDay.getDate() + i);
        if (sameDate(periodDay, dayDate)) {
          cell.style.background = "var(--period)";
          cell.style.color = "#fff";
        }
      }

      // fértil y ovulación
      const nextPeriod = new Date(lastDate);
      nextPeriod.setDate(nextPeriod.getDate() + data.cycleLength);

      const ovulation = new Date(nextPeriod);
      ovulation.setDate(ovulation.getDate() - 14);

      const fertileStart = new Date(ovulation);
      fertileStart.setDate(fertileStart.getDate() - 5);

      const fertileEnd = new Date(ovulation);
      fertileEnd.setDate(fertileEnd.getDate() + 1);

      if (dayDate >= fertileStart && dayDate <= fertileEnd) {
        cell.style.background = "var(--fertile)";
        cell.style.color = "#fff";
      }
      if (sameDate(dayDate, ovulation)) {
        cell.style.background = "var(--ovulation)";
        cell.style.color = "#fff";
      }
    }

    daysGrid.appendChild(cell);
  }
}

function sameDate(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

saveBtn.addEventListener("click", saveData);
clearBtn.addEventListener("click", clearData);

document.getElementById("prevMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});
document.getElementById("nextMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

if (data) {
  lastDateInput.value = data.lastDate;
  cycleLengthInput.value = data.cycleLength;
  periodLengthInput.value = data.periodLength;
  updateSummary();
}

renderCalendar();
