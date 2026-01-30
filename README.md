# Dashboard Autolavado (GitHub Pages)

Proyecto estático en HTML/CSS/JS que renderiza un dashboard de 5×10 para 48 cajones de estacionamiento de un autolavado en condominios.

## Requisitos

- Node.js 18+ (para regenerar datos)
- Cualquier servidor estático local (por ejemplo, `python -m http.server`)

## Ejecutar localmente

```bash
python -m http.server 8000
```

Abrir en el navegador: `http://localhost:8000`.

## Regenerar datos

El archivo de datos se genera con un script determinista basado en seed.

```bash
node scripts/generate_data.js
```

Parámetros opcionales:

```bash
node scripts/generate_data.js --seed=123 --spots=48 --floors=A:13,B:7,C:7,D:7
```

- `--seed`: semilla para generar datos reproducibles.
- `--spots`: número de cajones (debe coincidir con la cuadrícula y celdas vacías).
- `--floors`: define pisos por torre en formato `Torre:Pisos`.

## Activar GitHub Pages

1. En GitHub, abre **Settings → Pages**.
2. En **Build and deployment**, selecciona la rama `main` y la carpeta `/ (root)`.
3. Guarda los cambios y espera a que se publique.

## Estructura de archivos

- `index.html`: HTML principal.
- `styles.css`: estilos en dark mode y responsive.
- `app.js`: renderizado del dashboard, búsqueda y panel de detalle.
- `data/grid.json`: datos locales.
- `scripts/generate_data.js`: script para regenerar el JSON.
