#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const defaultConfig = {
  layout: { cols: 5, rows: 10, name: "Dashboard Autolavado" },
  floorsByTower: { A: 13, B: 7, C: 7, D: 7 },
  unitsPerFloor: { A: 2, B: 4, C: 4, D: 4 },
  seed: "rx55-seed-2024",
  totalSpots: 48,
  emptyCells: [
    { row: 1, col: 1, cellType: "empty" },
    { row: 10, col: 5, cellType: "blocked" }
  ]
};

const args = process.argv.slice(2);
const overrides = Object.create(null);
for (let i = 0; i < args.length; i += 1) {
  const [key, value] = args[i].split("=");
  if (!value) continue;
  overrides[key] = value;
}

const config = {
  ...defaultConfig,
  seed: overrides.seed || defaultConfig.seed,
  totalSpots: overrides.spots ? Number(overrides.spots) : defaultConfig.totalSpots,
  floorsByTower: {
    ...defaultConfig.floorsByTower,
    ...(overrides.floors ? JSON.parse(overrides.floors) : {})
  }
};

const seedToInt = (seed) => {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
};

const mulberry32 = (a) => {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const rng = mulberry32(seedToInt(config.seed));

const pad2 = (value) => String(value).padStart(2, "0");

const buildUnits = () => {
  const units = [];
  Object.keys(config.floorsByTower).forEach((tower) => {
    const floors = config.floorsByTower[tower];
    const unitsPerFloor = config.unitsPerFloor[tower];
    for (let floor = 1; floor <= floors; floor += 1) {
      for (let unit = 1; unit <= unitsPerFloor; unit += 1) {
        const unitCode = `${tower}-${pad2(floor)}-${pad2(unit)}`;
        units.push({
          tower,
          floor,
          unit: pad2(unit),
          unitCode
        });
      }
    }
  });
  return units;
};

const shuffle = (array) => {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const vehicles = [
  { model: "Mazda CX-5", color: "Gris" },
  { model: "Toyota Corolla", color: "Blanco" },
  { model: "Honda Civic", color: "Azul" },
  { model: "Kia Sportage", color: "Rojo" },
  { model: "Nissan Sentra", color: "Negro" },
  { model: "VW Jetta", color: "Plata" },
  { model: "Hyundai Tucson", color: "Verde" },
  { model: "Chevrolet Tracker", color: "Arena" }
];

const ownerNames = [
  "Ana Torres",
  "Carlos Mejía",
  "Lucía Mendoza",
  "Sofía Rivera",
  "Hugo Zamora",
  "Fernanda Cruz",
  "Diego Varela",
  "Marta Lozano",
  "Javier Santos",
  "Olivia Ríos",
  "Paola Sánchez",
  "Iván Salazar",
  "Elena Flores",
  "Rafael Vega",
  "Valeria Castillo",
  "Marco Luna"
];

const generatePlates = () => {
  const letters = "BCDFGHJKMNPQRSTVWXYZ";
  const pick = () => letters[Math.floor(rng() * letters.length)];
  const digits = () => Math.floor(rng() * 900 + 100);
  return `${pick()}${pick()}-${digits()}`;
};

const unitsPool = shuffle(buildUnits());
const selectedUnits = unitsPool.slice(0, config.totalSpots);

const buildSpots = () => {
  return Array.from({ length: config.totalSpots }, (_, index) => {
    const vehicle = vehicles[Math.floor(rng() * vehicles.length)];
    const ownerName = ownerNames[Math.floor(rng() * ownerNames.length)];
    const unit = selectedUnits[index];
    return {
      spotLabel: `E${pad2(index + 1)}`,
      vehicle: {
        model: vehicle.model,
        color: vehicle.color,
        plates: generatePlates()
      },
      owner: {
        name: ownerName,
        tower: unit.tower,
        floor: unit.floor,
        unit: unit.unit,
        unitCode: unit.unitCode,
        hasPostalMail: rng() > 0.55
      },
      packagesPending: Math.floor(rng() * 5)
    };
  });
};

const buildCells = () => {
  const spotQueue = buildSpots();
  const cells = [];
  let spotIndex = 0;
  for (let row = 1; row <= config.layout.rows; row += 1) {
    for (let col = 1; col <= config.layout.cols; col += 1) {
      const forced = config.emptyCells.find((cell) => cell.row === row && cell.col === col);
      if (forced) {
        cells.push({ row, col, cellType: forced.cellType });
        continue;
      }
      if (spotIndex < spotQueue.length) {
        cells.push({
          row,
          col,
          cellType: "spot",
          spot: spotQueue[spotIndex]
        });
        spotIndex += 1;
      } else {
        cells.push({ row, col, cellType: "empty" });
      }
    }
  }
  return cells;
};

const output = {
  layout: config.layout,
  cells: buildCells()
};

const outPath = path.join(__dirname, "..", "data", "grid.json");
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Data written to ${outPath}`);
