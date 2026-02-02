const STORAGE_KEY = "autolavado-scenarios-v2";
const MAX_SCENARIOS = 10;

const form = document.querySelector("#controls-form");
const scenarioNameInput = document.querySelector("#scenario-name");
const priceCarInput = document.querySelector("#price-car");
const priceTruckInput = document.querySelector("#price-truck");
const marginInput = document.querySelector("#margin-pct");
const mixTruckInput = document.querySelector("#mix-truck");
const marginOutput = document.querySelector("#margin-output");
const mixOutput = document.querySelector("#mix-output");
const saveScenarioButton = document.querySelector("#save-scenario");
const saveNewScenarioButton = document.querySelector("#save-new-scenario");
const scenarioList = document.querySelector("#scenario-list");
const statusMessage = document.querySelector("#status-message");
const exportButton = document.querySelector("#export-json");
const importInput = document.querySelector("#import-json");

const kpiRevenue = document.querySelector("#kpi-revenue");
const kpiRevenueRange = document.querySelector("#kpi-revenue-range");
const kpiWashes = document.querySelector("#kpi-washes");
const kpiWashesRange = document.querySelector("#kpi-washes-range");
const kpiMargin = document.querySelector("#kpi-margin");
const kpiMarginRange = document.querySelector("#kpi-margin-range");
const kpiCarWashes = document.querySelector("#kpi-car-washes");
const kpiCarRange = document.querySelector("#kpi-car-range");
const kpiTruckWashes = document.querySelector("#kpi-truck-washes");
const kpiTruckRange = document.querySelector("#kpi-truck-range");

const chartWashes = document.querySelector("#chart-washes");
const chartRevenue = document.querySelector("#chart-revenue");
const chartWashesSummary = document.querySelector("#chart-washes-summary");
const chartRevenueSummary = document.querySelector("#chart-revenue-summary");

let appState = loadState();
let recalcTimeout = null;

function createScenario(overrides = {}) {
  const now = new Date().toISOString();
  return {
    meta: {
      scenarioId: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      createdAt: now,
      updatedAt: now,
      name: "Escenario base",
      description: "Escenario activo base (MVP Fase 1)"
    },
    config: {
      universeVehicles: 50,
      horizonWeeks: 52,
      weeksPerMonth: 4,
      replicas: 100,
      capacityUnlimited: true,
      modelType: "stochastic-weekly",
      evaluationMode: "exploratory"
    },
    params: {
      price: { carro: 79, camioneta: 99 },
      marginPct: 0.12,
      mixTruckPct: 0.35
    },
    probabilityModel: {
      type: "stepwise-linear",
      formula: "min(0.10 + 0.05 * floor((t-1)/4), 0.80)",
      cap: 0.8,
      stepWeeks: 4,
      base: 0.1,
      increment: 0.05
    },
    results: {
      summary: {
        revenueTotal: { mean: 0, p10: 0, p90: 0 },
        washesTotal: { mean: 0, p10: 0, p90: 0 },
        marginTotal: { mean: 0, p10: 0, p90: 0 },
        washesByType: {
          carro: { mean: 0, p10: 0, p90: 0 },
          camioneta: { mean: 0, p10: 0, p90: 0 }
        }
      },
      series: {
        monthly: {
          washes: { mean: [], p10: [], p90: [] },
          revenue: { mean: [], p10: [], p90: [] }
        }
      }
    },
    ...overrides
  };
}

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const scenario = createScenario();
    return {
      activeScenarioId: scenario.meta.scenarioId,
      scenarios: [scenario]
    };
  }
  try {
    const parsed = JSON.parse(stored);
    if (!parsed.scenarios || !Array.isArray(parsed.scenarios)) {
      throw new Error("Formato inválido");
    }
    return parsed;
  } catch (error) {
    const scenario = createScenario();
    return {
      activeScenarioId: scenario.meta.scenarioId,
      scenarios: [scenario]
    };
  }
}

function persistState(message) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  if (message) {
    statusMessage.textContent = message;
  }
}

function getActiveScenario() {
  return appState.scenarios.find(
    (scenario) => scenario.meta.scenarioId === appState.activeScenarioId
  );
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 0
  }).format(value);
}

function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function computeStats(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const percentile = (p) => {
    const index = Math.floor((sorted.length - 1) * p);
    return sorted[index];
  };
  return {
    mean,
    p10: percentile(0.1),
    p90: percentile(0.9)
  };
}

function simulateScenario(scenario) {
  const { universeVehicles, horizonWeeks, weeksPerMonth, replicas } = scenario.config;
  const { price, marginPct, mixTruckPct } = scenario.params;
  const monthlyCount = Math.ceil(horizonWeeks / weeksPerMonth);
  const revenueTotals = [];
  const washTotals = [];
  const marginTotals = [];
  const carTotals = [];
  const truckTotals = [];
  const monthlyWashes = Array.from({ length: monthlyCount }, () => []);
  const monthlyRevenue = Array.from({ length: monthlyCount }, () => []);

  for (let replica = 0; replica < replicas; replica += 1) {
    let totalWashes = 0;
    let totalRevenue = 0;
    let totalCar = 0;
    let totalTruck = 0;
    const washesPerMonth = Array.from({ length: monthlyCount }, () => 0);
    const revenuePerMonth = Array.from({ length: monthlyCount }, () => 0);

    for (let week = 1; week <= horizonWeeks; week += 1) {
      const step = Math.floor((week - 1) / scenario.probabilityModel.stepWeeks);
      const baseProb = scenario.probabilityModel.base + scenario.probabilityModel.increment * step;
      const probability = Math.min(baseProb, scenario.probabilityModel.cap);
      const monthIndex = Math.floor((week - 1) / weeksPerMonth);

      for (let vehicle = 0; vehicle < universeVehicles; vehicle += 1) {
        if (Math.random() <= probability) {
          totalWashes += 1;
          washesPerMonth[monthIndex] += 1;
          const isTruck = Math.random() <= mixTruckPct;
          if (isTruck) {
            totalTruck += 1;
            totalRevenue += price.camioneta;
            revenuePerMonth[monthIndex] += price.camioneta;
          } else {
            totalCar += 1;
            totalRevenue += price.carro;
            revenuePerMonth[monthIndex] += price.carro;
          }
        }
      }
    }

    const marginTotal = totalRevenue * marginPct;

    revenueTotals.push(totalRevenue);
    washTotals.push(totalWashes);
    marginTotals.push(marginTotal);
    carTotals.push(totalCar);
    truckTotals.push(totalTruck);

    washesPerMonth.forEach((value, index) => {
      monthlyWashes[index].push(value);
    });

    revenuePerMonth.forEach((value, index) => {
      monthlyRevenue[index].push(value);
    });
  }

  const summary = {
    revenueTotal: computeStats(revenueTotals),
    washesTotal: computeStats(washTotals),
    marginTotal: computeStats(marginTotals),
    washesByType: {
      carro: computeStats(carTotals),
      camioneta: computeStats(truckTotals)
    }
  };

  const series = {
    monthly: {
      washes: {
        mean: monthlyWashes.map((values) => computeStats(values).mean),
        p10: monthlyWashes.map((values) => computeStats(values).p10),
        p90: monthlyWashes.map((values) => computeStats(values).p90)
      },
      revenue: {
        mean: monthlyRevenue.map((values) => computeStats(values).mean),
        p10: monthlyRevenue.map((values) => computeStats(values).p10),
        p90: monthlyRevenue.map((values) => computeStats(values).p90)
      }
    }
  };

  scenario.results = { summary, series };
}

function updateScenarioFromForm() {
  const scenario = getActiveScenario();
  const priceCar = Number(priceCarInput.value);
  const priceTruck = Number(priceTruckInput.value);
  const marginPct = clamp(Number(marginInput.value), 0, 1);
  const mixTruckPct = clamp(Number(mixTruckInput.value), 0, 1);

  if (priceCar <= 0 || priceTruck <= 0) {
    statusMessage.textContent = "Los precios deben ser mayores a cero.";
    return;
  }

  scenario.params.price.carro = priceCar;
  scenario.params.price.camioneta = priceTruck;
  scenario.params.marginPct = marginPct;
  scenario.params.mixTruckPct = mixTruckPct;
  scenario.meta.updatedAt = new Date().toISOString();

  marginOutput.textContent = formatPercent(marginPct);
  mixOutput.textContent = formatPercent(mixTruckPct);

  scheduleRecalc();
}

function scheduleRecalc() {
  window.clearTimeout(recalcTimeout);
  recalcTimeout = window.setTimeout(() => {
    const scenario = getActiveScenario();
    simulateScenario(scenario);
    renderResults(scenario);
    persistState();
  }, 120);
}

function renderForm(scenario) {
  scenarioNameInput.value = scenario.meta.name || "";
  priceCarInput.value = scenario.params.price.carro;
  priceTruckInput.value = scenario.params.price.camioneta;
  marginInput.value = scenario.params.marginPct;
  mixTruckInput.value = scenario.params.mixTruckPct;
  marginOutput.textContent = formatPercent(scenario.params.marginPct);
  mixOutput.textContent = formatPercent(scenario.params.mixTruckPct);
}

function renderScenarioList() {
  scenarioList.innerHTML = "";
  appState.scenarios.forEach((scenario) => {
    const item = document.createElement("li");
    item.className = "scenario-item";
    if (scenario.meta.scenarioId === appState.activeScenarioId) {
      item.classList.add("active");
    }

    const info = document.createElement("div");
    info.className = "scenario-info";

    const title = document.createElement("strong");
    title.textContent = scenario.meta.name || "Escenario sin nombre";

    const time = document.createElement("time");
    const timestamp = scenario.meta.updatedAt || scenario.meta.createdAt;
    time.dateTime = timestamp;
    time.textContent = new Date(timestamp).toLocaleString("es-MX");

    info.append(title, time);

    const actions = document.createElement("div");
    actions.className = "scenario-actions";

    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.dataset.action = "load";
    loadButton.dataset.id = scenario.meta.scenarioId;
    loadButton.textContent = "Cargar";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = scenario.meta.scenarioId;
    deleteButton.textContent = "Eliminar";

    actions.append(loadButton, deleteButton);
    item.append(info, actions);
    scenarioList.append(item);
  });
}

function renderResults(scenario) {
  const { summary, series } = scenario.results;

  kpiRevenue.textContent = formatCurrency(summary.revenueTotal.mean);
  kpiRevenueRange.textContent = `p10 ${formatCurrency(summary.revenueTotal.p10)} · p90 ${formatCurrency(
    summary.revenueTotal.p90
  )}`;

  kpiWashes.textContent = formatNumber(summary.washesTotal.mean);
  kpiWashesRange.textContent = `p10 ${formatNumber(summary.washesTotal.p10)} · p90 ${formatNumber(
    summary.washesTotal.p90
  )}`;

  kpiMargin.textContent = formatCurrency(summary.marginTotal.mean);
  kpiMarginRange.textContent = `p10 ${formatCurrency(summary.marginTotal.p10)} · p90 ${formatCurrency(
    summary.marginTotal.p90
  )}`;

  kpiCarWashes.textContent = formatNumber(summary.washesByType.carro.mean);
  kpiCarRange.textContent = `p10 ${formatNumber(summary.washesByType.carro.p10)} · p90 ${formatNumber(
    summary.washesByType.carro.p90
  )}`;

  kpiTruckWashes.textContent = formatNumber(summary.washesByType.camioneta.mean);
  kpiTruckRange.textContent = `p10 ${formatNumber(
    summary.washesByType.camioneta.p10
  )} · p90 ${formatNumber(summary.washesByType.camioneta.p90)}`;

  renderChart(chartWashes, series.monthly.washes.mean, "lavados");
  renderChart(chartRevenue, series.monthly.revenue.mean, "ingresos", true);

  chartWashesSummary.textContent = `Mes mínimo ${formatNumber(
    Math.min(...series.monthly.washes.mean)
  )} y máximo ${formatNumber(Math.max(...series.monthly.washes.mean))}.`;
  chartRevenueSummary.textContent = `Mes mínimo ${formatCurrency(
    Math.min(...series.monthly.revenue.mean)
  )} y máximo ${formatCurrency(Math.max(...series.monthly.revenue.mean))}.`;
}

function renderChart(container, values, label, currency = false) {
  container.innerHTML = "";
  const maxValue = Math.max(...values, 1);
  values.forEach((value, index) => {
    const item = document.createElement("li");
    item.className = "bar";

    const bar = document.createElement("span");
    bar.style.height = `${(value / maxValue) * 100}%`;
    bar.setAttribute(
      "aria-label",
      `Mes ${index + 1}: ${currency ? formatCurrency(value) : formatNumber(value)} ${label}`
    );

    const text = document.createElement("small");
    text.textContent = `${index + 1}`;

    item.append(bar, text);
    container.append(item);
  });
}

function saveScenario(updateActiveOnly = true) {
  const scenario = getActiveScenario();
  scenario.meta.name = scenarioNameInput.value.trim() || "Escenario sin nombre";
  scenario.meta.updatedAt = new Date().toISOString();

  if (!updateActiveOnly) {
    const clone = JSON.parse(JSON.stringify(scenario));
    clone.meta.scenarioId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    clone.meta.createdAt = new Date().toISOString();
    clone.meta.updatedAt = clone.meta.createdAt;
    appState.scenarios.push(clone);
    appState.activeScenarioId = clone.meta.scenarioId;
  }

  appState.scenarios = appState.scenarios
    .sort((a, b) => new Date(a.meta.createdAt) - new Date(b.meta.createdAt))
    .slice(-MAX_SCENARIOS);

  persistState("Escenario guardado en el almacenamiento local.");
  renderScenarioList();
  renderForm(getActiveScenario());
  renderResults(getActiveScenario());
}

function loadScenario(id) {
  const scenario = appState.scenarios.find((item) => item.meta.scenarioId === id);
  if (!scenario) {
    return;
  }
  appState.activeScenarioId = id;
  renderForm(scenario);
  renderScenarioList();
  renderResults(scenario);
  persistState("Escenario cargado correctamente.");
}

function deleteScenario(id) {
  appState.scenarios = appState.scenarios.filter((item) => item.meta.scenarioId !== id);
  if (!appState.scenarios.length) {
    const scenario = createScenario();
    appState.scenarios = [scenario];
    appState.activeScenarioId = scenario.meta.scenarioId;
  }
  if (appState.activeScenarioId === id) {
    appState.activeScenarioId = appState.scenarios[0].meta.scenarioId;
  }
  renderForm(getActiveScenario());
  renderScenarioList();
  renderResults(getActiveScenario());
  persistState("Escenario eliminado.");
}

function exportJSON() {
  const data = JSON.stringify(appState, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "autolavado-escenarios.json";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  statusMessage.textContent = "Archivo JSON generado.";
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (!data.scenarios || !Array.isArray(data.scenarios)) {
        throw new Error("Formato inválido");
      }
      appState = {
        activeScenarioId: data.activeScenarioId,
        scenarios: data.scenarios
      };
      if (!appState.scenarios.length) {
        throw new Error("Sin escenarios");
      }
      if (!appState.scenarios.find((item) => item.meta.scenarioId === appState.activeScenarioId)) {
        appState.activeScenarioId = appState.scenarios[0].meta.scenarioId;
      }
      appState.scenarios = appState.scenarios.slice(-MAX_SCENARIOS);
      renderForm(getActiveScenario());
      renderScenarioList();
      renderResults(getActiveScenario());
      persistState("Escenarios importados correctamente.");
    } catch (error) {
      statusMessage.textContent = "No se pudo importar el archivo.";
    }
  };
  reader.readAsText(file);
}

function init() {
  const scenario = getActiveScenario();
  simulateScenario(scenario);
  renderForm(scenario);
  renderScenarioList();
  renderResults(scenario);
  persistState();
}

form.addEventListener("input", () => {
  statusMessage.textContent = "";
  updateScenarioFromForm();
});

saveScenarioButton.addEventListener("click", () => saveScenario(true));

saveNewScenarioButton.addEventListener("click", () => saveScenario(false));

scenarioList.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) {
    return;
  }
  const { action, id } = button.dataset;
  if (action === "load") {
    loadScenario(id);
  }
  if (action === "delete") {
    deleteScenario(id);
  }
});

exportButton.addEventListener("click", exportJSON);

importInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    importJSON(file);
  }
  importInput.value = "";
});

scenarioNameInput.addEventListener("change", () => {
  const scenario = getActiveScenario();
  scenario.meta.name = scenarioNameInput.value.trim() || "Escenario sin nombre";
  renderScenarioList();
  persistState();
});

init();
