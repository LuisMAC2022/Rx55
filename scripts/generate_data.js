#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const defaultConfig = {
  layoutName: "Dashboard Autolavado Condominios",
  cols: 5,
  rows: 10,
  totalSpots: 48,
  seed: 1337,
  emptyCells: [
    { row: 1, col: 5, cellType: "blocked" },
    { row: 10, col: 1, cellType: "empty" }
  ],
  floorsByTower: {
    A: 13,
    B: 7,
    C: 7,
    D: 7
  },
  unitsPerFloor: {
    A: 2,
    B: 4,
    C: 4,
    D: 4
  }
};

const argvConfig = process.argv.slice(2).reduce((acc, arg) => {
  if (!arg.startsWith("--") || !arg.includes("=")) return acc;
  const [key, value] = arg.slice(2).split("=");
  acc[key] = value;
  return acc;
}, {});

const config = {
  ...defaultConfig,
  seed: argvConfig.seed ? Number(argvConfig.seed) : defaultConfig.seed,
  totalSpots: argvConfig.totalSpots ? Number(argvConfig.totalSpots) : defaultConfig.totalSpots,
  floorsByTower: {
    A: argvConfig.floorsA ? Number(argvConfig.floorsA) : defaultConfig.floorsByTower.A,
    B: argvConfig.floorsB ? Number(argvConfig.floorsB) : defaultConfig.floorsByTower.B,
    C: argvConfig.floorsC ? Number(argvConfig.floorsC) : defaultConfig.floorsByTower.C,
    D: argvConfig.floorsD ? Number(argvConfig.floorsD) : defaultConfig.floorsByTower.D
  }
};

function mulberry32(seed) {
  let t = seed;
  return function rand() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(config.seed);

function pick(list) {
  return list[Math.floor(rng() * list.length)];
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

function generateUnits() {
  const units = [];
  Object.entries(config.floorsByTower).forEach(([tower, floors]) => {
    const perFloor = config.unitsPerFloor[tower];
    for (let floor = 1; floor <= floors; floor += 1) {
      for (let unit = 1; unit <= perFloor; unit += 1) {
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
}

const owners = [
  "María López",
  "Luis Martínez",
  "Ana Ruiz",
  "Carlos Herrera",
  "Sofía Gómez",
  "Javier Torres",
  "Lucía Navarro",
  "Miguel Ramos",
  "Elena Vega",
  "Fernando Cruz",
  "Valeria Ortiz",
  "Diego Castillo",
  "Paula Mendoza",
  "Rafael Soto",
  "Camila Reyes",
  "Andrés Silva",
  "Adriana Fuentes",
  "Hugo Estrada",
  "Daniela Rivas",
  "Santiago Molina"
];

const models = [
  "Nissan Versa",
  "Mazda 3",
  "Toyota Corolla",
  "Kia Rio",
  "Honda Civic",
  "Chevrolet Onix",
  "Volkswagen Jetta",
  "Hyundai Elantra",
  "SEAT Ibiza",
  "Renault Kwid"
];

const colors = [
  "Blanco",
  "Negro",
  "Gris",
  "Rojo",
  "Azul",
  "Plata",
  "Verde",
  "Vino"
];

function makePlates() {
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const part1 = Array.from({ length: 3 }, () => letters[Math.floor(rng() * letters.length)]).join("");
  const part2 = Math.floor(rng() * 9000 + 1000);
  return `${part1}-${part2}`;
}

function generateSpotData(unit) {
  return {
    vehicle: {
      model: pick(models),
      color: pick(colors),
      plates: makePlates()
    },
    owner: {
      name: pick(owners),
      tower: unit.tower,
      floor: unit.floor,
      unit: unit.unit,
      unitCode: unit.unitCode,
      hasPostalMail: rng() > 0.55
    },
    packagesPending: Math.floor(rng() * 6)
  };
}

function buildGrid() {
  const units = shuffle(generateUnits());
  const spotUnits = units.slice(0, config.totalSpots);
  const totalCells = config.cols * config.rows;
  const emptyMap = new Map(
    config.emptyCells.map((cell) => [`${cell.row}-${cell.col}`, cell.cellType])
  );
  const cells = [];
  let spotIndex = 0;
  for (let row = 1; row <= config.rows; row += 1) {
    for (let col = 1; col <= config.cols; col += 1) {
      const key = `${row}-${col}`;
      if (emptyMap.has(key)) {
        cells.push({
          row,
          col,
          cellType: emptyMap.get(key)
        });
        continue;
      }
      if (spotIndex >= config.totalSpots) {
        cells.push({
          row,
          col,
          cellType: "empty"
        });
        continue;
      }
      const spotLabel = `E${pad2(spotIndex + 1)}`;
      const unit = spotUnits[spotIndex];
      const spotData = generateSpotData(unit);
      cells.push({
        row,
        col,
        cellType: "spot",
        spotLabel,
        spot: spotData
      });
      spotIndex += 1;
    }
  }

  return {
    layout: {
      cols: config.cols,
      rows: config.rows,
      name: config.layoutName
    },
    cells
  };
}

const grid = buildGrid();
const outputPath = path.join(__dirname, "..", "data", "grid.json");
fs.writeFileSync(outputPath, JSON.stringify(grid, null, 2));

console.log(`Archivo generado: ${outputPath}`);
console.log(`Spots: ${grid.cells.filter((cell) => cell.cellType === "spot").length}`);
