# Alcance de la demo pre-MVP y brechas hacia producción

## Conclusión

El documento de diseño ya define con suficiente detalle los roles, permisos, historias, flujos y wireframes para construir una demo estática útil. Al iniciar este trabajo, la rama `Sol_MANT` solo contenía ese documento; faltaban una interfaz ejecutable, datos sintéticos, navegación y una entrada compatible con GitHub Pages.

La demo resultante sirve para validar la secuencia de trabajo y el lenguaje de la aplicación. No valida seguridad, integridad de datos, entregabilidad ni cumplimiento jurídico.

## Qué cubre esta muestra

| Capacidad del documento | Representación en la demo |
|---|---|
| Acceso por invitación | Selección de perfil, correo de ejemplo y enlace mágico simulado |
| Aviso de privacidad | Pantalla previa al acceso y consulta dentro de la sesión |
| Residente | Inicio, selector de departamento, paquetes, detalle con línea de tiempo y estado de cuenta |
| Caseta | Estado de conexión, roster mínimo, entrada/salida, cola local simulada, recepción, aviso manual y entrega |
| Administrador | Resumen agregado, invitación, captura de pago con vista previa, generación mensual y preparación de privacidad |
| Reglas de minimización | No existen campos para guía, contenido, identificación, fotografía, firma, banco, CLABE, tarjeta o comprobante |
| Accesibilidad inicial | Foco visible, navegación por teclado, controles táctiles, textos además de color y diseño responsivo |

La selección manual de perfil existe solo para facilitar una presentación. En el producto real, los módulos se derivarán de las asignaciones vigentes del usuario autenticado.

## Qué falta para convertirla en MVP real

### 1. Decisiones de producto y operación

- Confirmar si los inquilinos pueden consultar información patrimonial o si se separarán los roles `PROPIETARIO` e `INQUILINO`.
- Definir empresas y tipos de paquetería, métodos válidos de aviso manual y procedimiento físico de entrega.
- Confirmar cuota, vencimiento, saldos iniciales, pagos parciales, anticipos, folios y política de periodos cerrados.
- Definir cuentas individuales, dispositivos y tolerancia a caídas de conexión en caseta.
- Nombrar responsables de aceptación, soporte, piloto y contingencia.

### 2. Privacidad y gobierno de datos

- Completar identidad y domicilio del responsable, canal ARCO y persona que atenderá solicitudes.
- Aprobar aviso integral y simplificado con asesoría jurídica; separar el acuse de cualquier consentimiento expreso.
- Confirmar fundamento para mostrar el estado de mantenimiento y plazos de retención contable/operativa.
- Formalizar contratos con proveedores, respuesta a incidentes, purgas, bloqueos y restauración de respaldos.

Hasta completar estos puntos, solo deben usarse datos sintéticos.

### 3. Aplicación y backend

- Implementar la PWA propuesta con React, TypeScript y Vite, reutilizando los patrones visuales validados aquí.
- Crear Supabase Auth con registro público deshabilitado, enlace mágico/OTP, invitaciones y revocación de sesiones.
- Materializar el esquema PostgreSQL, sus restricciones, vistas, historial de estados, outbox, auditoría y acuses de privacidad.
- Implementar RLS y funciones transaccionales para cada escritura crítica; el rol nunca debe confiarse al navegador.
- Añadir idempotencia, control de concurrencia y anulaciones `append-only` para accesos, paquetes y pagos.
- Implementar service worker e IndexedDB para una cola offline acotada, expiración, desfase de reloj y sincronización por elemento.
- Conectar Web Push y correo mediante outbox, reintentos, rebotes y mensajes sin datos del departamento.

### 4. Calidad y lanzamiento

- Pruebas unitarias de saldo, vigencias, transiciones e idempotencia.
- Pruebas de integración negativas para toda la matriz de permisos y RLS.
- Pruebas E2E de los tres flujos críticos con red lenta, modo offline, doble clic y concurrencia.
- Validación WCAG 2.1 AA, Android de gama media, iPhone/PWA y escritorio de caseta.
- Dominio, HTTPS, SPF, DKIM, DMARC, monitoreo sin PII, respaldo restaurable y política de purga.
- Piloto con 8–10 departamentos y un turno de caseta antes del lanzamiento a los 54 departamentos.

## Dirección recomendada

1. Validar esta demo con una persona residente, una operadora de caseta y administración.
2. Registrar cambios de secuencia, terminología y densidad de información; evitar ampliar módulos.
3. Resolver primero los bloqueos de autorización patrimonial, privacidad y política de pagos.
4. Construir un corte técnico vertical de paquetería —autenticación, RLS, transición y aviso— porque prueba la mayor parte de la arquitectura.
5. Incorporar accesos offline y mantenimiento después de validar ese corte, manteniendo datos sintéticos hasta la aprobación legal.

## Criterio de éxito de la demo

La muestra cumple su propósito cuando las personas participantes pueden, sin explicación técnica:

- identificar qué puede hacer cada rol;
- completar una entrada/salida y entender cuándo queda en cola;
- seguir un paquete de recepción a aviso y entrega;
- explicar cómo se obtiene el saldo y por qué no existe un botón para pagar;
- señalar qué información deliberadamente no se captura;
- acordar qué decisiones deben resolverse antes de programar el MVP real.

