# RX55 · Demo pre-MVP

Prototipo estático y navegable para validar la dirección inicial de la aplicación de administración del condominio descrita en [`docs/design-doc-mvp-condominio.md`](./docs/design-doc-mvp-condominio.md).

La muestra funciona únicamente con HTML, CSS y JavaScript, sin compilación ni dependencias. Todos los datos son ficticios y los cambios viven solo durante la sesión del navegador.

## Recorridos incluidos

- acceso simulado por correo y aviso de privacidad;
- vista de residente: paquetes y estado de cuenta por departamento;
- vista de caseta: entradas/salidas, cola sin conexión y ciclo de paquetería;
- vista administrativa: indicadores, invitaciones, cargos y captura de pagos externos;
- cambio rápido de perfil para presentar los tres roles.

## Ejecutar localmente

Puedes abrir `index.html` directamente o servir la carpeta para probarla como sitio:

```bash
python3 -m http.server 8080
```

Después visita `http://localhost:8080`.

## Publicación en GitHub Pages

Los archivos usan rutas relativas y no requieren proceso de construcción. La fuente de Pages puede apuntar a la raíz de la rama `Sol_MANT`.

## Alcance y siguientes pasos

La demo no implementa autenticación real, base de datos, autorización, notificaciones, persistencia offline ni tratamiento de datos personales. El análisis de brechas y la ruta sugerida al MVP están en [`docs/demo-pre-mvp.md`](./docs/demo-pre-mvp.md).

