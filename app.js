const STORAGE_KEY = "carwash-scenarios-v1";
const MAX_SCENARIOS = 10;

const controls = {
  priceCarro: document.querySelector("#price-carro"),
  priceCarroNumber: document.querySelector("#price-carro-number"),
  priceCamioneta: document.querySelector("#price-camioneta"),
  priceCamionetaNumber: document.querySelector("#price-camioneta-number"),
  mixTruck: document.querySelector("#mix-truck"),
  mixTruckNumber: document.querySelector("#mix-truck-number"),
  marginPct: document.querySelector("#margin-pct"),
  marginPctNumber: document.querySelector("#margin-pct-number"),
};

const scenarioForm = document.querySelector("#scenario-form");
const scenarioName = document.querySelector("#scenario-name");
const scenarioDate = document.querySelector("#scenario-date");
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
const kpiType = document.querySelector("#kpi-type");
const kpiTypeRange = document.querySelector("#kpi-type-range");

const chartWashes = document.querySelector("#chart-washes");
const chartWashesSummary = document.querySelector("#chart-washes-summary");
const chartRevenue = document.querySelector("#chart-revenue");
const chartRevenueSummary = document.querySelector("#chart-revenue-summary");

let state = loadState();

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createInitialState();
  }
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.scenarios)) {
      return createInitialState();
    }
    return normalizeState(parsed);
  } catch (error) {
    return createInitialState();
  }
}

function normalizeState(parsed) {
  const scenarios = parsed.scenarios.slice(0, MAX_SCENARIOS);
  const activeScenarioId = scenarios.some((scenario) => scenario.meta.scenarioId === parsed.activeScenarioId)
    ? parsed.activeScenarioId
    : scenarios[0]?.meta.scenarioId;
  return {
    activeScenarioId,
    scenarios: scenarios.length ? scenarios : [createScenario("Escenario base")],
  };
}

function createInitialState() {
  const scenario = createScenario("Escenario base");
  return {
    activeScenarioId: scenario.meta.scenarioId,
    scenarios: [scenario],
  };
}

function createScenario(name) {
  const now = new Date();
  const scenario = {
    meta: {
      scenarioId: createId(),
      createdAt: now.toISOString(),
      description: name,
    },
    config: {
      universeVehicles: 50,
      horizonWeeks: 52,
      weeksPerMonth: 4,
      replicas: 100,
      capacityUnlimited: true,
      modelType: "stochastic-weekly",
      evaluationMode: "exploratory",
    },
    params: {
      price: { carro: 79, camioneta: 99 },
      marginPct: 0.12,
      mixTruckPct: 0.35,
    },
    probabilityModel: {
      type: "stepwise-linear",
      formula: "min(0.10 + 0.05 * floor((t-1)/4), 0.80)",
      cap: 0.8,
      stepWeeks: 4,
      base: 0.1,
      increment: 0.05,
    },
    results: buildResults(),
  };
  scenario.results = simulateScenario(scenario);
  return scenario;
}

function createId() {
  if (crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return `scenario-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function buildResults() {
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

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setStatus(message) {
  statusMessage.textContent = message;
}

function getActiveScenario() {
  return state.scenarios.find((scenario) => scenario.meta.scenarioId === state.activeScenarioId);
}

function syncInputsFromScenario() {
  const scenario = getActiveScenario();
  if (!scenario) return;
  controls.priceCarro.value = scenario.params.price.carro;
  controls.priceCarroNumber.value = scenario.params.price.carro;
  controls.priceCamioneta.value = scenario.params.price.camioneta;
  controls.priceCamionetaNumber.value = scenario.params.price.camioneta;
  controls.mixTruck.value = scenario.params.mixTruckPct.toFixed(2);
  controls.mixTruckNumber.value = scenario.params.mixTruckPct.toFixed(2);
  controls.marginPct.value = scenario.params.marginPct.toFixed(2);
  controls.marginPctNumber.value = scenario.params.marginPct.toFixed(2);
  scenarioName.value = scenario.meta.description;
  scenarioDate.value = scenario.meta.createdAt.slice(0, 10);
}

function bindControlPair(rangeInput, numberInput, onChange) {
  const handler = (event) => {
    const value = Number(event.target.value);
    rangeInput.value = value;
    numberInput.value = value;
    onChange(value);
  };
  rangeInput.addEventListener("input", handler);
  numberInput.addEventListener("input", handler);
}

function updateActiveScenario(paramsUpdate) {
  const scenario = getActiveScenario();
  if (!scenario) return;
  scenario.params = {
    ...scenario.params,
    ...paramsUpdate,
    price: {
      ...scenario.params.price,
      ...(paramsUpdate.price || {}),
    },
  };
  scenario.results = simulateScenario(scenario);
  persistState();
  render();
}

function simulateScenario(scenario) {
  const { config, params, probabilityModel } = scenario;
  const months = config.horizonWeeks / config.weeksPerMonth;

  const totalRevenueRuns = [];
  const totalWashesRuns = [];
  const totalCarroRuns = [];
  const totalCamionetaRuns = [];
  const monthlyWashesRuns = Array.from({ length: months }, () => []);
  const monthlyRevenueRuns = Array.from({ length: months }, () => []);

  for (let run = 0; run < config.replicas; run += 1) {
    let revenue = 0;
    let washes = 0;
    let washesCarro = 0;
    let washesCamioneta = 0;
    const monthlyWashes = Array.from({ length: months }, () => 0);
    const monthlyRevenue = Array.from({ length: months }, () => 0);

    for (let week = 1; week <= config.horizonWeeks; week += 1) {
      const step = Math.floor((week - 1) / probabilityModel.stepWeeks);
      const probability = Math.min(probabilityModel.base + probabilityModel.increment * step, probabilityModel.cap);
      for (let vehicle = 0; vehicle < config.universeVehicles; vehicle += 1) {
        if (Math.random() < probability) {
          const isTruck = Math.random() < params.mixTruckPct;
          const price = isTruck ? params.price.camioneta : params.price.carro;
          washes += 1;
          revenue += price;
          if (isTruck) {
            washesCamioneta += 1;
          } else {
            washesCarro += 1;
          }
          const monthIndex = Math.floor((week - 1) / config.weeksPerMonth);
          monthlyWashes[monthIndex] += 1;
          monthlyRevenue[monthIndex] += price;
        }
      }
    }

    totalRevenueRuns.push(revenue);
    totalWashesRuns.push(washes);
    totalCarroRuns.push(washesCarro);
    totalCamionetaRuns.push(washesCamioneta);
    monthlyWashes.forEach((value, index) => monthlyWashesRuns[index].push(value));
    monthlyRevenue.forEach((value, index) => monthlyRevenueRuns[index].push(value));
  }

  const revenueTotal = summarizeArray(totalRevenueRuns);
  const washesTotal = summarizeArray(totalWashesRuns);
  const marginTotal = {
    mean: revenueTotal.mean * params.marginPct,
    p10: revenueTotal.p10 * params.marginPct,
    p90: revenueTotal.p90 * params.marginPct,
  };

  return {
    summary: {
      revenueTotal,
      washesTotal,
      marginTotal,
      washesByType: {
        carro: summarizeArray(totalCarroRuns),
        camioneta: summarizeArray(totalCamionetaRuns),
      },
    },
    series: {
      monthly: {
        washes: summarizeSeries(monthlyWashesRuns),
        revenue: summarizeSeries(monthlyRevenueRuns),
      },
    },
  };
}

function summarizeSeries(seriesRuns) {
  return {
    mean: seriesRuns.map((values) => summarizeArray(values).mean),
    p10: seriesRuns.map((values) => summarizeArray(values).p10),
    p90: seriesRuns.map((values) => summarizeArray(values).p90),
  };
}

function summarizeArray(values) {
  if (!values.length) {
    return { mean: 0, p10: 0, p90: 0 };
  }
  const sorted = [...values].sort((a, b) => a - b);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return {
    mean,
    p10: quantile(sorted, 0.1),
    p90: quantile(sorted, 0.9),
  };
}

function quantile(sorted, q) {
  const position = (sorted.length - 1) * q;
  const base = Math.floor(position);
  const rest = position - base;
  if (sorted[base + 1] !== undefined) {
    return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
  }
  return sorted[base];
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

function renderKPIs(results) {
  kpiRevenue.textContent = formatCurrency(results.summary.revenueTotal.mean);
  kpiRevenueRange.textContent = `p10 ${formatCurrency(results.summary.revenueTotal.p10)} · p90 ${
    formatCurrency(results.summary.revenueTotal.p90)
  }`;

  kpiWashes.textContent = formatNumber(results.summary.washesTotal.mean);
  kpiWashesRange.textContent = `p10 ${formatNumber(results.summary.washesTotal.p10)} · p90 ${
    formatNumber(results.summary.washesTotal.p90)
  }`;

  kpiMargin.textContent = formatCurrency(results.summary.marginTotal.mean);
  kpiMarginRange.textContent = `p10 ${formatCurrency(results.summary.marginTotal.p10)} · p90 ${
    formatCurrency(results.summary.marginTotal.p90)
  }`;

  kpiType.textContent = `Carro ${formatNumber(results.summary.washesByType.carro.mean)} · Camioneta ${formatNumber(
    results.summary.washesByType.camioneta.mean
  )}`;
  kpiTypeRange.textContent = `Carro p10 ${formatNumber(results.summary.washesByType.carro.p10)} / p90 ${formatNumber(
    results.summary.washesByType.carro.p90
  )} · Camioneta p10 ${formatNumber(results.summary.washesByType.camioneta.p10)} / p90 ${formatNumber(
    results.summary.washesByType.camioneta.p90
  )}`;
}

function renderChart(container, summary, formatter) {
  const maxValue = Math.max(...summary.mean, 1);
  container.innerHTML = "";
  summary.mean.forEach((value, index) => {
    const item = document.createElement("li");
    item.style.height = `${(value / maxValue) * 100}%`;
    const label = document.createElement("span");
    label.textContent = `M${index + 1}`;
    const valueLabel = document.createElement("strong");
    valueLabel.textContent = formatter(value);
    item.appendChild(valueLabel);
    item.appendChild(label);
    container.appendChild(item);
  });
}

function renderChartSummary(summary, formatter) {
  const highest = Math.max(...summary.mean);
  const lowest = Math.min(...summary.mean);
  return `Máximo ${formatter(highest)} · Mínimo ${formatter(lowest)}`;
}

function renderScenarios() {
  scenarioList.innerHTML = "";
  state.scenarios.forEach((scenario) => {
    const item = document.createElement("li");
    item.className = "scenario-item";
    if (scenario.meta.scenarioId === state.activeScenarioId) {
      item.classList.add("active");
    }

    const title = document.createElement("strong");
    title.textContent = scenario.meta.description;

    const meta = document.createElement("div");
    meta.className = "scenario-meta";
    meta.textContent = `Fecha: ${scenario.meta.createdAt.slice(0, 10)}`;

    const actions = document.createElement("div");
    actions.className = "scenario-actions";

    const loadButton = document.createElement("button");
    loadButton.type = "button";
    loadButton.textContent = "Cargar";
    loadButton.addEventListener("click", () => loadScenario(scenario.meta.scenarioId));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Eliminar";
    deleteButton.addEventListener("click", () => deleteScenario(scenario.meta.scenarioId));

    actions.appendChild(loadButton);
    actions.appendChild(deleteButton);
    item.appendChild(title);
    item.appendChild(meta);
    item.appendChild(actions);
    scenarioList.appendChild(item);
  });
}

function saveScenario(event) {
  event.preventDefault();
  const name = scenarioName.value.trim();
  if (!name) {
    setStatus("Agrega un nombre para guardar el escenario.");
    return;
  }
  const dateValue = scenarioDate.value || new Date().toISOString().slice(0, 10);
  const active = getActiveScenario();
  const scenario = {
    ...active,
    meta: {
      scenarioId: createId(),
      createdAt: new Date(dateValue).toISOString(),
      description: name,
    },
  };
  scenario.results = simulateScenario(scenario);
  state.scenarios.unshift(scenario);
  if (state.scenarios.length > MAX_SCENARIOS) {
    state.scenarios = state.scenarios.slice(0, MAX_SCENARIOS);
  }
  state.activeScenarioId = scenario.meta.scenarioId;
  persistState();
  render();
  setStatus("Escenario guardado y activado.");
}

function loadScenario(id) {
  state.activeScenarioId = id;
  persistState();
  render();
  setStatus("Escenario cargado.");
}

function deleteScenario(id) {
  state.scenarios = state.scenarios.filter((scenario) => scenario.meta.scenarioId !== id);
  if (!state.scenarios.length) {
    state.scenarios = [createScenario("Escenario base")];
  }
  if (!state.scenarios.some((scenario) => scenario.meta.scenarioId === state.activeScenarioId)) {
    state.activeScenarioId = state.scenarios[0].meta.scenarioId;
  }
  persistState();
  render();
  setStatus("Escenario eliminado.");
}

function exportJSON() {
  const data = JSON.stringify(state, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "autolavado-escenarios.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus("Escenarios exportados.");
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed || !Array.isArray(parsed.scenarios)) {
        throw new Error("Formato inválido");
      }
      state = normalizeState(parsed);
      persistState();
      render();
      setStatus("Escenarios importados.");
    } catch (error) {
      setStatus("No se pudo importar el archivo. Revisa el formato.");
    }
  };
  reader.readAsText(file);
  event.target.value = "";
}

function render() {
  const scenario = getActiveScenario();
  if (!scenario) return;
  syncInputsFromScenario();
  renderKPIs(scenario.results);
  renderChart(chartWashes, scenario.results.series.monthly.washes, formatNumber);
  renderChartSummaryText(chartWashesSummary, scenario.results.series.monthly.washes, formatNumber);
  renderChart(chartRevenue, scenario.results.series.monthly.revenue, formatCurrency);
  renderChartSummaryText(chartRevenueSummary, scenario.results.series.monthly.revenue, formatCurrency);
  renderScenarios();
}

function renderChartSummaryText(container, summary, formatter) {
  container.textContent = renderChartSummary(summary, formatter);
}

bindControlPair(controls.priceCarro, controls.priceCarroNumber, (value) => {
  updateActiveScenario({ price: { carro: value } });
});

bindControlPair(controls.priceCamioneta, controls.priceCamionetaNumber, (value) => {
  updateActiveScenario({ price: { camioneta: value } });
});

bindControlPair(controls.mixTruck, controls.mixTruckNumber, (value) => {
  updateActiveScenario({ mixTruckPct: clamp(value, 0, 1) });
});

bindControlPair(controls.marginPct, controls.marginPctNumber, (value) => {
  updateActiveScenario({ marginPct: clamp(value, 0, 1) });
});

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

scenarioForm.addEventListener("submit", saveScenario);
exportButton.addEventListener("click", exportJSON);
importInput.addEventListener("change", importJSON);

render();
