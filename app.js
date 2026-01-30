const gridElement = document.getElementById("grid");
const detailContent = document.getElementById("detail-content");
const resultsCount = document.getElementById("results-count");
const searchInput = document.getElementById("search-input");
const clearSearchButton = document.getElementById("clear-search");
const summarySpots = document.getElementById("summary-spots");
const summaryPackages = document.getElementById("summary-packages");
const summaryMail = document.getElementById("summary-mail");

let cells = [];
let selectedSpotLabel = null;

const normalize = (value) => value.toLowerCase().trim();

const fetchData = async () => {
  const response = await fetch("data/grid.json");
  if (!response.ok) {
    throw new Error("No se pudo cargar data/grid.json");
  }
  return response.json();
};

const buildSpotCard = (cell) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "spot-card";
  button.dataset.spotLabel = cell.spot.spotLabel;
  button.setAttribute("role", "gridcell");
  button.innerHTML = `
    <span class="cell-label">${cell.spot.spotLabel}</span>
    <span class="cell-subtitle">${cell.spot.vehicle.model} • ${cell.spot.vehicle.color}</span>
    <span class="cell-subtitle">${cell.spot.vehicle.plates}</span>
    <span class="cell-subtitle">${cell.spot.owner.name}</span>
    <span class="cell-subtitle">Depto ${cell.spot.owner.unitCode}</span>
  `;

  const pills = document.createElement("div");
  pills.className = "cell-pills";

  if (cell.spot.packagesPending > 0) {
    const packagePill = document.createElement("span");
    packagePill.className = "pill pill-packages";
    packagePill.textContent = `Paquetes ${cell.spot.packagesPending}`;
    pills.appendChild(packagePill);
  }

  if (cell.spot.owner.hasPostalMail) {
    const mailPill = document.createElement("span");
    mailPill.className = "pill pill-mail";
    mailPill.textContent = "Correo";
    pills.appendChild(mailPill);
  }

  button.appendChild(pills);

  button.addEventListener("click", () => {
    selectedSpotLabel = cell.spot.spotLabel;
    renderGrid();
    renderDetail(cell);
  });

  return button;
};

const buildEmptyCard = (cell) => {
  const empty = document.createElement("div");
  empty.className = cell.cellType === "blocked" ? "cell-blocked" : "cell-empty";
  empty.setAttribute("role", "gridcell");
  empty.textContent = cell.cellType === "blocked" ? "Bloqueado" : "Vacío";
  return empty;
};

const renderGrid = () => {
  gridElement.innerHTML = "";

  const query = normalize(searchInput.value || "");
  let visibleCount = 0;

  const packageTotal = cells
    .filter((cell) => cell.cellType === "spot")
    .reduce((sum, cell) => sum + cell.spot.packagesPending, 0);

  const mailTotal = cells
    .filter((cell) => cell.cellType === "spot" && cell.spot.owner.hasPostalMail)
    .length;

  summaryPackages.textContent = packageTotal.toString();
  summaryMail.textContent = mailTotal.toString();

  const sortedCells = cells.slice().sort((a, b) => {
    if (a.row === b.row) return a.col - b.col;
    return a.row - b.row;
  });

  sortedCells.forEach((cell) => {
    if (cell.cellType === "spot") {
      const searchable = normalize(
        `${cell.spot.vehicle.plates} ${cell.spot.owner.name} ${cell.spot.owner.unitCode} ${cell.spot.owner.tower}-${cell.spot.owner.floor}-${cell.spot.owner.unit}`
      );
      const matches = query === "" || searchable.includes(query);
      const card = buildSpotCard(cell);
      if (cell.spot.spotLabel === selectedSpotLabel) {
        card.classList.add("selected");
      }
      card.classList.toggle("hidden", !matches);
      gridElement.appendChild(card);
      if (matches) visibleCount += 1;
    } else {
      const emptyCard = buildEmptyCard(cell);
      emptyCard.classList.toggle("hidden", query !== "");
      gridElement.appendChild(emptyCard);
    }
  });

  const totalSpots = cells.filter((cell) => cell.cellType === "spot").length;
  summarySpots.textContent = totalSpots.toString();
  resultsCount.textContent = query
    ? `${visibleCount} de ${totalSpots} cajones encontrados`
    : `${totalSpots} cajones disponibles`;
};

const renderDetail = (cell) => {
  if (!cell || cell.cellType !== "spot") {
    detailContent.innerHTML = "<p>Selecciona un cajón disponible para ver la información.</p>";
    return;
  }

  detailContent.innerHTML = `
    <section aria-label="Resumen del cajón">
      <h3>${cell.spot.spotLabel} · ${cell.spot.vehicle.model}</h3>
      <p class="muted">${cell.spot.vehicle.color} · ${cell.spot.vehicle.plates}</p>
    </section>
    <dl>
      <div>
        <dt>Dueño</dt>
        <dd>${cell.spot.owner.name}</dd>
      </div>
      <div>
        <dt>Departamento</dt>
        <dd>${cell.spot.owner.unitCode}</dd>
      </div>
      <div>
        <dt>Paquetería pendiente</dt>
        <dd>${cell.spot.packagesPending}</dd>
      </div>
      <div>
        <dt>Correo postal</dt>
        <dd>${cell.spot.owner.hasPostalMail ? "Sí" : "No"}</dd>
      </div>
    </dl>
  `;
};

const setupSearch = () => {
  searchInput.addEventListener("input", () => {
    renderGrid();
  });

  clearSearchButton.addEventListener("click", () => {
    searchInput.value = "";
    renderGrid();
    searchInput.focus();
  });
};

const init = async () => {
  try {
    const data = await fetchData();
    cells = data.cells;
    renderGrid();
    setupSearch();
  } catch (error) {
    resultsCount.textContent = "Error cargando datos.";
    gridElement.innerHTML = "";
    detailContent.innerHTML = `<p>${error.message}</p>`;
  }
};

init();
