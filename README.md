# Dashboard Autolavado (GitHub Pages)

Proyecto estático en HTML/CSS/JS para visualizar la asignación de cajones de estacionamiento y servicios asociados del autolavado del condominio.

## ✅ Requisitos

- Node.js (para regenerar `data/grid.json`).
- Cualquier servidor estático simple (Python, Node, etc.).

## Ejecutar localmente

Desde la raíz del proyecto:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000` en tu navegador.

## Regenerar datos

El script genera `data/grid.json` con el layout 5×10, 48 spots y 2 celdas vacías/bloqueadas.

```bash
node scripts/generate_data.js
```

Opcionalmente puedes ajustar parámetros:

```bash
node scripts/generate_data.js seed=mi-seed spots=48 floors='{"A":13,"B":7,"C":7,"D":7}'
```

- `seed`: define la semilla determinista.
- `spots`: número de cajones.
- `floors`: JSON con pisos por torre.

## Activar GitHub Pages

1. Sube este repo a GitHub.
2. Ve a **Settings → Pages**.
3. Selecciona la rama principal (por ejemplo, `main`) y la carpeta raíz (`/`).
4. Guarda y espera la URL publicada.

El proyecto usa rutas relativas (`data/grid.json`) para ser compatible con GitHub Pages.
