const gridEl = document.getElementById("grid");
const detailContent = document.getElementById("detail-content");
const searchInput = document.getElementById("search-input");
const clearSearch = document.getElementById("clear-search");
const summarySpots = document.getElementById("summary-spots");
const summaryPackages = document.getElementById("summary-packages");
const summaryPostal = document.getElementById("summary-postal");

let cells = [];
let activeSpotId = null;

const normalize = (value) => value.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

const buildCellButton = (cell) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `grid-cell ${cell.cellType}`;
  button.dataset.row = cell.row;
  button.dataset.col = cell.col;

  if (cell.cellType !== "spot") {
    const label = cell.cellType === "blocked" ? "Bloqueado" : "Vacío";
    button.disabled = true;
    button.setAttribute("aria-label", `${label} en fila ${cell.row}, columna ${cell.col}`);
    button.innerHTML = `
      <div class="grid-title">${label}</div>
      <span class="muted">Fila ${cell.row}, Col ${cell.col}</span>
    `;
    return button;
  }

  const { spot } = cell;
  const unitLabel = `${spot.owner.unitCode}`;

  button.setAttribute(
    "aria-label",
    `Cajón ${spot.spotLabel} para ${spot.owner.name}, depto ${unitLabel}`
  );

  button.innerHTML = `
    <div class="grid-title">
      <strong>${spot.spotLabel}</strong>
      <span>${unitLabel}</span>
    </div>
    <div>
      <div>${spot.vehicle.model}</div>
      <span class="muted">${spot.vehicle.color} · ${spot.vehicle.plates}</span>
    </div>
    <div class="pills">
      <span class="pill packages">Paquetes: ${spot.packagesPending}</span>
      ${spot.owner.hasPostalMail ? "<span class=\"pill postal\">Correo postal</span>" : ""}
    </div>
  `;

  button.addEventListener("click", () => {
    activeSpotId = spot.spotLabel;
    renderDetail(spot);
    updateActiveCell();
  });

  return button;
};

const renderDetail = (spot) => {
  if (!spot) {
    detailContent.innerHTML = `
      <div class="empty-state">
        <p>No hay un cajón seleccionado.</p>
        <p class="muted">Haz clic en un spot para ver vehículo, dueño y paquetería.</p>
      </div>
    `;
    return;
  }

  detailContent.innerHTML = `
    <div class="detail-card">
      <h3>${spot.spotLabel} · ${spot.owner.unitCode}</h3>
      <ul class="detail-list">
        <li><span>Dueño</span><strong>${spot.owner.name}</strong></li>
        <li><span>Auto</span><strong>${spot.vehicle.model} · ${spot.vehicle.color}</strong></li>
        <li><span>Placas</span><strong>${spot.vehicle.plates}</strong></li>
        <li><span>Torre</span><strong>${spot.owner.tower}</strong></li>
        <li><span>Piso</span><strong>${spot.owner.floor}</strong></li>
        <li><span>Depto</span><strong>${spot.owner.unit}</strong></li>
      </ul>
    </div>
    <div class="detail-card">
      <h3>Servicios</h3>
      <ul class="detail-list">
        <li><span>Paquetes pendientes</span><strong>${spot.packagesPending}</strong></li>
        <li><span>Correo postal</span><strong>${spot.owner.hasPostalMail ? "Sí" : "No"}</strong></li>
      </ul>
    </div>
  `;
};

const updateSummary = () => {
  const spots = cells.filter((cell) => cell.cellType === "spot");
  summarySpots.textContent = spots.length;
  summaryPackages.textContent = spots.reduce((acc, cell) => acc + cell.spot.packagesPending, 0);
  summaryPostal.textContent = spots.filter((cell) => cell.spot.owner.hasPostalMail).length;
};

const updateActiveCell = () => {
  document.querySelectorAll(".grid-cell.spot").forEach((cellEl) => {
    const isActive = cellEl.querySelector("strong")?.textContent === activeSpotId;
    cellEl.classList.toggle("active", isActive);
    if (isActive) {
      cellEl.setAttribute("aria-pressed", "true");
    } else {
      cellEl.removeAttribute("aria-pressed");
    }
  });
};

const applySearch = (term) => {
  const query = normalize(term.trim());
  document.querySelectorAll(".grid-cell.spot").forEach((cellEl) => {
    const spot = cellEl.dataset.spot
      ? JSON.parse(cellEl.dataset.spot)
      : null;
    if (!spot) return;
    const haystack = normalize(
      `${spot.vehicle.plates} ${spot.owner.name} ${spot.owner.unitCode} ${spot.vehicle.model}`
    );
    const matches = !query || haystack.includes(query);
    cellEl.style.display = matches ? "" : "none";
  });
};

const renderGrid = () => {
  gridEl.innerHTML = "";
  cells.forEach((cell) => {
    const button = buildCellButton(cell);
    if (cell.cellType === "spot") {
      button.dataset.spot = JSON.stringify(cell.spot);
    }
    gridEl.appendChild(button);
  });
};

const setupSearch = () => {
  searchInput.addEventListener("input", (event) => {
    applySearch(event.target.value);
  });
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    applySearch("");
  });
};

const loadData = async () => {
  const response = await fetch("data/grid.json");
  if (!response.ok) {
    throw new Error("No se pudo cargar data/grid.json");
  }
  return response.json();
};

const init = async () => {
  try {
    const data = await loadData();
    cells = data.cells;
    renderGrid();
    setupSearch();
    updateSummary();
  } catch (error) {
    gridEl.innerHTML = `<p class="muted">${error.message}</p>`;
  }
};

init();
