# Dashboard Autolavado Condominios

Proyecto web estático listo para GitHub Pages que muestra un dashboard de cajones con datos locales.

## Requisitos

- Node.js 18+ (solo para regenerar datos)

## Uso local

Ejecuta un servidor simple desde la raíz del proyecto:

```bash
python3 -m http.server 8000
```

Luego abre `http://localhost:8000/` en el navegador.

## Regenerar datos

El JSON de datos se genera con un script determinista. Puedes ajustar pisos, seed y celdas vacías en `scripts/generate_data.js`.

```bash
node scripts/generate_data.js
```

El script sobrescribe `data/grid.json`.

## GitHub Pages

1. Sube el repositorio a GitHub.
2. En **Settings → Pages**, selecciona la rama y carpeta raíz (`/`).
3. Guarda la configuración; GitHub publicará el sitio con rutas relativas.
