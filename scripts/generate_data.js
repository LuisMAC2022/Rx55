#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const config = {
  layout: {
    cols: 5,
    rows: 10,
    name: "Dashboard Autolavado Condominios",
  },
  floorsByTower: {
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
  spotCount: 48,
  emptyCells: [
    { row: 1, col: 5, cellType: "blocked" },
    { row: 10, col: 1, cellType: "empty" },
  ],
  seed: 55,
};

function createSeededRandom(seed) {
  let value = seed;
  return function random() {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function padNumber(num, size) {
  return String(num).padStart(size, "0");
}

function generateUnits(floorsByTower, unitsPerFloor) {
  const towers = Object.keys(floorsByTower);
  const units = [];
  towers.forEach((tower) => {
    const floors = floorsByTower[tower];
    const perFloor = unitsPerFloor[tower];
    for (let floor = 1; floor <= floors; floor += 1) {
      for (let unit = 1; unit <= perFloor; unit += 1) {
        const unitCode = `${tower}-${padNumber(floor, 2)}-${padNumber(unit, 2)}`;
        units.push({
          tower,
          floor,
          unit: padNumber(unit, 2),
          unitCode,
        });
      }
    }
  });
  return units;
}

function shuffle(array, random) {
  const result = array.slice();
  for (let index = result.length - 1; index > 0; index -= 1) {
    const next = Math.floor(random() * (index + 1));
    [result[index], result[next]] = [result[next], result[index]];
  }
  return result;
}

function buildVehicle(random, index) {
  const models = ["Sedán", "SUV", "Hatchback", "Pickup", "Coupé", "Minivan"];
  const colors = ["Blanco", "Negro", "Rojo", "Azul", "Gris", "Plata"];
  const letters = "ABCDEFGHJKLMNPRSTUVWXYZ";
  const model = models[index % models.length];
  const color = colors[Math.floor(random() * colors.length)];
  const plates = `${letters[Math.floor(random() * letters.length)]}${letters[Math.floor(random() * letters.length)]}-${padNumber(Math.floor(random() * 999), 3)}`;
  return { model, color, plates };
}

function buildOwner(random, unit, index) {
  const names = [
    "Ana López",
    "Carlos Méndez",
    "Lucía Herrera",
    "María Santos",
    "Diego Ruiz",
    "Valeria Ortiz",
    "Jorge Peña",
    "Camila Navarro",
    "Sofía Díaz",
    "Andrés Vega",
  ];
  return {
    name: names[index % names.length],
    tower: unit.tower,
    floor: unit.floor,
    unit: unit.unit,
    unitCode: unit.unitCode,
    hasPostalMail: random() > 0.6,
  };
}

function generateGridData({ layout, floorsByTower, unitsPerFloor, spotCount, emptyCells, seed }) {
  const random = createSeededRandom(seed);
  const units = shuffle(generateUnits(floorsByTower, unitsPerFloor), random);
  const assignedUnits = units.slice(0, spotCount);

  const emptyMap = new Map(emptyCells.map((cell) => [`${cell.row}-${cell.col}`, cell.cellType]));
  const cells = [];
  let spotIndex = 1;

  for (let row = 1; row <= layout.rows; row += 1) {
    for (let col = 1; col <= layout.cols; col += 1) {
      const key = `${row}-${col}`;
      if (emptyMap.has(key)) {
        cells.push({ row, col, cellType: emptyMap.get(key) });
        continue;
      }
      if (spotIndex > spotCount) {
        cells.push({ row, col, cellType: "empty" });
        continue;
      }
      const unit = assignedUnits[spotIndex - 1];
      const vehicle = buildVehicle(random, spotIndex);
      const owner = buildOwner(random, unit, spotIndex);
      cells.push({
        row,
        col,
        cellType: "spot",
        spotLabel: `E${padNumber(spotIndex, 2)}`,
        spot: {
          vehicle,
          owner,
          packagesPending: Math.floor(random() * 6),
        },
      });
      spotIndex += 1;
    }
  }

  return { layout, cells };
}

const data = generateGridData(config);
const outputPath = path.join(__dirname, "..", "data", "grid.json");
fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Generated ${outputPath}`);
