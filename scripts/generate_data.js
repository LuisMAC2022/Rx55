#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const config = {
  layout: { cols: 5, rows: 10, name: "Dashboard Autolavado - Condominios" },
  totalSpots: 48,
  floors: {
    A: 13,
    B: 7,
    C: 7,
    D: 7,
  },
  unitsPerFloor: {
    A: 2,
    B: 4,
    C: 4,
    D: 4,
  },
  seed: 20240130,
  emptyCells: [
    { row: 10, col: 5, cellType: "empty" },
    { row: 1, col: 5, cellType: "blocked" },
  ],
};

const args = process.argv.slice(2);
const argMap = new Map();
for (const arg of args) {
  const [key, value] = arg.split("=");
  if (key && value) {
    argMap.set(key.replace(/^--/, ""), value);
  }
}

if (argMap.has("seed")) {
  config.seed = Number(argMap.get("seed"));
}

if (argMap.has("floors")) {
  const floorsInput = argMap.get("floors").split(",");
  for (const entry of floorsInput) {
    const [tower, floorsValue] = entry.split(":");
    if (tower && floorsValue && config.floors[tower.toUpperCase()] !== undefined) {
      config.floors[tower.toUpperCase()] = Number(floorsValue);
    }
  }
}

const totalSpotsOverride = argMap.get("spots");
if (totalSpotsOverride) {
  config.totalSpots = Number(totalSpotsOverride);
}

const rand = (() => {
  let state = config.seed >>> 0;
  const next = () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 2 ** 32;
  };
  return { next };
})();

const pick = (list) => list[Math.floor(rand.next() * list.length)];

const pad2 = (value) => String(value).padStart(2, "0");

const buildUnits = () => {
  const units = [];
  for (const tower of Object.keys(config.floors)) {
    const floors = config.floors[tower];
    const unitsPerFloor = config.unitsPerFloor[tower];
    for (let floor = 1; floor <= floors; floor += 1) {
      for (let unit = 1; unit <= unitsPerFloor; unit += 1) {
        const unitCode = `${tower}-${pad2(floor)}-${pad2(unit)}`;
        units.push({
          tower,
          floor,
          unit: pad2(unit),
          unitCode,
        });
      }
    }
  }
  return units;
};

const shuffle = (list) => {
  const result = list.slice();
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand.next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const vehicleModels = [
  "Nissan Versa",
  "Toyota Corolla",
  "Honda Civic",
  "Kia Rio",
  "Mazda 3",
  "Chevrolet Onix",
  "Volkswagen Jetta",
  "Hyundai Elantra",
];

const colors = [
  "Rojo",
  "Azul",
  "Blanco",
  "Negro",
  "Plata",
  "Gris",
  "Verde",
  "Vino",
];

const ownerNames = [
  "María Torres",
  "Luis Andrade",
  "Fernanda Ruiz",
  "Carlos Moreno",
  "Sofía López",
  "Jorge Castillo",
  "Ana Morales",
  "David Pérez",
  "Valeria Guzmán",
  "Miguel Santos",
  "Paola Rivas",
  "Diego Herrera",
];

const buildPlates = () => {
  const letters = "ABCDEFGHJKLMPQRSTUVWX";
  const part1 = `${pick(letters)}${pick(letters)}${pick(letters)}`;
  const part2 = `${Math.floor(rand.next() * 900) + 100}`;
  return `${part1}-${part2}`;
};

const buildSpot = (label, unit) => {
  const ownerName = pick(ownerNames);
  return {
    spotLabel: label,
    vehicle: {
      model: pick(vehicleModels),
      color: pick(colors),
      plates: buildPlates(),
    },
    owner: {
      name: ownerName,
      tower: unit.tower,
      floor: unit.floor,
      unit: unit.unit,
      unitCode: unit.unitCode,
      hasPostalMail: rand.next() > 0.55,
    },
    packagesPending: Math.floor(rand.next() * 4),
  };
};

const buildGrid = () => {
  const units = buildUnits();
  const shuffledUnits = shuffle(units).slice(0, config.totalSpots);

  const emptyKey = new Map(
    config.emptyCells.map((cell) => [`${cell.row}-${cell.col}`, cell])
  );

  const cells = [];
  const positions = [];
  for (let row = 1; row <= config.layout.rows; row += 1) {
    for (let col = 1; col <= config.layout.cols; col += 1) {
      const key = `${row}-${col}`;
      if (!emptyKey.has(key)) {
        positions.push({ row, col });
      }
    }
  }

  if (positions.length !== config.totalSpots) {
    throw new Error(
      `Expected ${config.totalSpots} spots, got ${positions.length} positions. Adjust empty cells.`
    );
  }

  positions.forEach((pos, index) => {
    const spotLabel = `E${pad2(index + 1)}`;
    cells.push({
      row: pos.row,
      col: pos.col,
      cellType: "spot",
      spot: buildSpot(spotLabel, shuffledUnits[index]),
    });
  });

  config.emptyCells.forEach((cell) => {
    cells.push({
      row: cell.row,
      col: cell.col,
      cellType: cell.cellType,
    });
  });

  return cells;
};

const data = {
  layout: config.layout,
  cells: buildGrid(),
};

const outputPath = path.join(__dirname, "..", "data", "grid.json");
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");

console.log(`Generated ${outputPath}`);
