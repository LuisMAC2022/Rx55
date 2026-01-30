const gridElement = document.querySelector("#grid");
const detailContent = document.querySelector("#detail-content");
const detailSubtitle = document.querySelector("#detail-subtitle");
const resultsSummary = document.querySelector("#results-summary");
const searchInput = document.querySelector("#search-input");
const clearSearchButton = document.querySelector("#clear-search");

let cellsData = [];
let selectedCellId = null;

function createCellId(cell) {
  return `${cell.row}-${cell.col}`;
}

function renderGrid(layout, cells) {
  gridElement.style.gridTemplateColumns = `repeat(${layout.cols}, minmax(0, 1fr))`;
  gridElement.innerHTML = "";

  cells.forEach((cell) => {
    const cellId = createCellId(cell);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "cell";
    button.dataset.cellId = cellId;

    if (cell.cellType !== "spot") {
      button.disabled = true;
      button.classList.add(cell.cellType === "blocked" ? "is-blocked" : "is-empty");
      button.innerHTML = `
        <div class="cell-header">
          <span class="spot-label">${cell.cellType === "blocked" ? "Bloqueado" : "Vacío"}</span>
          <span class="unit-code">${cell.row}-${cell.col}</span>
        </div>
        <div class="cell-body">Sin asignación</div>
      `;
    } else {
      button.innerHTML = `
        <div class="cell-header">
          <span class="spot-label">${cell.spotLabel}</span>
          <span class="unit-code">${cell.spot.owner.unitCode}</span>
        </div>
        <div class="cell-body">
          ${cell.spot.vehicle.model} · ${cell.spot.vehicle.color}<br />
          ${cell.spot.vehicle.plates}
        </div>
        <div class="pills">
          <span class="pill ${cell.spot.packagesPending > 0 ? "warning" : ""}">
            ${cell.spot.packagesPending} paquetes
          </span>
          <span class="pill ${cell.spot.owner.hasPostalMail ? "danger" : ""}">
            ${cell.spot.owner.hasPostalMail ? "Correo pendiente" : "Sin correo"}
          </span>
        </div>
      `;
      button.addEventListener("click", () => selectCell(cellId));
    }

    gridElement.appendChild(button);
  });

  resultsSummary.textContent = `${cells.filter((cell) => cell.cellType === "spot").length} cajones activos`;
}

function renderDetail(cell) {
  if (!cell || cell.cellType !== "spot") {
    detailContent.innerHTML = '<p class="placeholder">No hay cajón seleccionado.</p>';
    detailSubtitle.textContent = "Selecciona un cajón para ver información.";
    return;
  }

  detailSubtitle.textContent = `Cajón ${cell.spotLabel} · ${cell.spot.owner.unitCode}`;
  detailContent.innerHTML = `
    <div class="detail-card">
      <h3>Auto</h3>
      <div class="detail-grid">
        <div><span>Modelo:</span> ${cell.spot.vehicle.model}</div>
        <div><span>Color:</span> ${cell.spot.vehicle.color}</div>
        <div><span>Placas:</span> ${cell.spot.vehicle.plates}</div>
      </div>
    </div>
    <div class="detail-card">
      <h3>Dueño</h3>
      <div class="detail-grid">
        <div><span>Nombre:</span> ${cell.spot.owner.name}</div>
        <div><span>Departamento:</span> ${cell.spot.owner.unitCode}</div>
        <div><span>Torre:</span> ${cell.spot.owner.tower}</div>
        <div><span>Piso:</span> ${cell.spot.owner.floor}</div>
      </div>
    </div>
    <div class="detail-card">
      <h3>Servicios</h3>
      <div class="detail-grid">
        <div><span>Paquetes pendientes:</span> ${cell.spot.packagesPending}</div>
        <div><span>Correo postal:</span> ${cell.spot.owner.hasPostalMail ? "Sí" : "No"}</div>
      </div>
    </div>
  `;
}

function selectCell(cellId) {
  selectedCellId = cellId;
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.classList.toggle("is-selected", cell.dataset.cellId === cellId);
  });
  const cell = cellsData.find((item) => createCellId(item) === cellId);
  renderDetail(cell);
}

function applySearch() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleSpots = 0;

  document.querySelectorAll(".cell").forEach((cellElement) => {
    const cell = cellsData.find((item) => createCellId(item) === cellElement.dataset.cellId);
    if (!cell || cell.cellType !== "spot") {
      const shouldHide = query.length > 0;
      cellElement.classList.toggle("is-hidden", shouldHide);
      cellElement.setAttribute("aria-hidden", shouldHide ? "true" : "false");
      return;
    }

    const haystack = [
      cell.spot.vehicle.plates,
      cell.spot.owner.name,
      cell.spot.owner.unitCode,
    ]
      .join(" ")
      .toLowerCase();

    const matches = haystack.includes(query);
    cellElement.classList.toggle("is-hidden", query.length > 0 && !matches);
    cellElement.setAttribute("aria-hidden", query.length > 0 && !matches ? "true" : "false");

    if (matches || query.length === 0) {
      visibleSpots += 1;
    }
  });

  resultsSummary.textContent = query.length
    ? `${visibleSpots} resultados encontrados`
    : `${cellsData.filter((cell) => cell.cellType === "spot").length} cajones activos`;
}

fetch("data/grid.json")
  .then((response) => response.json())
  .then((data) => {
    cellsData = data.cells;
    renderGrid(data.layout, data.cells);
  })
  .catch(() => {
    gridElement.innerHTML = "<p class=\"muted\">No se pudo cargar el mapa.</p>";
  });

searchInput.addEventListener("input", applySearch);
clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  applySearch();
});
