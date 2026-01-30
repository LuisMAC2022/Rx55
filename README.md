# Dashboard Autolavado Condominios

Proyecto web estático listo para GitHub Pages. Renderiza una cuadrícula de 5×10 con 48 cajones (spots) y 2 celdas vacías/bloqueadas, usando datos locales en JSON.

## Requisitos

- Node.js (solo para regenerar `data/grid.json`).
- Cualquier servidor estático simple para desarrollo local.

## Ejecutar en local

Desde la raíz del proyecto:

```bash
python3 -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Regenerar datos

El archivo `data/grid.json` se genera desde `scripts/generate_data.js`.

```bash
node scripts/generate_data.js
```

Parámetros opcionales:

```bash
node scripts/generate_data.js \
  --seed=2024 \
  --totalSpots=48 \
  --floorsA=13 \
  --floorsB=7 \
  --floorsC=7 \
  --floorsD=7
```

Los cajones se asignan de forma pseudoaleatoria pero determinista usando la semilla indicada.

## Activar GitHub Pages

1. Sube el repositorio a GitHub.
2. Ve a **Settings → Pages**.
3. Selecciona **Deploy from a branch**.
4. Elige la rama principal y la carpeta `/ (root)`.
5. Guarda; GitHub generará la URL pública.

## Estructura

- `index.html` — estructura semántica y accesible.
- `styles.css` — estilo dark mode y responsive.
- `app.js` — renderizado, búsqueda y panel de detalle.
- `data/grid.json` — datos locales del tablero.
- `scripts/generate_data.js` — script de build para regenerar datos.
