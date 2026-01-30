"use strict";

const gridEl = document.getElementById("grid");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search");
const detailContent = document.getElementById("detail-content");
const searchMeta = document.getElementById("search-meta");

let cells = [];
let selectedSpot = null;

function normalize(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function formatSpotOwner(spot) {
  return `${spot.owner.name} · ${spot.owner.unitCode}`;
}

function createCellElement(cell) {
  const cellEl = document.createElement("div");
  cellEl.className = "grid-cell";
  cellEl.dataset.row = String(cell.row);
  cellEl.dataset.col = String(cell.col);

  if (cell.cellType !== "spot") {
    cellEl.classList.add(cell.cellType === "blocked" ? "is-blocked" : "is-empty");
    cellEl.innerHTML = `<span>${cell.cellType === "blocked" ? "Bloqueado" : "Vacío"}</span>`;
    return cellEl;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.dataset.spotLabel = cell.spotLabel;
  button.setAttribute("aria-pressed", "false");
  button.innerHTML = `
    <div class="spot-label">${cell.spotLabel} · ${cell.spot.vehicle.model}</div>
    <p class="spot-owner">${formatSpotOwner(cell.spot)}</p>
  `;

  const pills = document.createElement("div");
  pills.className = "pills";
  const packagesPill = document.createElement("span");
  packagesPill.className = "pill warning";
  packagesPill.textContent = `${cell.spot.packagesPending} paquetes`;
  const mailPill = document.createElement("span");
  mailPill.className = `pill ${cell.spot.owner.hasPostalMail ? "success" : ""}`;
  mailPill.textContent = cell.spot.owner.hasPostalMail ? "Correo postal" : "Sin correo";
  pills.append(packagesPill, mailPill);

  button.addEventListener("click", () => setDetail(cell));

  cellEl.append(button, pills);
  return cellEl;
}

function renderGrid() {
  gridEl.innerHTML = "";
  cells.forEach((cell) => {
    gridEl.append(createCellElement(cell));
  });
}

function setDetail(cell) {
  if (cell.cellType !== "spot") {
    selectedSpot = null;
    detailContent.innerHTML = `<p>El cajón seleccionado está ${cell.cellType === "blocked" ? "bloqueado" : "vacío"}.</p>`;
    return;
  }

  selectedSpot = cell;
  const { spot } = cell;
  detailContent.innerHTML = `
    <div class="detail-card">
      <h3>${cell.spotLabel} · ${spot.vehicle.model}</h3>
      <ul class="detail-list">
        <li><strong>Color:</strong> ${spot.vehicle.color}</li>
        <li><strong>Placas:</strong> ${spot.vehicle.plates}</li>
        <li><strong>Dueño:</strong> ${spot.owner.name}</li>
        <li><strong>Departamento:</strong> ${spot.owner.unitCode}</li>
      </ul>
    </div>
    <div class="detail-card">
      <h3>Servicios</h3>
      <ul class="detail-list">
        <li><strong>Paquetería pendiente:</strong> ${spot.packagesPending}</li>
        <li><strong>Correo postal:</strong> ${spot.owner.hasPostalMail ? "Sí" : "No"}</li>
      </ul>
    </div>
  `;

  document.querySelectorAll(".grid-cell button").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.spotLabel === cell.spotLabel ? "true" : "false");
  });
}

function matchesQuery(cell, query) {
  if (!query) return true;
  if (cell.cellType !== "spot") return false;
  const haystack = [
    cell.spotLabel,
    cell.spot.vehicle.plates,
    cell.spot.owner.name,
    cell.spot.owner.unitCode,
    cell.spot.owner.tower
  ]
    .join(" ")
    .toLowerCase();
  return normalize(haystack).includes(query);
}

function updateSearchState() {
  const query = normalize(searchInput.value.trim());
  let matches = 0;

  document.querySelectorAll(".grid-cell").forEach((cellEl) => {
    const row = Number(cellEl.dataset.row);
    const col = Number(cellEl.dataset.col);
    const cell = cells.find((item) => item.row === row && item.col === col);
    if (!cell) return;
    const isMatch = matchesQuery(cell, query);
    if (cell.cellType === "spot" && isMatch) {
      matches += 1;
    }

    cellEl.classList.toggle("is-hidden", query && !isMatch);
    const button = cellEl.querySelector("button");
    if (button) {
      button.disabled = query && !isMatch;
    }
  });

  if (!query) {
    searchMeta.textContent = `Mostrando ${cells.filter((cell) => cell.cellType === "spot").length} cajones.`;
  } else {
    searchMeta.textContent = `Coincidencias: ${matches}.`;
  }
}

async function init() {
  try {
    const response = await fetch("data/grid.json");
    if (!response.ok) {
      throw new Error("No se pudo cargar data/grid.json");
    }
    const data = await response.json();
    cells = data.cells;
    renderGrid();
    searchMeta.textContent = `Mostrando ${cells.filter((cell) => cell.cellType === "spot").length} cajones.`;
  } catch (error) {
    searchMeta.textContent = "Error al cargar los datos.";
    gridEl.innerHTML = "<p>No se pudo cargar el dashboard.</p>";
    return;
  }

  searchInput.addEventListener("input", updateSearchState);
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    updateSearchState();
    searchInput.focus();
  });
}

init();
