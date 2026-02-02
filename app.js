const STORAGE_KEY = "autolavado-scenarios";
const MAX_SCENARIOS = 10;

const elements = {
  priceCar: document.getElementById("priceCar"),
  priceTruck: document.getElementById("priceTruck"),
  mixTruck: document.getElementById("mixTruck"),
  mixTruckValue: document.getElementById("mixTruckValue"),
  margin: document.getElementById("margin"),
  marginValue: document.getElementById("marginValue"),
  scenarioName: document.getElementById("scenarioName"),
  scenarioList: document.getElementById("scenarioList"),
  saveScenario: document.getElementById("saveScenario"),
  exportJson: document.getElementById("exportJson"),
  importJson: document.getElementById("importJson"),
  statusMessage: document.getElementById("statusMessage"),
  revenueTotal: document.getElementById("revenueTotal"),
  revenueRange: document.getElementById("revenueRange"),
  washesTotal: document.getElementById("washesTotal"),
  washesRange: document.getElementById("washesRange"),
  marginTotal: document.getElementById("marginTotal"),
  marginRange: document.getElementById("marginRange"),
  washesType: document.getElementById("washesType"),
  washesTypeRange: document.getElementById("washesTypeRange"),
  washesChart: document.getElementById("washesChart"),
  revenueChart: document.getElementById("revenueChart"),
  washesChartAlt: document.getElementById("washesChartAlt"),
  revenueChartAlt: document.getElementById("revenueChartAlt"),
};

const baseConfig = {
  universeVehicles: 50,
  horizonWeeks: 52,
  weeksPerMonth: 4,
  replicas: 100,
  capacityUnlimited: true,
  modelType: "stochastic-weekly",
  evaluationMode: "exploratory",
};

const probabilityModel = {
  type: "stepwise-linear",
  formula: "min(0.10 + 0.05 * floor((t-1)/4), 0.80)",
  cap: 0.8,
  stepWeeks: 4,
  base: 0.1,
  increment: 0.05,
};

let containerState = loadContainer();
let activeScenario = loadActiveScenario();

function defaultScenario() {
  return {
    meta: {
      scenarioId: createId(),
      createdAt: new Date().toISOString(),
      description: "Escenario activo base",
    },
    config: { ...baseConfig },
    params: {
      price: { carro: 79, camioneta: 99 },
      marginPct: 0.12,
      mixTruckPct: 0.35,
    },
    probabilityModel: { ...probabilityModel },
    results: createEmptyResults(),
  };
}

function createEmptyResults() {
  return {
    summary: {
      revenueTotal: { mean: 0, p10: 0, p90: 0 },
      washesTotal: { mean: 0, p10: 0, p90: 0 },
      marginTotal: { mean: 0, p10: 0, p90: 0 },
      washesByType: {
        carro: { mean: 0, p10: 0, p90: 0 },
        camioneta: { mean: 0, p10: 0, p90: 0 },
      },
    },
    series: {
      monthly: {
        washes: { mean: [], p10: [], p90: [] },
        revenue: { mean: [], p10: [], p90: [] },
      },
    },
  };
}

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat("es-MX", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value) {
  return `${(value * 100).toFixed(0)}%`;
}

function mean(values) {
  return values.reduce((acc, val) => acc + val, 0) / values.length;
}

function percentile(values, pct) {
  const sorted = [...values].sort((a, b) => a - b);
  const index = (pct / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) {
    return sorted[lower];
  }
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function simulateScenario(params) {
  const replicas = baseConfig.replicas;
  const months = Math.ceil(baseConfig.horizonWeeks / baseConfig.weeksPerMonth);
  const washesTotals = [];
  const revenueTotals = [];
  const marginTotals = [];
  const washesCar = [];
  const washesTruck = [];
  const monthlyWashes = Array.from({ length: replicas }, () => Array(months).fill(0));
  const monthlyRevenue = Array.from({ length: replicas }, () => Array(months).fill(0));

  for (let r = 0; r < replicas; r += 1) {
    let washesTotal = 0;
    let revenueTotal = 0;
    let washesCarTotal = 0;
    let washesTruckTotal = 0;

    for (let week = 1; week <= baseConfig.horizonWeeks; week += 1) {
      const step = Math.floor((week - 1) / probabilityModel.stepWeeks);
      const probability = Math.min(
        probabilityModel.base + probabilityModel.increment * step,
        probabilityModel.cap
      );
      let weeklyWashes = 0;
      let weeklyRevenue = 0;

      for (let vehicle = 0; vehicle < baseConfig.universeVehicles; vehicle += 1) {
        if (Math.random() < probability) {
          weeklyWashes += 1;
          if (Math.random() < params.mixTruckPct) {
            weeklyRevenue += params.price.camioneta;
            washesTruckTotal += 1;
          } else {
            weeklyRevenue += params.price.carro;
            washesCarTotal += 1;
          }
        }
      }

      washesTotal += weeklyWashes;
      revenueTotal += weeklyRevenue;

      const monthIndex = Math.floor((week - 1) / baseConfig.weeksPerMonth);
      monthlyWashes[r][monthIndex] += weeklyWashes;
      monthlyRevenue[r][monthIndex] += weeklyRevenue;
    }

    washesTotals.push(washesTotal);
    revenueTotals.push(revenueTotal);
    marginTotals.push(revenueTotal * params.marginPct);
    washesCar.push(washesCarTotal);
    washesTruck.push(washesTruckTotal);
  }

  const summary = {
    revenueTotal: {
      mean: mean(revenueTotals),
      p10: percentile(revenueTotals, 10),
      p90: percentile(revenueTotals, 90),
    },
    washesTotal: {
      mean: mean(washesTotals),
      p10: percentile(washesTotals, 10),
      p90: percentile(washesTotals, 90),
    },
    marginTotal: {
      mean: mean(marginTotals),
      p10: percentile(marginTotals, 10),
      p90: percentile(marginTotals, 90),
    },
    washesByType: {
      carro: {
        mean: mean(washesCar),
        p10: percentile(washesCar, 10),
        p90: percentile(washesCar, 90),
      },
      camioneta: {
        mean: mean(washesTruck),
        p10: percentile(washesTruck, 10),
        p90: percentile(washesTruck, 90),
      },
    },
  };

  const monthlyWashesSummary = summarizeMonthly(monthlyWashes);
  const monthlyRevenueSummary = summarizeMonthly(monthlyRevenue);

  return {
    summary,
    series: {
      monthly: {
        washes: monthlyWashesSummary,
        revenue: monthlyRevenueSummary,
      },
    },
  };
}

function summarizeMonthly(data) {
  const months = data[0]?.length || 0;
  const meanValues = [];
  const p10Values = [];
  const p90Values = [];

  for (let i = 0; i < months; i += 1) {
    const values = data.map((row) => row[i]);
    meanValues.push(mean(values));
    p10Values.push(percentile(values, 10));
    p90Values.push(percentile(values, 90));
  }

  return {
    mean: meanValues,
    p10: p10Values,
    p90: p90Values,
  };
}

function loadContainer() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { activeScenarioId: null, scenarios: [] };
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed.scenarios)) {
      return parsed;
    }
  } catch (error) {
    console.warn("No se pudo leer el almacenamiento.", error);
  }
  return { activeScenarioId: null, scenarios: [] };
}

function loadActiveScenario() {
  if (containerState.activeScenarioId) {
    const scenario = containerState.scenarios.find(
      (item) => item.meta.scenarioId === containerState.activeScenarioId
    );
    if (scenario) {
      return scenario;
    }
  }
  return defaultScenario();
}

function persistContainer() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(containerState));
}

function updateStatus(message) {
  elements.statusMessage.textContent = message;
}

function normalizeParams(params) {
  return {
    price: {
      carro: Math.max(1, Number(params.price.carro) || 0),
      camioneta: Math.max(1, Number(params.price.camioneta) || 0),
    },
    mixTruckPct: clamp(Number(params.mixTruckPct) || 0, 0, 1),
    marginPct: clamp(Number(params.marginPct) || 0, 0, 1),
  };
}

function syncInputs() {
  elements.priceCar.value = activeScenario.params.price.carro;
  elements.priceTruck.value = activeScenario.params.price.camioneta;
  elements.mixTruck.value = activeScenario.params.mixTruckPct;
  elements.margin.value = activeScenario.params.marginPct;
  elements.mixTruckValue.textContent = formatPercent(activeScenario.params.mixTruckPct);
  elements.marginValue.textContent = formatPercent(activeScenario.params.marginPct);
}

function updateScenarioFromInputs() {
  const params = normalizeParams({
    price: {
      carro: elements.priceCar.value,
      camioneta: elements.priceTruck.value,
    },
    mixTruckPct: elements.mixTruck.value,
    marginPct: elements.margin.value,
  });

  activeScenario = {
    ...activeScenario,
    params,
    results: simulateScenario(params),
  };

  elements.mixTruckValue.textContent = formatPercent(params.mixTruckPct);
  elements.marginValue.textContent = formatPercent(params.marginPct);

  const savedIndex = containerState.scenarios.findIndex(
    (scenario) => scenario.meta.scenarioId === activeScenario.meta.scenarioId
  );
  if (savedIndex !== -1) {
    containerState.scenarios[savedIndex] = activeScenario;
    containerState.activeScenarioId = activeScenario.meta.scenarioId;
    persistContainer();
  }

  renderResults();
}

function renderResults() {
  const { summary, series } = activeScenario.results;

  elements.revenueTotal.textContent = formatCurrency(summary.revenueTotal.mean);
  elements.revenueRange.textContent = `p10 ${formatCurrency(
    summary.revenueTotal.p10
  )} · p90 ${formatCurrency(summary.revenueTotal.p90)}`;
  elements.washesTotal.textContent = formatNumber(summary.washesTotal.mean);
  elements.washesRange.textContent = `p10 ${formatNumber(
    summary.washesTotal.p10
  )} · p90 ${formatNumber(summary.washesTotal.p90)}`;
  elements.marginTotal.textContent = formatCurrency(summary.marginTotal.mean);
  elements.marginRange.textContent = `p10 ${formatCurrency(
    summary.marginTotal.p10
  )} · p90 ${formatCurrency(summary.marginTotal.p90)}`;

  elements.washesType.textContent = `Carro ${formatNumber(
    summary.washesByType.carro.mean
  )} · Camioneta ${formatNumber(summary.washesByType.camioneta.mean)}`;
  elements.washesTypeRange.textContent = `Carro p10 ${formatNumber(
    summary.washesByType.carro.p10
  )} / p90 ${formatNumber(summary.washesByType.carro.p90)} · Camioneta p10 ${formatNumber(
    summary.washesByType.camioneta.p10
  )} / p90 ${formatNumber(summary.washesByType.camioneta.p90)}`;

  renderBars(elements.washesChart, series.monthly.washes.mean);
  renderBars(elements.revenueChart, series.monthly.revenue.mean);

  elements.washesChartAlt.textContent = buildAltText(
    "Lavados",
    series.monthly.washes
  );
  elements.revenueChartAlt.textContent = buildAltText(
    "Ingresos",
    series.monthly.revenue
  );
}

function buildAltText(label, series) {
  const peaks = series.mean.map((value, index) => ({ value, index }));
  peaks.sort((a, b) => b.value - a.value);
  const top = peaks[0];
  return `${label} mensuales promedio con pico en mes ${top.index + 1} de ${formatNumber(
    top.value
  )}. Rango p10–p90 del primer mes: ${formatNumber(series.p10[0])}–${formatNumber(
    series.p90[0]
  )}.`;
}

function renderBars(container, values) {
  container.innerHTML = "";
  const maxValue = Math.max(...values, 1);
  values.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.setProperty("--value", (value / maxValue) * 100);

    const barFill = document.createElement("span");
    const label = document.createElement("label");
    label.textContent = `M${index + 1}`;

    bar.append(barFill, label);
    container.appendChild(bar);
  });
}

function renderScenarioList() {
  elements.scenarioList.innerHTML = "";
  if (containerState.scenarios.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No hay escenarios guardados.";
    empty.className = "muted";
    elements.scenarioList.appendChild(empty);
    return;
  }

  containerState.scenarios.forEach((scenario) => {
    const item = document.createElement("li");
    item.className = "scenario-item";

    const title = document.createElement("strong");
    title.textContent = scenario.meta.description;

    const meta = document.createElement("div");
    meta.className = "scenario-meta";
    const date = new Date(scenario.meta.createdAt);
    meta.textContent = `Fecha: ${date.toLocaleDateString("es-MX")}`;

    const buttons = document.createElement("div");
    buttons.className = "scenario-buttons";

    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.textContent = "Cargar";
    loadButton.addEventListener("click", () => loadScenario(scenario.meta.scenarioId));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener("click", () => deleteScenario(scenario.meta.scenarioId));

    buttons.append(loadButton, deleteButton);
    item.append(title, meta, buttons);
    elements.scenarioList.appendChild(item);
  });
}

function saveScenario() {
  const name = elements.scenarioName.value.trim() || "Escenario sin nombre";
  const scenario = {
    ...activeScenario,
    meta: {
      scenarioId: createId(),
      createdAt: new Date().toISOString(),
      description: name,
    },
  };

  containerState.scenarios = [...containerState.scenarios, scenario].sort((a, b) =>
    new Date(a.meta.createdAt) - new Date(b.meta.createdAt)
  );

  if (containerState.scenarios.length > MAX_SCENARIOS) {
    containerState.scenarios = containerState.scenarios.slice(-MAX_SCENARIOS);
  }

  containerState.activeScenarioId = scenario.meta.scenarioId;
  persistContainer();
  renderScenarioList();
  updateStatus("Escenario guardado en localStorage.");
  elements.scenarioName.value = "";
}

function loadScenario(id) {
  const scenario = containerState.scenarios.find((item) => item.meta.scenarioId === id);
  if (!scenario) {
    updateStatus("No se encontró el escenario solicitado.");
    return;
  }
  activeScenario = scenario;
  containerState.activeScenarioId = id;
  persistContainer();
  syncInputs();
  renderResults();
  updateStatus("Escenario cargado.");
}

function deleteScenario(id) {
  containerState.scenarios = containerState.scenarios.filter(
    (scenario) => scenario.meta.scenarioId !== id
  );

  if (containerState.activeScenarioId === id) {
    containerState.activeScenarioId = containerState.scenarios[0]?.meta.scenarioId || null;
  }

  persistContainer();
  renderScenarioList();
  updateStatus("Escenario eliminado.");
}

function exportJSON() {
  const data = JSON.stringify(containerState, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "autolavado-escenarios.json";
  link.click();
  URL.revokeObjectURL(url);
  updateStatus("Exportación lista.");
}

function importJSON(file) {
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!Array.isArray(parsed.scenarios)) {
        updateStatus("JSON inválido: faltan escenarios.");
        return;
      }
      containerState = parsed;
      persistContainer();
      activeScenario = loadActiveScenario();
      syncInputs();
      renderScenarioList();
      renderResults();
      updateStatus("Escenarios importados correctamente.");
    } catch (error) {
      console.error(error);
      updateStatus("No se pudo importar el JSON.");
    }
  };
  reader.readAsText(file);
}

function wireEvents() {
  [elements.priceCar, elements.priceTruck].forEach((input) => {
    input.addEventListener("input", updateScenarioFromInputs);
  });
  [elements.mixTruck, elements.margin].forEach((input) => {
    input.addEventListener("input", updateScenarioFromInputs);
  });

  elements.saveScenario.addEventListener("click", saveScenario);
  elements.exportJson.addEventListener("click", exportJSON);
  elements.importJson.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    importJSON(file);
    event.target.value = "";
  });
}

function init() {
  if (!activeScenario.results?.summary) {
    activeScenario.results = simulateScenario(activeScenario.params);
  }
  syncInputs();
  renderScenarioList();
  renderResults();
  wireEvents();
}

init();
