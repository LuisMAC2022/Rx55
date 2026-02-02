# Fase 1 (MVP) — Esquema unificado de escenario activo

## JSON de ejemplo (valores por defecto)

```json
{
  "meta": {
    "scenarioId": "00000000-0000-0000-0000-000000000000",
    "createdAt": "2024-01-01T00:00:00Z",
    "description": "Escenario activo base (MVP Fase 1)"
  },
  "config": {
    "universeVehicles": 50,
    "horizonWeeks": 52,
    "weeksPerMonth": 4,
    "replicas": 100,
    "capacityUnlimited": true,
    "modelType": "stochastic-weekly",
    "evaluationMode": "exploratory"
  },
  "params": {
    "price": { "carro": 79, "camioneta": 99 },
    "marginPct": 0.12,
    "mixTruckPct": 0.35
  },
  "probabilityModel": {
    "type": "stepwise-linear",
    "formula": "min(0.10 + 0.05 * floor((t-1)/4), 0.80)",
    "cap": 0.80,
    "stepWeeks": 4,
    "base": 0.10,
    "increment": 0.05
  },
  "results": {
    "summary": {
      "revenueTotal": { "mean": 0, "p10": 0, "p90": 0 },
      "washesTotal": { "mean": 0, "p10": 0, "p90": 0 },
      "washesPerMonth": {
        "mean": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "p10": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        "p90": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    },
    "series": {
      "weekly": {
        "washes": {
          "mean": [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
          ],
          "p10": [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
          ],
          "p90": [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
          ]
        },
        "revenue": {
          "mean": [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
          ],
          "p10": [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
          ],
          "p90": [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
          ]
        }
      },
      "monthly": {
        "washes": {
          "mean": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          "p10": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          "p90": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        "revenue": {
          "mean": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          "p10": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          "p90": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      }
    }
  }
}
```

## Explicación breve por sección

- **meta:** Identifica el escenario activo con un UUID y marca temporal; `description` permite documentar la intención del run sin persistir historial.
- **config:** Fija el universo, horizonte y número de réplicas del escenario; además declara modo exploratorio y capacidad ilimitada para el MVP.
- **params:** Agrupa sliders editables (precios, margen y mix de camionetas) con valores por defecto del README.
- **probabilityModel:** Expone la fórmula escalonada de probabilidad semanal y sus parámetros para trazabilidad y lectura del dashboard.
- **results:** Contiene agregados por escenario (promedio y percentiles) y series semanales/mensuales; arreglos en cero para reservar estructura del MVP.

## Validaciones lógicas mínimas

- `mixTruckPct` y `marginPct` deben estar entre 0 y 1.
- Percentiles coherentes: `p10 ≤ mean ≤ p90` en totales y series.
- Longitudes: 52 valores semanales y 13 valores mensuales (52/4).
- `price` y totales de ingresos deben ser ≥ 0.
