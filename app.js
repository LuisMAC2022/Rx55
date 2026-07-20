"use strict";

const profiles = Object.freeze({
  resident: {
    label: "Residente",
    name: "Mariana R.",
    firstName: "Mariana",
    initials: "MR",
    email: "residente@demo.rx55.mx",
  },
  caseta: {
    label: "Caseta",
    name: "Diego M.",
    firstName: "Diego",
    initials: "DM",
    email: "caseta@demo.rx55.mx",
  },
  admin: {
    label: "Administración",
    name: "Ana L.",
    firstName: "Ana",
    initials: "AL",
    email: "admin@demo.rx55.mx",
  },
});

const navigation = Object.freeze({
  resident: [
    { id: "resident-home", label: "Inicio", icon: "⌂" },
    { id: "resident-packages", label: "Mis paquetes", icon: "◇", count: "residentPackages" },
    { id: "resident-account", label: "Estado de cuenta", icon: "$" },
  ],
  caseta: [
    { id: "caseta-home", label: "Inicio de caseta", icon: "⌂" },
    { id: "caseta-access", label: "Accesos", icon: "↕", count: "queue" },
    { id: "caseta-packages", label: "Paquetería", icon: "◇", count: "pendingPackages" },
  ],
  admin: [
    { id: "admin-home", label: "Panel", icon: "⌂" },
    { id: "admin-users", label: "Usuarios", icon: "◎" },
    { id: "admin-maintenance", label: "Mantenimiento", icon: "$" },
    { id: "admin-privacy", label: "Privacidad", icon: "◈" },
  ],
});

const seedData = Object.freeze({
  packages: [
    {
      id: "P-1048",
      department: "A-204",
      company: "DHL",
      type: "Caja",
      state: "NOTIFICADO",
      receivedAt: "20 jul 2026 · 10:14",
      notifiedAt: "20 jul 2026 · 10:16",
      deliveredAt: null,
      channel: "Correo",
      digitalRecipient: true,
      exception: null,
    },
    {
      id: "P-1047",
      department: "B-101",
      company: "Amazon",
      type: "Sobre",
      state: "RECIBIDO",
      receivedAt: "20 jul 2026 · 09:42",
      notifiedAt: null,
      deliveredAt: null,
      channel: null,
      digitalRecipient: false,
      exception: "Sin destinatario digital",
    },
    {
      id: "P-1046",
      department: "C-303",
      company: "Estafeta",
      type: "Caja",
      state: "RECIBIDO",
      receivedAt: "20 jul 2026 · 08:55",
      notifiedAt: null,
      deliveredAt: null,
      channel: null,
      digitalRecipient: true,
      exception: "Aviso pendiente de reintento",
    },
    {
      id: "P-1039",
      department: "A-204",
      company: "FedEx",
      type: "Sobre",
      state: "ENTREGADO",
      receivedAt: "18 jul 2026 · 12:08",
      notifiedAt: "18 jul 2026 · 12:09",
      deliveredAt: "18 jul 2026 · 18:22",
      channel: "Push",
      digitalRecipient: true,
      exception: null,
    },
    {
      id: "P-1032",
      department: "B-502",
      company: "Mercado Libre",
      type: "Caja",
      state: "ENTREGADO",
      receivedAt: "15 jul 2026 · 16:21",
      notifiedAt: "15 jul 2026 · 16:22",
      deliveredAt: "16 jul 2026 · 07:48",
      channel: "Correo",
      digitalRecipient: true,
      exception: null,
    },
  ],
  roster: [
    {
      id: "EMP-01",
      alias: "Luna",
      position: "Limpieza",
      shift: "Matutino",
      lastType: "SALIDA",
      lastAt: "ayer · 17:04",
      active: true,
    },
    {
      id: "EMP-02",
      alias: "Roble",
      position: "Jardinería",
      shift: "Matutino",
      lastType: "ENTRADA",
      lastAt: "hoy · 08:12",
      active: true,
    },
    {
      id: "EMP-03",
      alias: "Faro",
      position: "Mantenimiento",
      shift: "Mixto",
      lastType: "SALIDA",
      lastAt: "18 jul · 16:36",
      active: true,
    },
    {
      id: "EMP-04",
      alias: "Nube",
      position: "Limpieza",
      shift: "Vespertino",
      lastType: "SALIDA",
      lastAt: "18 jul · 20:02",
      active: true,
    },
  ],
  movements: [
    {
      id: "MOV-280",
      employeeId: "EMP-02",
      alias: "Roble",
      position: "Jardinería",
      type: "ENTRADA",
      at: "20 jul · 08:12",
      actor: "Diego M.",
      sync: "Sincronizado",
    },
    {
      id: "MOV-279",
      employeeId: "EMP-01",
      alias: "Luna",
      position: "Limpieza",
      type: "SALIDA",
      at: "19 jul · 17:04",
      actor: "Diego M.",
      sync: "Sincronizado",
    },
    {
      id: "MOV-278",
      employeeId: "EMP-01",
      alias: "Luna",
      position: "Limpieza",
      type: "ENTRADA",
      at: "19 jul · 07:59",
      actor: "Sofía P.",
      sync: "Sincronizado",
    },
    {
      id: "MOV-277",
      employeeId: "EMP-04",
      alias: "Nube",
      position: "Limpieza",
      type: "SALIDA",
      at: "18 jul · 20:02",
      actor: "Sofía P.",
      sync: "Sincronizado",
    },
  ],
  accounts: {
    "A-204": {
      label: "Torre A · Departamento 204",
      debt: 1850,
      credit: 0,
      cutoff: "20 jul 2026 · 14:30",
      movements: [
        {
          id: "CAR-0726",
          kind: "cargo",
          title: "Mantenimiento julio 2026",
          date: "01 jul 2026",
          due: "10 jul 2026",
          amount: 1850,
          applied: 0,
          pending: 1850,
          status: "Pendiente",
        },
        {
          id: "PAG-0626",
          kind: "pago",
          title: "Pago externo",
          date: "05 jun 2026",
          folio: "•••-0626-18",
          amount: -1850,
          applied: 1850,
          pending: 0,
          status: "Aplicado",
        },
        {
          id: "CAR-0626",
          kind: "cargo",
          title: "Mantenimiento junio 2026",
          date: "01 jun 2026",
          due: "10 jun 2026",
          amount: 1850,
          applied: 1850,
          pending: 0,
          status: "Cubierto",
        },
      ],
    },
    "B-502": {
      label: "Torre B · Departamento 502",
      debt: 0,
      credit: 550,
      cutoff: "20 jul 2026 · 14:30",
      movements: [
        {
          id: "PAG-0726",
          kind: "pago",
          title: "Pago externo",
          date: "02 jul 2026",
          folio: "•••-0726-03",
          amount: -2400,
          applied: 1850,
          pending: 0,
          status: "Aplicado",
        },
        {
          id: "CAR-B0726",
          kind: "cargo",
          title: "Mantenimiento julio 2026",
          date: "01 jul 2026",
          due: "10 jul 2026",
          amount: 1850,
          applied: 1850,
          pending: 0,
          status: "Cubierto",
        },
      ],
    },
  },
  users: [
    {
      id: "USR-01",
      alias: "Mariana R.",
      email: "mariana.residente@example.mx",
      role: "Residente",
      department: "A-204, B-502",
      status: "Activo",
      lastAccess: "Hoy · 09:18",
    },
    {
      id: "USR-02",
      alias: "Diego M.",
      email: "diego.caseta@example.mx",
      role: "Caseta",
      department: "—",
      status: "Activo",
      lastAccess: "Ahora",
    },
    {
      id: "USR-03",
      alias: "Ana L.",
      email: "ana.admin@example.mx",
      role: "Administrador",
      department: "—",
      status: "Activo",
      lastAccess: "Hoy · 08:42",
    },
    {
      id: "USR-04",
      alias: "Carlos V.",
      email: "carlos.vecino@example.mx",
      role: "Residente",
      department: "C-303",
      status: "Pendiente",
      lastAccess: "Invitado · 18 jul",
    },
  ],
  payments: [
    { id: "PAG-088", department: "C-104", amount: 1850, date: "19 jul 2026", folio: "•••-0719-08", actor: "Ana L." },
    { id: "PAG-087", department: "B-502", amount: 2400, date: "18 jul 2026", folio: "•••-0718-04", actor: "Ana L." },
    { id: "PAG-086", department: "A-302", amount: 1850, date: "18 jul 2026", folio: "•••-0718-02", actor: "Ana L." },
  ],
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createState(role = "resident") {
  return {
    role,
    view: navigation[role][0].id,
    selectedDepartment: "A-204",
    online: true,
    queue: [],
    packageFilter: "pending",
    residentPackageFilter: "pending",
    packages: clone(seedData.packages),
    roster: clone(seedData.roster),
    movements: clone(seedData.movements),
    accounts: clone(seedData.accounts),
    users: clone(seedData.users),
    payments: clone(seedData.payments),
    nextChargesGenerated: false,
  };
}

let selectedRole = "resident";
let state = createState();

const authScreen = document.querySelector("#auth-screen");
const demoShell = document.querySelector("#demo-shell");
const loginStep = document.querySelector("#login-step");
const linkStep = document.querySelector("#link-step");
const privacyStep = document.querySelector("#privacy-step");
const loginEmail = document.querySelector("#login-email");
const privacyAck = document.querySelector("#privacy-ack");
const enterAppButton = document.querySelector("#enter-app");
const sideNav = document.querySelector("#side-nav");
const bottomNav = document.querySelector("#bottom-nav");
const mainContent = document.querySelector("#main-content");
const modal = document.querySelector("#app-modal");
const modalBody = document.querySelector("#modal-body");
const modalTitle = document.querySelector("#modal-title");
const modalKicker = document.querySelector("#modal-kicker");
const toastRegion = document.querySelector("#toast-region");

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

function formatCurrency(value) {
  return currencyFormatter.format(Number(value || 0));
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function maskEmail(email) {
  const [local = "", domain = ""] = String(email).split("@");
  const visible = local.slice(0, Math.min(2, local.length));
  const stars = "•".repeat(Math.max(3, Math.min(7, local.length - visible.length)));
  return `${visible}${stars}@${domain}`;
}

function currentTime() {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date());
}

function statusClass(value) {
  const map = {
    RECIBIDO: "received",
    NOTIFICADO: "notified",
    ENTREGADO: "delivered",
    Pendiente: "pending",
    Activo: "active",
    Inactivo: "inactive",
    Sincronizado: "success",
    "Pendiente de sincronizar": "offline",
    Aplicado: "success",
    Cubierto: "success",
  };
  return map[value] || "neutral";
}

function statusLabel(value) {
  const map = {
    RECIBIDO: "Recibido",
    NOTIFICADO: "Aviso enviado",
    ENTREGADO: "Entregado",
  };
  return map[value] || value;
}

function packageCount(filter = "pending") {
  return state.packages.filter((item) =>
    filter === "pending" ? item.state !== "ENTREGADO" : item.state === "ENTREGADO",
  ).length;
}

function residentPackageCount() {
  return state.packages.filter(
    (item) => item.department === state.selectedDepartment && item.state !== "ENTREGADO",
  ).length;
}

function getNavCount(item) {
  if (item.count === "queue") return state.queue.length;
  if (item.count === "pendingPackages") return packageCount("pending");
  if (item.count === "residentPackages") return residentPackageCount();
  return 0;
}

function navMarkup(item) {
  const count = getNavCount(item);
  return `
    <button
      class="nav-item${state.view === item.id ? " is-active" : ""}"
      type="button"
      data-nav="${item.id}"
      ${state.view === item.id ? 'aria-current="page"' : ""}
    >
      <span class="nav-item__icon" aria-hidden="true">${item.icon}</span>
      <span class="nav-item__label">${item.label}</span>
      ${count ? `<span class="nav-item__count" aria-label="${count} pendientes">${count}</span>` : ""}
    </button>
  `;
}

function renderNavigation() {
  const items = navigation[state.role];
  const markup = items.map(navMarkup).join("");
  sideNav.innerHTML = markup;
  bottomNav.innerHTML = markup;
}

function updateShellChrome() {
  const profile = profiles[state.role];
  const currentNav = navigation[state.role].find((item) => item.id === state.view) || navigation[state.role][0];

  document.querySelector("#sidebar-avatar").textContent = profile.initials;
  document.querySelector("#sidebar-name").textContent = profile.name;
  document.querySelector("#sidebar-role").textContent = profile.label;
  document.querySelector("#role-switch").value = state.role;
  document.querySelector("#page-kicker").textContent = profile.label;
  document.querySelector("#page-title").textContent =
    state.view === navigation[state.role][0].id ? `Hola, ${profile.firstName}` : currentNav.label;

  const connectionButton = document.querySelector("#connection-toggle");
  const connectionLabel = document.querySelector("#connection-label");
  connectionButton.hidden = state.role !== "caseta";
  connectionButton.classList.toggle("is-online", state.online);
  connectionButton.classList.toggle("is-offline", !state.online);
  connectionButton.setAttribute(
    "aria-label",
    state.online ? "Cambiar simulación a modo sin conexión" : "Cambiar simulación a modo en línea",
  );
  connectionLabel.textContent = state.online ? "En línea" : "Sin conexión";
}

function renderShell() {
  renderNavigation();
  updateShellChrome();
  renderView();
}

function setView(view) {
  if (!navigation[state.role].some((item) => item.id === view)) return;
  state.view = view;
  renderShell();
  window.scrollTo({ top: 0, behavior: "smooth" });
  mainContent.focus({ preventScroll: true });
}

function switchRole(role) {
  if (!profiles[role]) return;
  state.role = role;
  state.view = navigation[role][0].id;
  renderShell();
  showToast("Perfil cambiado", `Ahora exploras la vista de ${profiles[role].label.toLowerCase()}.`);
}

function resetDemo() {
  const role = state.role;
  state = createState(role);
  renderShell();
  closeModal();
  showToast("Demo reiniciada", "Los datos ficticios volvieron a su estado inicial.");
}

function renderView() {
  const renderers = {
    "resident-home": renderResidentHome,
    "resident-packages": renderResidentPackages,
    "resident-account": renderResidentAccount,
    "caseta-home": renderCasetaHome,
    "caseta-access": renderCasetaAccess,
    "caseta-packages": renderCasetaPackages,
    "admin-home": renderAdminHome,
    "admin-users": renderAdminUsers,
    "admin-maintenance": renderAdminMaintenance,
    "admin-privacy": renderAdminPrivacy,
  };

  const renderer = renderers[state.view] || renderers[navigation[state.role][0].id];
  mainContent.innerHTML = renderer();
}

function departmentOptions(selected, includeAll = false) {
  const departments = includeAll
    ? ["A-101", "A-204", "A-302", "B-101", "B-502", "C-104", "C-303"]
    : Object.keys(state.accounts);

  return departments
    .map(
      (department) =>
        `<option value="${department}" ${selected === department ? "selected" : ""}>${department}</option>`,
    )
    .join("");
}

function contentHeader(title, description, actions = "") {
  return `
    <div class="content-header">
      <div class="content-header__copy">
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
      ${actions ? `<div class="action-row">${actions}</div>` : ""}
    </div>
  `;
}

function packageCard(item, options = {}) {
  const { showDepartment = true, controls = true } = options;
  const canOperate = controls && (state.role === "caseta" || state.role === "admin");
  const actionButtons = [];

  actionButtons.push(
    `<button class="button button--secondary button--small" type="button" data-action="package-detail" data-id="${item.id}">Ver detalle</button>`,
  );

  if (canOperate && item.state === "RECIBIDO") {
    actionButtons.push(
      `<button class="button button--warning button--small" type="button" data-action="manual-notice" data-id="${item.id}">Aviso manual</button>`,
    );
  }

  if (canOperate && item.state === "NOTIFICADO") {
    actionButtons.push(
      `<button class="button button--soft button--small" type="button" data-action="deliver-package" data-id="${item.id}">Entregar</button>`,
    );
  }

  return `
    <article class="package-card">
      <span class="package-card__icon" aria-hidden="true">${item.company.slice(0, 1)}</span>
      <div class="package-card__main">
        <div class="package-card__title">
          <strong>${escapeHTML(item.company)} · ${escapeHTML(item.type)}</strong>
          <span class="status status--${statusClass(item.state)}">${statusLabel(item.state)}</span>
        </div>
        <div class="package-card__meta">
          ${showDepartment ? `<span>Depto. ${item.department}</span>` : ""}
          <span>${item.receivedAt}</span>
          ${item.exception ? `<span>${escapeHTML(item.exception)}</span>` : ""}
        </div>
      </div>
      <div class="package-card__actions">${actionButtons.join("")}</div>
    </article>
  `;
}

function accountMovementRow(item) {
  const isPayment = item.kind === "pago";
  return `
    <div class="data-row">
      <span class="data-row__icon ${isPayment ? "is-blue" : "is-warm"}" aria-hidden="true">${isPayment ? "↓" : "$"}</span>
      <span class="data-row__main">
        <strong>${item.title}</strong>
        <small>
          ${item.date}
          ${item.folio ? ` · Folio ${item.folio}` : ` · Vence ${item.due}`}
        </small>
      </span>
      <span class="data-row__side">
        <strong class="${isPayment ? "money-positive" : ""}">${isPayment ? "−" : ""}${formatCurrency(Math.abs(item.amount))}</strong>
        <small>${item.status}</small>
      </span>
    </div>
  `;
}

function renderResidentHome() {
  const account = state.accounts[state.selectedDepartment];
  const netBalance = Math.max(0, account.debt - account.credit);
  const packages = state.packages.filter((item) => item.department === state.selectedDepartment);
  const pending = packages.filter((item) => item.state !== "ENTREGADO");
  const latestPackage = packages[0];

  return `
    <section class="content-stack">
      ${contentHeader(
        "Tu condominio, en un vistazo",
        "Información del departamento seleccionado, actualizada con datos simulados.",
      )}

      <div class="view-grid view-grid--main">
        <article class="card card--dark hero-card">
          <div class="hero-card__top">
            <div>
              <span class="hero-card__label">Saldo por cubrir</span>
              <p class="hero-card__value">${formatCurrency(netBalance)} <small>MXN</small></p>
            </div>
            <div class="department-select">
              <label for="resident-department-home">Departamento</label>
              <select id="resident-department-home" data-department-select>
                ${departmentOptions(state.selectedDepartment)}
              </select>
            </div>
          </div>
          <div class="hero-card__foot">
            <div><span>Fecha de corte</span><strong>${account.cutoff}</strong></div>
            <div><span>Saldo a favor</span><strong>${formatCurrency(account.credit)}</strong></div>
          </div>
        </article>

        <div class="quick-actions">
          <button class="action-card" type="button" data-nav="resident-packages">
            <span class="action-card__top">
              <span class="action-card__icon" aria-hidden="true">◇</span>
              <span class="action-card__arrow" aria-hidden="true">→</span>
            </span>
            <span>
              <strong>${pending.length} ${pending.length === 1 ? "paquete pendiente" : "paquetes pendientes"}</strong>
              <small>Consulta recepción, aviso y entrega.</small>
            </span>
          </button>
          <button class="action-card" type="button" data-nav="resident-account">
            <span class="action-card__top">
              <span class="action-card__icon" aria-hidden="true">$</span>
              <span class="action-card__arrow" aria-hidden="true">→</span>
            </span>
            <span>
              <strong>Estado de cuenta</strong>
              <small>Revisa cómo se calculó tu saldo.</small>
            </span>
          </button>
        </div>
      </div>

      <div class="view-grid view-grid--2">
        <article class="card">
          <div class="card-header">
            <div class="card-header__copy">
              <h3>Actividad reciente</h3>
              <p>Cargos y pagos del departamento.</p>
            </div>
            <button class="link-button" type="button" data-nav="resident-account">Ver todo →</button>
          </div>
          <div class="data-list">
            ${account.movements.slice(0, 3).map(accountMovementRow).join("")}
          </div>
        </article>

        <article class="card">
          <div class="card-header">
            <div class="card-header__copy">
              <h3>Último paquete</h3>
              <p>Solo se muestran datos operativos mínimos.</p>
            </div>
            <button class="link-button" type="button" data-nav="resident-packages">Mis paquetes →</button>
          </div>
          ${
            latestPackage
              ? `
                <div class="detail-hero">
                  <span class="detail-hero__icon" aria-hidden="true">${latestPackage.company.slice(0, 1)}</span>
                  <span class="detail-hero__copy">
                    <strong>${latestPackage.company} · ${latestPackage.type}</strong>
                    <small>Recibido ${latestPackage.receivedAt}</small>
                  </span>
                  <span class="status status--${statusClass(latestPackage.state)}">${statusLabel(latestPackage.state)}</span>
                </div>
                <div class="callout">
                  <span class="callout__icon" aria-hidden="true">i</span>
                  <p><strong>“Aviso enviado” no significa leído.</strong> Indica que un proveedor aceptó el mensaje o que caseta registró un aviso manual.</p>
                </div>
              `
              : `
                <div class="empty-state">
                  <span class="empty-state__icon" aria-hidden="true">◇</span>
                  <h3>Sin paquetes recientes</h3>
                  <p>Cuando caseta registre uno, aparecerá aquí.</p>
                </div>
              `
          }
        </article>
      </div>
    </section>
  `;
}

function renderResidentPackages() {
  const ownPackages = state.packages.filter((item) => item.department === state.selectedDepartment);
  const filtered = ownPackages.filter((item) =>
    state.residentPackageFilter === "pending" ? item.state !== "ENTREGADO" : item.state === "ENTREGADO",
  );

  const actions = `
    <div class="segmented" role="group" aria-label="Filtrar paquetes">
      <button class="${state.residentPackageFilter === "pending" ? "is-active" : ""}" type="button" data-action="resident-package-filter" data-filter="pending">Pendientes</button>
      <button class="${state.residentPackageFilter === "delivered" ? "is-active" : ""}" type="button" data-action="resident-package-filter" data-filter="delivered">Entregados</button>
    </div>
  `;

  return `
    <section class="content-stack">
      ${contentHeader(
        "Mis paquetes",
        "Seguimiento mínimo de los paquetes vinculados a tu departamento.",
        actions,
      )}

      <div class="card card--dark" style="padding: 18px 22px;">
        <div class="hero-card__top">
          <div>
            <span class="hero-card__label">Viendo información de</span>
            <strong>${state.accounts[state.selectedDepartment].label}</strong>
          </div>
          <div class="department-select">
            <label for="resident-department-packages">Cambiar</label>
            <select id="resident-department-packages" data-department-select>
              ${departmentOptions(state.selectedDepartment)}
            </select>
          </div>
        </div>
      </div>

      <article class="card">
        ${
          filtered.length
            ? `<div class="package-list">${filtered
                .map((item) => packageCard(item, { showDepartment: false, controls: false }))
                .join("")}</div>`
            : `
              <div class="empty-state">
                <span class="empty-state__icon" aria-hidden="true">◇</span>
                <h3>No hay paquetes en esta vista</h3>
                <p>Prueba el otro filtro o cambia de departamento.</p>
              </div>
            `
        }
      </article>

      <div class="callout">
        <span class="callout__icon" aria-hidden="true">i</span>
        <p>Por privacidad no se guardan guía, remitente, contenido, fotografía, firma ni identificación de quien recoge.</p>
      </div>
    </section>
  `;
}

function renderResidentAccount() {
  const account = state.accounts[state.selectedDepartment];
  const netBalance = Math.max(0, account.debt - account.credit);
  const actions = `
    <label class="field" style="min-width: 180px;">
      <span class="visually-hidden">Departamento</span>
      <select data-department-select aria-label="Cambiar departamento">
        ${departmentOptions(state.selectedDepartment)}
      </select>
    </label>
  `;

  return `
    <section class="content-stack">
      ${contentHeader(
        "Estado de cuenta",
        "Cargos y pagos externos aplicados al departamento, sin datos bancarios.",
        actions,
      )}

      <div class="account-summary">
        <article class="account-balance">
          <span>Saldo neto por cubrir</span>
          <strong>${formatCurrency(netBalance)}</strong>
          <small>Corte: ${account.cutoff}</small>
        </article>
        <article class="account-metric">
          <span>Adeudo</span>
          <strong>${formatCurrency(account.debt)}</strong>
          <small>Cargos pendientes</small>
        </article>
        <article class="account-metric">
          <span>Saldo a favor</span>
          <strong>${formatCurrency(account.credit)}</strong>
          <small>No aplicado</small>
        </article>
      </div>

      <div class="notice-banner">
        <span class="notice-banner__icon" aria-hidden="true">!</span>
        <span class="notice-banner__copy">
          <strong>La aplicación no procesa pagos</strong>
          <small>Los pagos se realizan fuera de la app y administración registra únicamente los que ya verificó.</small>
        </span>
        <button class="button button--secondary button--small" type="button" data-action="contact-admin">Reportar discrepancia</button>
      </div>

      <article class="card">
        <div class="card-header">
          <div class="card-header__copy">
            <h3>Movimientos</h3>
            <p>El saldo se deriva de estos cargos, pagos y aplicaciones.</p>
          </div>
        </div>
        <div class="data-list">
          ${account.movements.map(accountMovementRow).join("")}
        </div>
      </article>
    </section>
  `;
}

function offlineBanner() {
  if (state.online && state.queue.length === 0) return "";

  if (!state.online) {
    return `
      <div class="notice-banner notice-banner--offline">
        <span class="notice-banner__icon" aria-hidden="true">↯</span>
        <span class="notice-banner__copy">
          <strong>Trabajando sin conexión</strong>
          <small>Los movimientos y paquetes se guardarán en una cola local simulada. Aún no se enviarán avisos.</small>
        </span>
        <button class="button button--secondary button--small" type="button" data-action="toggle-online">Simular reconexión</button>
      </div>
    `;
  }

  return `
    <div class="notice-banner notice-banner--offline">
      <span class="notice-banner__icon" aria-hidden="true">↻</span>
      <span class="notice-banner__copy">
        <strong>${state.queue.length} ${state.queue.length === 1 ? "elemento pendiente" : "elementos pendientes"} de sincronizar</strong>
        <small>La conexión volvió. Revisa y envía la cola en el orden de captura.</small>
      </span>
      <button class="button button--soft button--small" type="button" data-action="sync-queue">Sincronizar ahora</button>
    </div>
  `;
}

function renderCasetaHome() {
  const pendingPackages = state.packages.filter((item) => item.state !== "ENTREGADO");
  const exceptions = pendingPackages.filter((item) => item.exception);
  const latestMovements = state.movements.slice(0, 4);

  return `
    <section class="content-stack">
      ${offlineBanner()}
      ${contentHeader(
        "Operación de caseta",
        "Acciones rápidas para registrar sin frenar el acceso.",
      )}

      <div class="quick-actions">
        <button class="action-card" type="button" data-action="open-movement">
          <span class="action-card__top">
            <span class="action-card__icon" aria-hidden="true">↕</span>
            <span class="action-card__arrow" aria-hidden="true">→</span>
          </span>
          <span>
            <strong>Registrar entrada o salida</strong>
            <small>Selecciona un alias y confirma el movimiento.</small>
          </span>
        </button>
        <button class="action-card" type="button" data-action="open-package-intake">
          <span class="action-card__top">
            <span class="action-card__icon" aria-hidden="true">◇</span>
            <span class="action-card__arrow" aria-hidden="true">→</span>
          </span>
          <span>
            <strong>Recibir paquete</strong>
            <small>Departamento, empresa y tipo. Nada más.</small>
          </span>
        </button>
      </div>

      <div class="view-grid view-grid--3 view-grid--stats-mobile">
        <article class="card stat-card">
          <div class="stat-card__top">
            <span class="stat-card__icon" aria-hidden="true">◇</span>
            <span class="stat-card__delta">Ahora</span>
          </div>
          <div><div class="stat-card__value"><strong>${pendingPackages.length}</strong><span>paquetes</span></div><small>Pendientes en caseta</small></div>
        </article>
        <article class="card stat-card">
          <div class="stat-card__top">
            <span class="stat-card__icon" aria-hidden="true">!</span>
            <span class="stat-card__delta">Revisar</span>
          </div>
          <div><div class="stat-card__value"><strong>${exceptions.length}</strong><span>avisos</span></div><small>Excepciones activas</small></div>
        </article>
        <article class="card stat-card">
          <div class="stat-card__top">
            <span class="stat-card__icon" aria-hidden="true">↻</span>
            <span class="stat-card__delta">Cola</span>
          </div>
          <div><div class="stat-card__value"><strong>${state.queue.length}</strong><span>capturas</span></div><small>Pendientes de sincronizar</small></div>
        </article>
      </div>

      <div class="view-grid view-grid--main">
        <article class="card">
          <div class="card-header">
            <div class="card-header__copy">
              <h3>Paquetes por resolver</h3>
              <p>Primero los que tienen aviso pendiente.</p>
            </div>
            <button class="link-button" type="button" data-nav="caseta-packages">Ver todos →</button>
          </div>
          <div class="package-list">
            ${pendingPackages.slice(0, 3).map((item) => packageCard(item)).join("")}
          </div>
        </article>

        <article class="card">
          <div class="card-header">
            <div class="card-header__copy">
              <h3>Movimientos recientes</h3>
              <p>Últimas entradas y salidas.</p>
            </div>
            <button class="link-button" type="button" data-nav="caseta-access">Abrir bitácora →</button>
          </div>
          <div class="data-list">
            ${latestMovements
              .map(
                (movement) => `
                  <div class="data-row">
                    <span class="data-row__icon ${movement.type === "ENTRADA" ? "" : "is-warm"}" aria-hidden="true">${movement.type === "ENTRADA" ? "↓" : "↑"}</span>
                    <span class="data-row__main">
                      <strong>${movement.alias}</strong>
                      <small>${movement.position} · ${movement.at}</small>
                    </span>
                    <span class="data-row__side">
                      <strong>${movement.type === "ENTRADA" ? "Entrada" : "Salida"}</strong>
                      <small>${movement.sync}</small>
                    </span>
                  </div>
                `,
              )
              .join("")}
          </div>
        </article>
      </div>
    </section>
  `;
}

function rosterCard(employee) {
  return `
    <article class="roster-card" data-roster-card data-search="${escapeHTML(
      `${employee.alias} ${employee.position} ${employee.shift}`.toLowerCase(),
    )}">
      <span class="roster-card__avatar" aria-hidden="true">${employee.alias.slice(0, 1)}</span>
      <span class="roster-card__main">
        <strong>${employee.alias} · ${employee.position}</strong>
        <small>Turno ${employee.shift} · Último: ${employee.lastType.toLowerCase()} ${employee.lastAt}</small>
      </span>
      <span class="roster-card__actions">
        <button class="button button--soft button--small movement-button" type="button" data-action="movement-confirm" data-id="${employee.id}" data-movement="ENTRADA">Entrada</button>
        <button class="button button--secondary button--small movement-button" type="button" data-action="movement-confirm" data-id="${employee.id}" data-movement="SALIDA">Salida</button>
      </span>
    </article>
  `;
}

function renderCasetaAccess() {
  const actions = `
    <button class="button button--primary" type="button" data-action="open-movement">+ Nuevo movimiento</button>
  `;

  return `
    <section class="content-stack">
      ${offlineBanner()}
      ${contentHeader(
        "Entradas y salidas",
        "Roster mínimo: alias, puesto, turno y último movimiento válido.",
        actions,
      )}

      <div class="view-grid view-grid--main">
        <article class="card">
          <div class="card-header">
            <div class="card-header__copy">
              <h3>Empleados activos</h3>
              <p>Busca por alias, puesto o turno.</p>
            </div>
            <label class="search-field" for="roster-search">
              <span aria-hidden="true">⌕</span>
              <input id="roster-search" type="search" placeholder="Buscar alias o puesto" />
            </label>
          </div>
          <div class="roster-list" id="roster-list">
            ${state.roster.filter((item) => item.active).map(rosterCard).join("")}
          </div>
        </article>

        <article class="card">
          <div class="card-header">
            <div class="card-header__copy">
              <h3>Cola local</h3>
              <p>Capturas realizadas sin red.</p>
            </div>
            <span class="status status--${state.queue.length ? "offline" : "success"}">${state.queue.length ? "Pendiente" : "Al día"}</span>
          </div>
          ${
            state.queue.length
              ? `
                <div class="data-list">
                  ${state.queue
                    .map(
                      (item) => `
                        <div class="data-row">
                          <span class="data-row__icon is-blue" aria-hidden="true">↻</span>
                          <span class="data-row__main"><strong>${escapeHTML(item.label)}</strong><small>${item.createdAt} · UUID local</small></span>
                          <span class="status status--offline">En cola</span>
                        </div>
                      `,
                    )
                    .join("")}
                </div>
                ${state.online ? `<button class="button button--soft button--wide" type="button" data-action="sync-queue">Sincronizar ${state.queue.length}</button>` : ""}
              `
              : `
                <div class="empty-state">
                  <span class="empty-state__icon" aria-hidden="true">✓</span>
                  <h3>Todo sincronizado</h3>
                  <p>No hay capturas locales pendientes.</p>
                </div>
              `
          }
        </article>
      </div>

      <article class="card card--flush">
        <div style="padding: 22px 24px 10px;">
          <div class="card-header">
            <div class="card-header__copy">
              <h3>Movimientos recientes</h3>
              <p>Caseta consulta las últimas 24 horas necesarias para operar.</p>
            </div>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Empleado</th><th>Movimiento</th><th>Hora</th><th>Operador</th><th>Estado</th></tr></thead>
            <tbody>
              ${state.movements
                .map(
                  (movement) => `
                    <tr>
                      <td><span class="cell-main"><strong>${movement.alias}</strong><small>${movement.position}</small></span></td>
                      <td><strong>${movement.type === "ENTRADA" ? "Entrada" : "Salida"}</strong></td>
                      <td>${movement.at}</td>
                      <td>${movement.actor}</td>
                      <td><span class="status status--${statusClass(movement.sync)}">${movement.sync}</span></td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function renderCasetaPackages() {
  const filtered = state.packages.filter((item) =>
    state.packageFilter === "pending" ? item.state !== "ENTREGADO" : item.state === "ENTREGADO",
  );
  const actions = `
    <div class="segmented" role="group" aria-label="Filtrar paquetería">
      <button class="${state.packageFilter === "pending" ? "is-active" : ""}" type="button" data-action="package-filter" data-filter="pending">Pendientes</button>
      <button class="${state.packageFilter === "delivered" ? "is-active" : ""}" type="button" data-action="package-filter" data-filter="delivered">Entregados</button>
    </div>
    <button class="button button--primary" type="button" data-action="open-package-intake">+ Recibir paquete</button>
  `;

  return `
    <section class="content-stack">
      ${offlineBanner()}
      ${contentHeader(
        "Paquetería",
        "Ciclo controlado: recibido, aviso enviado y entregado.",
        actions,
      )}

      <article class="card">
        ${
          filtered.length
            ? `<div class="package-list">${filtered.map((item) => packageCard(item)).join("")}</div>`
            : `
              <div class="empty-state">
                <span class="empty-state__icon" aria-hidden="true">◇</span>
                <h3>Sin paquetes en esta vista</h3>
                <p>Los nuevos registros aparecerán aquí.</p>
              </div>
            `
        }
      </article>

      <div class="callout">
        <span class="callout__icon" aria-hidden="true">i</span>
        <p><strong>Verificación física fuera de la app.</strong> La entrega no pide nombre, firma, fotografía o identificación de quien recoge.</p>
      </div>
    </section>
  `;
}

function renderAdminHome() {
  const exceptions = state.packages.filter((item) => item.exception && item.state !== "ENTREGADO");
  const activeUsers = state.users.filter((item) => item.status === "Activo").length;

  return `
    <section class="content-stack">
      ${contentHeader(
        "Resumen de operación",
        "Indicadores agregados y excepciones accionables, sin rankings de personas.",
        `
          <button class="button button--secondary" type="button" data-action="open-invite">Invitar usuario</button>
          <button class="button button--primary" type="button" data-action="open-payment">Capturar pago</button>
        `,
      )}

      <div class="view-grid view-grid--4 view-grid--stats-mobile">
        <article class="card stat-card">
          <div class="stat-card__top"><span class="stat-card__icon" aria-hidden="true">◎</span><span class="stat-card__delta">76%</span></div>
          <div><div class="stat-card__value"><strong>41</strong><span>/ 54 deptos.</span></div><small>Con al menos un usuario activo</small></div>
        </article>
        <article class="card stat-card">
          <div class="stat-card__top"><span class="stat-card__icon" aria-hidden="true">◇</span><span class="stat-card__delta">Ahora</span></div>
          <div><div class="stat-card__value"><strong>${exceptions.length}</strong><span>excepciones</span></div><small>Avisos de paquete por revisar</small></div>
        </article>
        <article class="card stat-card">
          <div class="stat-card__top"><span class="stat-card__icon" aria-hidden="true">$</span><span class="stat-card__delta">100%</span></div>
          <div><div class="stat-card__value"><strong>54</strong><span>/ 54 cargos</span></div><small>Generados para julio</small></div>
        </article>
        <article class="card stat-card">
          <div class="stat-card__top"><span class="stat-card__icon" aria-hidden="true">↓</span><span class="stat-card__delta">7 días</span></div>
          <div><div class="stat-card__value"><strong>8</strong><span>pagos</span></div><small>Capturados recientemente</small></div>
        </article>
      </div>

      <div class="view-grid view-grid--main">
        <article class="card">
          <div class="card-header">
            <div class="card-header__copy">
              <h3>Atención requerida</h3>
              <p>Excepciones operativas, no actividad individual.</p>
            </div>
          </div>
          <div class="package-list">
            ${exceptions.map((item) => packageCard(item)).join("")}
          </div>
        </article>

        <article class="card">
          <div class="card-header">
            <div class="card-header__copy">
              <h3>Adopción y cobertura</h3>
              <p>Avance del piloto simulado.</p>
            </div>
          </div>
          <div class="progress-stack">
            <div class="progress-block">
              <div class="progress-block__label"><span>Departamentos activos</span><strong>41 / 54</strong></div>
              <div class="progress-track"><span style="width: 76%;"></span></div>
            </div>
            <div class="progress-block">
              <div class="progress-block__label"><span>Aviso de privacidad recibido</span><strong>${activeUsers} / ${state.users.length}</strong></div>
              <div class="progress-track"><span style="width: 75%;"></span></div>
            </div>
            <div class="progress-block">
              <div class="progress-block__label"><span>Cargos del mes</span><strong>54 / 54</strong></div>
              <div class="progress-track"><span style="width: 100%;"></span></div>
            </div>
          </div>
        </article>
      </div>

      <article class="card">
        <div class="card-header">
          <div class="card-header__copy">
            <h3>Acciones frecuentes</h3>
            <p>Los cambios sensibles exigirían reautenticación en el producto real.</p>
          </div>
        </div>
        <div class="quick-actions">
          <button class="action-card" type="button" data-action="open-invite">
            <span class="action-card__top"><span class="action-card__icon" aria-hidden="true">◎</span><span class="action-card__arrow">→</span></span>
            <span><strong>Invitar y vincular</strong><small>Correo, rol, departamento y vigencia.</small></span>
          </button>
          <button class="action-card" type="button" data-action="open-payment">
            <span class="action-card__top"><span class="action-card__icon" aria-hidden="true">$</span><span class="action-card__arrow">→</span></span>
            <span><strong>Capturar pago externo</strong><small>Vista previa antes de confirmar.</small></span>
          </button>
        </div>
      </article>
    </section>
  `;
}

function renderAdminUsers() {
  const actions = `<button class="button button--primary" type="button" data-action="open-invite">+ Invitar usuario</button>`;

  return `
    <section class="content-stack">
      ${contentHeader(
        "Usuarios y asignaciones",
        "Acceso exclusivamente por invitación y cuentas individuales.",
        actions,
      )}

      <div class="view-grid view-grid--3 view-grid--stats-mobile">
        <article class="card stat-card"><div class="stat-card__top"><span class="stat-card__icon">◎</span><span class="stat-card__delta">Demo</span></div><div><div class="stat-card__value"><strong>150</strong><span>máximo</span></div><small>Capacidad objetivo</small></div></article>
        <article class="card stat-card"><div class="stat-card__top"><span class="stat-card__icon">✓</span><span class="stat-card__delta">Vigentes</span></div><div><div class="stat-card__value"><strong>${state.users.filter((item) => item.status === "Activo").length}</strong><span>muestra</span></div><small>Usuarios activos simulados</small></div></article>
        <article class="card stat-card"><div class="stat-card__top"><span class="stat-card__icon">…</span><span class="stat-card__delta">Invitación</span></div><div><div class="stat-card__value"><strong>${state.users.filter((item) => item.status === "Pendiente").length}</strong><span>pendiente</span></div><small>Sin primer acceso</small></div></article>
      </div>

      <article class="card card--flush">
        <div style="padding: 22px 24px 10px;">
          <div class="card-header">
            <div class="card-header__copy"><h3>Directorio de acceso</h3><p>Correos enmascarados fuera de la gestión puntual.</p></div>
            <label class="search-field"><span aria-hidden="true">⌕</span><input type="search" placeholder="Buscar alias o departamento" aria-label="Buscar usuario" /></label>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Usuario</th><th>Rol</th><th>Departamento</th><th>Estado</th><th>Último acceso</th></tr></thead>
            <tbody>
              ${state.users
                .map(
                  (user) => `
                    <tr>
                      <td><span class="cell-main"><strong>${escapeHTML(user.alias)}</strong><small>${maskEmail(user.email)}</small></span></td>
                      <td>${user.role}</td>
                      <td>${user.department}</td>
                      <td><span class="status status--${statusClass(user.status)}">${user.status}</span></td>
                      <td>${user.lastAccess}</td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </article>

      <div class="callout">
        <span class="callout__icon" aria-hidden="true">i</span>
        <p>Una asignación vencida dejaría de autorizar en la siguiente solicitud. Ocultar botones nunca sustituye la autorización del servidor.</p>
      </div>
    </section>
  `;
}

function renderAdminMaintenance() {
  const actions = `
    <button class="button button--secondary" type="button" data-action="generate-charges">Generar cargos</button>
    <button class="button button--primary" type="button" data-action="open-payment">+ Capturar pago</button>
  `;

  return `
    <section class="content-stack">
      ${contentHeader(
        "Mantenimiento",
        "Cargos mensuales y pagos verificados fuera de la aplicación.",
        actions,
      )}

      <div class="view-grid view-grid--3 view-grid--stats-mobile">
        <article class="card stat-card"><div class="stat-card__top"><span class="stat-card__icon">$</span><span class="stat-card__delta">Julio</span></div><div><div class="stat-card__value"><strong>54</strong><span>/ 54</span></div><small>Cargos generados</small></div></article>
        <article class="card stat-card"><div class="stat-card__top"><span class="stat-card__icon">↓</span><span class="stat-card__delta">7 días</span></div><div><div class="stat-card__value"><strong>8</strong><span>pagos</span></div><small>Capturados recientemente</small></div></article>
        <article class="card stat-card"><div class="stat-card__top"><span class="stat-card__icon">✓</span><span class="stat-card__delta">Sin conflicto</span></div><div><div class="stat-card__value"><strong>${state.nextChargesGenerated ? "54" : "0"}</strong><span>/ 54 agosto</span></div><small>Vista del siguiente periodo</small></div></article>
      </div>

      <div class="notice-banner">
        <span class="notice-banner__icon" aria-hidden="true">!</span>
        <span class="notice-banner__copy">
          <strong>Solo captura pagos ya verificados</strong>
          <small>No existen campos para tarjeta, cuenta, CLABE, banco, comprobante o notas financieras.</small>
        </span>
        <button class="button button--secondary button--small" type="button" data-action="open-payment">Capturar pago</button>
      </div>

      <article class="card card--flush">
        <div style="padding: 22px 24px 10px;">
          <div class="card-header">
            <div class="card-header__copy"><h3>Pagos recientes</h3><p>Folios parcialmente enmascarados.</p></div>
          </div>
        </div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Departamento</th><th>Fecha efectiva</th><th>Folio interno</th><th>Monto</th><th>Capturado por</th></tr></thead>
            <tbody>
              ${state.payments
                .map(
                  (payment) => `
                    <tr>
                      <td><strong>${payment.department}</strong></td>
                      <td>${payment.date}</td>
                      <td>${payment.folio}</td>
                      <td><strong class="money-positive">${formatCurrency(payment.amount)}</strong></td>
                      <td>${payment.actor}</td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </article>

      <div class="callout">
        <span class="callout__icon" aria-hidden="true">i</span>
        <p>En el MVP real, la generación y captura serán idempotentes y transaccionales. Una corrección anulará el registro original; nunca lo borrará.</p>
      </div>
    </section>
  `;
}

function renderAdminPrivacy() {
  const checklist = [
    { done: true, title: "Minimización reflejada en formularios", detail: "Sin archivos, biometría, identificación o datos bancarios." },
    { done: true, title: "Aviso simplificado en primer acceso", detail: "Flujo incluido en esta demostración." },
    { done: true, title: "Acceso a privacidad desde la sesión", detail: "Disponible en el encabezado y perfil." },
    { done: false, title: "Identidad y domicilio del responsable", detail: "Pendiente de la administración." },
    { done: false, title: "Canal y persona responsable de ARCO", detail: "Pendiente antes del piloto real." },
    { done: false, title: "Aviso integral aprobado jurídicamente", detail: "Debe publicarse versionado antes de usar datos reales." },
  ];

  return `
    <section class="content-stack">
      ${contentHeader(
        "Privacidad y retención",
        "Estado de preparación basado en el documento de diseño.",
        `<button class="button button--secondary" type="button" data-action="show-privacy">Ver aviso demostrativo</button>`,
      )}

      <div class="notice-banner">
        <span class="notice-banner__icon" aria-hidden="true">!</span>
        <span class="notice-banner__copy">
          <strong>No usar datos reales todavía</strong>
          <small>El responsable, domicilio, canal ARCO y aviso integral siguen pendientes de validación.</small>
        </span>
      </div>

      <div class="view-grid view-grid--main">
        <article class="card">
          <div class="card-header">
            <div class="card-header__copy"><h3>Preparación para piloto</h3><p>Elementos visibles de producto y bloqueos de lanzamiento.</p></div>
            <span class="status status--warning">3 pendientes</span>
          </div>
          <div class="check-list">
            ${checklist
              .map(
                (item) => `
                  <div class="check-item">
                    <span class="check-item__mark ${item.done ? "" : "is-pending"}" aria-hidden="true">${item.done ? "✓" : "!"}</span>
                    <span class="check-item__copy"><strong>${item.title}</strong><small>${item.detail}</small></span>
                    <small>${item.done ? "Listo en demo" : "Bloqueante"}</small>
                  </div>
                `,
              )
              .join("")}
          </div>
        </article>

        <article class="card card--warm">
          <div class="card-header">
            <div class="card-header__copy"><h3>Principio de diseño</h3><p>La regla de producto para todo el alcance.</p></div>
          </div>
          <p style="margin: 0 0 20px; font-family: Georgia, serif; font-size: 1.65rem; line-height: 1.35; color: #5f4627;">
            “No recabar un dato por si acaso.”
          </p>
          <div class="progress-stack">
            <div class="progress-block"><div class="progress-block__label"><span>Datos sensibles</span><strong>0 campos</strong></div><div class="progress-track"><span style="width: 100%;"></span></div></div>
            <div class="progress-block"><div class="progress-block__label"><span>Cargas de archivos</span><strong>0 controles</strong></div><div class="progress-track"><span style="width: 100%;"></span></div></div>
            <div class="progress-block"><div class="progress-block__label"><span>Notas libres</span><strong>0 en demo</strong></div><div class="progress-track"><span style="width: 100%;"></span></div></div>
          </div>
        </article>
      </div>

      <article class="card card--flush">
        <div style="padding: 22px 24px 10px;"><div class="card-header"><div class="card-header__copy"><h3>Retención propuesta</h3><p>Plazos que aún deben aprobar administración, contabilidad y asesoría.</p></div></div></div>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Categoría</th><th>Plazo propuesto</th><th>Acción</th></tr></thead>
            <tbody>
              <tr><td>Accesos de empleados</td><td>180 días</td><td>Purgar evento y credencial local</td></tr>
              <tr><td>Paquetes entregados</td><td>90 días</td><td>Purgar paquete e historial</td></tr>
              <tr><td>Intentos de notificación</td><td>30 días</td><td>Purgar metadatos</td></tr>
              <tr><td>Cargos y pagos</td><td>5 años, por confirmar</td><td>Archivo bloqueado o purga</td></tr>
              <tr><td>Copias de respaldo</td><td>7 días / máx. 4 semanas</td><td>Rotación automática</td></tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>
  `;
}

function openModal(kicker, title, body) {
  modalKicker.textContent = kicker;
  modalTitle.textContent = title;
  modalBody.innerHTML = body;
  if (typeof modal.showModal === "function") {
    if (!modal.open) modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function closeModal() {
  if (modal.open && typeof modal.close === "function") {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }
}

function showToast(title, message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span class="toast__icon" aria-hidden="true">✓</span>
    <span class="toast__copy"><strong>${escapeHTML(title)}</strong><small>${escapeHTML(message)}</small></span>
  `;
  toastRegion.append(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

function openPackageDetail(id) {
  const item = state.packages.find((pkg) => pkg.id === id);
  if (!item) return;

  const canOperate = state.role === "caseta" || state.role === "admin";
  const controls = [];
  if (canOperate && item.state === "RECIBIDO") {
    controls.push(`<button class="button button--warning" type="button" data-action="manual-notice" data-id="${item.id}">Registrar aviso manual</button>`);
  }
  if (canOperate && item.state === "NOTIFICADO") {
    controls.push(`<button class="button button--primary" type="button" data-action="deliver-package" data-id="${item.id}">Marcar entregado</button>`);
  }

  openModal(
    "Paquetería",
    `Paquete ${item.id}`,
    `
      <div class="detail-hero">
        <span class="detail-hero__icon" aria-hidden="true">${item.company.slice(0, 1)}</span>
        <span class="detail-hero__copy">
          <strong>${escapeHTML(item.company)} · ${escapeHTML(item.type)}</strong>
          <small>Departamento ${item.department}</small>
        </span>
        <span class="status status--${statusClass(item.state)}">${statusLabel(item.state)}</span>
      </div>

      <div class="definition-grid">
        <div><span>Empresa</span><strong>${escapeHTML(item.company)}</strong></div>
        <div><span>Tipo genérico</span><strong>${escapeHTML(item.type)}</strong></div>
        <div><span>Canal de aviso</span><strong>${item.channel || "Pendiente"}</strong></div>
        <div><span>Identificador interno</span><strong>${item.id}</strong></div>
      </div>

      <div class="timeline" aria-label="Historial del paquete">
        <div class="timeline-item">
          <span class="timeline-item__copy"><strong>Recibido en caseta</strong><small>Registro operativo creado.</small></span>
          <small>${item.receivedAt}</small>
        </div>
        <div class="timeline-item ${item.notifiedAt ? "" : "is-future"}">
          <span class="timeline-item__copy"><strong>${item.notifiedAt ? "Aviso enviado" : "Aviso pendiente"}</strong><small>${item.notifiedAt ? "Aceptado por un canal; no implica lectura." : item.exception || "Aún no procesado."}</small></span>
          <small>${item.notifiedAt || "—"}</small>
        </div>
        <div class="timeline-item ${item.deliveredAt ? "" : "is-future"}">
          <span class="timeline-item__copy"><strong>${item.deliveredAt ? "Entregado" : "Entrega pendiente"}</strong><small>Sin almacenar identificación, firma o nombre de quien recoge.</small></span>
          <small>${item.deliveredAt || "—"}</small>
        </div>
      </div>

      <div class="callout">
        <span class="callout__icon" aria-hidden="true">i</span>
        <p>Esta demo omite deliberadamente guía, remitente, contenido, foto y datos de quien recoge.</p>
      </div>

      <div class="modal__actions">
        <button class="button button--secondary" type="button" data-action="close-modal">Cerrar</button>
        ${controls.join("")}
      </div>
    `,
  );
}

function openMovementDialog() {
  openModal(
    "Caseta",
    "Registrar movimiento",
    `
      <form id="movement-form" class="form-stack">
        <div class="field">
          <label for="movement-employee">Empleado activo</label>
          <select id="movement-employee" name="employeeId" required>
            ${state.roster
              .filter((item) => item.active)
              .map(
                (employee) =>
                  `<option value="${employee.id}">${employee.alias} · ${employee.position} · ${employee.shift}</option>`,
              )
              .join("")}
          </select>
          <small>Se usa un alias operativo, no nombre legal ni identificación.</small>
        </div>
        <div class="form-note">
          <span aria-hidden="true">i</span>
          <span><strong>Validación de secuencia.</strong> Si el último movimiento válido es del mismo tipo, la demo bloqueará el duplicado.</span>
        </div>
        <div class="modal__actions">
          <button class="button button--secondary" type="button" data-action="close-modal">Cancelar</button>
          <button class="button button--soft" type="submit" name="movement" value="ENTRADA">Registrar entrada</button>
          <button class="button button--primary" type="submit" name="movement" value="SALIDA">Registrar salida</button>
        </div>
      </form>
    `,
  );
}

function openMovementConfirm(employeeId, movement) {
  const employee = state.roster.find((item) => item.id === employeeId);
  if (!employee) return;

  openModal(
    "Confirmar movimiento",
    `${movement === "ENTRADA" ? "Entrada" : "Salida"} de ${employee.alias}`,
    `
      <form id="movement-confirm-form" class="form-stack">
        <input type="hidden" name="employeeId" value="${employee.id}" />
        <input type="hidden" name="movement" value="${movement}" />
        <div class="detail-hero">
          <span class="detail-hero__icon" aria-hidden="true">${employee.alias.slice(0, 1)}</span>
          <span class="detail-hero__copy"><strong>${employee.alias} · ${employee.position}</strong><small>Turno ${employee.shift} · Último: ${employee.lastType.toLowerCase()} ${employee.lastAt}</small></span>
          <span class="status status--${state.online ? "success" : "offline"}">${state.online ? "En línea" : "Se encolará"}</span>
        </div>
        <div class="callout">
          <span class="callout__icon" aria-hidden="true">i</span>
          <p>Se guardarán el alias operativo, puesto y turno históricos, actor y hora. No se guarda fotografía o identificación.</p>
        </div>
        <div class="modal__actions">
          <button class="button button--secondary" type="button" data-action="close-modal">Cancelar</button>
          <button class="button button--primary" type="submit">Confirmar ${movement === "ENTRADA" ? "entrada" : "salida"}</button>
        </div>
      </form>
    `,
  );
}

function recordMovement(employeeId, movement) {
  const employee = state.roster.find((item) => item.id === employeeId);
  if (!employee) return;

  if (employee.lastType === movement) {
    closeModal();
    showToast(
      "Movimiento bloqueado",
      `El último movimiento válido de ${employee.alias} ya es ${movement.toLowerCase()}.`,
    );
    return;
  }

  const id = `MOV-${300 + state.movements.length}`;
  const time = currentTime();
  const record = {
    id,
    employeeId,
    alias: employee.alias,
    position: employee.position,
    type: movement,
    at: `20 jul · ${time}`,
    actor: profiles[state.role].name,
    sync: state.online ? "Sincronizado" : "Pendiente de sincronizar",
  };

  state.movements.unshift(record);
  employee.lastType = movement;
  employee.lastAt = `hoy · ${time}`;

  if (!state.online) {
    state.queue.push({
      id: `Q-${Date.now()}`,
      kind: "movement",
      ref: id,
      label: `${movement === "ENTRADA" ? "Entrada" : "Salida"} · ${employee.alias}`,
      createdAt: time,
    });
  }

  closeModal();
  renderShell();
  showToast(
    state.online ? "Movimiento registrado" : "Movimiento guardado en cola",
    `${employee.alias} · ${movement.toLowerCase()} · ${time}`,
  );
}

function openPackageIntake() {
  openModal(
    "Paquetería",
    "Recibir paquete",
    `
      <form id="package-form" class="form-stack">
        <div class="form-grid">
          <div class="field">
            <label for="package-department">Departamento</label>
            <select id="package-department" name="department" required>
              ${departmentOptions("A-204", true)}
            </select>
          </div>
          <div class="field">
            <label for="package-company">Empresa</label>
            <select id="package-company" name="company" required>
              <option>DHL</option>
              <option>Amazon</option>
              <option>Estafeta</option>
              <option>FedEx</option>
              <option>Mercado Libre</option>
              <option>Otra</option>
            </select>
          </div>
          <div class="field field--full">
            <label for="package-type">Tipo genérico</label>
            <select id="package-type" name="type" required>
              <option>Caja</option>
              <option>Sobre</option>
              <option>Bolsa</option>
              <option>Otro</option>
            </select>
          </div>
        </div>
        <div class="form-note">
          <span aria-hidden="true">—</span>
          <span><strong>No captures más datos.</strong> La demo no permite guía, remitente, nombre, contenido, fotografía, firma o identificación.</span>
        </div>
        ${
          !state.online
            ? `<div class="notice-banner notice-banner--offline"><span class="notice-banner__icon">↯</span><span class="notice-banner__copy"><strong>Sin conexión</strong><small>El paquete se encolará y el aviso saldrá al sincronizar.</small></span></div>`
            : ""
        }
        <div class="modal__actions">
          <button class="button button--secondary" type="button" data-action="close-modal">Cancelar</button>
          <button class="button button--primary" type="submit">Registrar recepción</button>
        </div>
      </form>
    `,
  );
}

function createPackage(formData) {
  const numericIds = state.packages.map((item) => Number(item.id.replace(/\D/g, ""))).filter(Number.isFinite);
  const id = `P-${Math.max(...numericIds, 1048) + 1}`;
  const time = currentTime();
  const department = String(formData.get("department"));
  const digitalRecipient = department !== "B-101";
  const notifyNow = state.online && digitalRecipient;

  const item = {
    id,
    department,
    company: String(formData.get("company")),
    type: String(formData.get("type")),
    state: notifyNow ? "NOTIFICADO" : "RECIBIDO",
    receivedAt: `20 jul 2026 · ${time}`,
    notifiedAt: notifyNow ? `20 jul 2026 · ${time}` : null,
    deliveredAt: null,
    channel: notifyNow ? "Correo (simulado)" : null,
    digitalRecipient,
    exception: digitalRecipient
      ? state.online
        ? null
        : "Aún no notificado"
      : "Sin destinatario digital",
  };

  state.packages.unshift(item);

  if (!state.online) {
    state.queue.push({
      id: `Q-${Date.now()}`,
      kind: "package",
      ref: id,
      label: `Paquete ${id} · Depto. ${department}`,
      createdAt: time,
    });
  }

  closeModal();
  renderShell();
  showToast(
    state.online ? "Paquete registrado" : "Paquete guardado en cola",
    notifyNow
      ? `${id} quedó como “Aviso enviado” en esta simulación.`
      : `${id} permanece “Recibido” hasta completar el aviso.`,
  );
}

function registerManualNotice(id) {
  const item = state.packages.find((pkg) => pkg.id === id);
  if (!item || item.state !== "RECIBIDO") return;
  item.state = "NOTIFICADO";
  item.notifiedAt = `20 jul 2026 · ${currentTime()}`;
  item.channel = "Manual";
  item.exception = null;
  closeModal();
  renderShell();
  showToast("Aviso manual registrado", `${item.id} ya puede avanzar a entrega.`);
}

function openDeliveryConfirm(id) {
  const item = state.packages.find((pkg) => pkg.id === id);
  if (!item) return;
  if (item.state === "RECIBIDO") {
    showToast("Entrega bloqueada", "Primero registra un aviso digital o manual.");
    return;
  }
  if (item.state === "ENTREGADO") {
    showToast("Paquete ya entregado", "La transición ya fue registrada.");
    return;
  }

  openModal(
    "Confirmar entrega",
    `Entregar paquete ${item.id}`,
    `
      <form id="delivery-form" class="form-stack">
        <input type="hidden" name="packageId" value="${item.id}" />
        <div class="detail-hero">
          <span class="detail-hero__icon" aria-hidden="true">${item.company.slice(0, 1)}</span>
          <span class="detail-hero__copy"><strong>${item.company} · ${item.type}</strong><small>Departamento ${item.department}</small></span>
          <span class="status status--notified">Aviso enviado</span>
        </div>
        <div class="callout">
          <span class="callout__icon" aria-hidden="true">i</span>
          <p>Confirma la verificación física definida por el condominio. La app no almacenará nombre, firma, fotografía o identificación.</p>
        </div>
        <div class="modal__actions">
          <button class="button button--secondary" type="button" data-action="close-modal">Cancelar</button>
          <button class="button button--primary" type="submit">Confirmar entrega</button>
        </div>
      </form>
    `,
  );
}

function deliverPackage(id) {
  const item = state.packages.find((pkg) => pkg.id === id);
  if (!item || item.state !== "NOTIFICADO") return;
  item.state = "ENTREGADO";
  item.deliveredAt = `20 jul 2026 · ${currentTime()}`;
  item.exception = null;
  closeModal();
  renderShell();
  showToast("Entrega registrada", `${item.id} salió de la lista de pendientes.`);
}

function syncQueue() {
  if (!state.online) {
    showToast("Sin conexión", "Reconecta la demo antes de sincronizar.");
    return;
  }
  if (!state.queue.length) {
    showToast("Cola al día", "No hay elementos pendientes.");
    return;
  }

  const total = state.queue.length;
  state.queue.forEach((item) => {
    if (item.kind === "movement") {
      const movement = state.movements.find((record) => record.id === item.ref);
      if (movement) movement.sync = "Sincronizado";
    }
    if (item.kind === "package") {
      const pkg = state.packages.find((record) => record.id === item.ref);
      if (pkg && pkg.digitalRecipient) {
        pkg.state = "NOTIFICADO";
        pkg.notifiedAt = `20 jul 2026 · ${currentTime()}`;
        pkg.channel = "Correo (simulado)";
        pkg.exception = null;
      }
    }
  });
  state.queue = [];
  renderShell();
  showToast("Sincronización completa", `${total} ${total === 1 ? "elemento aceptado" : "elementos aceptados"} en la simulación.`);
}

function openPaymentDialog() {
  openModal(
    "Mantenimiento",
    "Capturar pago externo",
    `
      <form id="payment-form" class="form-stack">
        <div class="form-grid">
          <div class="field">
            <label for="payment-department">Departamento</label>
            <select id="payment-department" name="department" required>
              ${departmentOptions("A-204", true)}
            </select>
          </div>
          <div class="field">
            <label for="payment-amount">Monto verificado</label>
            <input id="payment-amount" name="amount" type="number" min="0.01" step="0.01" value="1850" required />
          </div>
          <div class="field">
            <label for="payment-date">Fecha efectiva</label>
            <input id="payment-date" name="date" type="date" value="2026-07-20" required />
          </div>
          <div class="field">
            <label for="payment-folio">Folio interno</label>
            <input id="payment-folio" name="folio" type="text" value="INT-260720-09" maxlength="32" required />
          </div>
        </div>
        <div class="form-note">
          <span aria-hidden="true">—</span>
          <span><strong>Pago ocurrido fuera de la app.</strong> No se solicita banco, tarjeta, cuenta, CLABE, comprobante o nota libre.</span>
        </div>
        <div class="modal__actions">
          <button class="button button--secondary" type="button" data-action="close-modal">Cancelar</button>
          <button class="button button--primary" type="submit">Revisar aplicación →</button>
        </div>
      </form>
    `,
  );
}

function openPaymentPreview(formData) {
  const department = String(formData.get("department"));
  const amount = Number(formData.get("amount"));
  const date = String(formData.get("date"));
  const folio = String(formData.get("folio")).trim();
  const knownAccount = state.accounts[department];
  const pendingDebt = knownAccount ? knownAccount.debt : 1850;
  const applied = Math.min(amount, pendingDebt);
  const credit = Math.max(0, amount - pendingDebt);

  openModal(
    "Vista previa",
    "Revisa antes de confirmar",
    `
      <form id="payment-confirm-form" class="form-stack">
        <input type="hidden" name="department" value="${escapeHTML(department)}" />
        <input type="hidden" name="amount" value="${amount}" />
        <input type="hidden" name="date" value="${escapeHTML(date)}" />
        <input type="hidden" name="folio" value="${escapeHTML(folio)}" />
        <div class="big-confirm">
          <span>Pago externo verificado</span>
          <strong>${formatCurrency(amount)}</strong>
          <span>Departamento ${department}</span>
        </div>
        <div class="preview-box">
          <h3 class="preview-box__title">Aplicación propuesta</h3>
          <div class="preview-line"><span>Cargo más antiguo pendiente</span><strong>${formatCurrency(pendingDebt)}</strong></div>
          <div class="preview-line"><span>Se aplicará al cargo</span><strong class="money-positive">${formatCurrency(applied)}</strong></div>
          <div class="preview-line"><span>Saldo a favor resultante</span><strong>${formatCurrency(credit)}</strong></div>
          <div class="preview-line"><span>Folio interno</span><strong>${escapeHTML(folio)}</strong></div>
        </div>
        <div class="callout">
          <span class="callout__icon" aria-hidden="true">i</span>
          <p>En el MVP real, pago y aplicaciones se crearán en una sola transacción y el folio no podrá reutilizarse.</p>
        </div>
        <div class="modal__actions">
          <button class="button button--secondary" type="button" data-action="open-payment">Editar</button>
          <button class="button button--primary" type="submit">Confirmar captura</button>
        </div>
      </form>
    `,
  );
}

function confirmPayment(formData) {
  const department = String(formData.get("department"));
  const amount = Number(formData.get("amount"));
  const folio = String(formData.get("folio"));
  const date = String(formData.get("date"));
  const maskedFolio = `•••-${folio.slice(-7)}`;

  state.payments.unshift({
    id: `PAG-${90 + state.payments.length}`,
    department,
    amount,
    date: "20 jul 2026",
    folio: maskedFolio,
    actor: profiles.admin.name,
  });

  const account = state.accounts[department];
  if (account) {
    const applied = Math.min(amount, account.debt);
    account.debt -= applied;
    account.credit += Math.max(0, amount - applied);
    account.movements.unshift({
      id: `PAG-DEMO-${Date.now()}`,
      kind: "pago",
      title: "Pago externo",
      date: date === "2026-07-20" ? "20 jul 2026" : date,
      folio: maskedFolio,
      amount: -amount,
      applied,
      pending: 0,
      status: "Aplicado",
    });
  }

  closeModal();
  renderShell();
  showToast("Pago capturado", `${formatCurrency(amount)} aplicado a ${department}.`);
}

function openInviteDialog() {
  openModal(
    "Usuarios",
    "Invitar y vincular",
    `
      <form id="invite-form" class="form-stack">
        <div class="form-grid">
          <div class="field field--full">
            <label for="invite-email">Correo autorizado</label>
            <input id="invite-email" name="email" type="email" placeholder="persona@ejemplo.mx" required />
            <small>El correo se mostrará parcialmente enmascarado después de confirmar.</small>
          </div>
          <div class="field">
            <label for="invite-role">Rol</label>
            <select id="invite-role" name="role" required>
              <option value="Residente">Residente</option>
              <option value="Caseta">Caseta</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
          <div class="field">
            <label for="invite-department">Departamento</label>
            <select id="invite-department" name="department" required>
              ${departmentOptions("A-101", true)}
            </select>
          </div>
        </div>
        <div class="form-note">
          <span aria-hidden="true">i</span>
          <span>En producción, el registro público estará deshabilitado y la acción quedará auditada. Los cambios de rol exigirán reautenticación reciente.</span>
        </div>
        <div class="modal__actions">
          <button class="button button--secondary" type="button" data-action="close-modal">Cancelar</button>
          <button class="button button--primary" type="submit">Enviar invitación simulada</button>
        </div>
      </form>
    `,
  );
}

function createInvitation(formData) {
  const email = String(formData.get("email")).trim().toLowerCase();
  const role = String(formData.get("role"));
  const department = role === "Residente" ? String(formData.get("department")) : "—";

  state.users.push({
    id: `USR-${String(state.users.length + 1).padStart(2, "0")}`,
    alias: "Invitación pendiente",
    email,
    role,
    department,
    status: "Pendiente",
    lastAccess: "Invitado · ahora",
  });

  closeModal();
  renderShell();
  showToast("Invitación preparada", `Se simuló el envío a ${maskEmail(email)}.`);
}

function openGenerateCharges() {
  openModal(
    "Mantenimiento",
    "Generar cargos de agosto",
    `
      <form id="charges-form" class="form-stack">
        <div class="big-confirm">
          <span>Vista previa</span>
          <strong>54</strong>
          <span>cargos de mantenimiento</span>
        </div>
        <div class="preview-box">
          <div class="preview-line"><span>Periodo</span><strong>Agosto 2026</strong></div>
          <div class="preview-line"><span>Fecha de generación</span><strong>01 ago 2026</strong></div>
          <div class="preview-line"><span>Vencimiento</span><strong>10 ago 2026</strong></div>
          <div class="preview-line"><span>Conflictos detectados</span><strong class="money-positive">0</strong></div>
        </div>
        <div class="callout">
          <span class="callout__icon" aria-hidden="true">i</span>
          <p>Un reintento no duplicaría cargos del mismo departamento, concepto y periodo.</p>
        </div>
        <div class="modal__actions">
          <button class="button button--secondary" type="button" data-action="close-modal">Cancelar</button>
          <button class="button button--primary" type="submit">Confirmar generación simulada</button>
        </div>
      </form>
    `,
  );
}

function showPrivacyModal() {
  openModal(
    "Aviso demostrativo",
    "Privacidad y derechos ARCO",
    `
      <div class="notice-banner">
        <span class="notice-banner__icon" aria-hidden="true">!</span>
        <span class="notice-banner__copy">
          <strong>Contenido pendiente de validación jurídica</strong>
          <small>Esta pantalla orienta la experiencia; no sustituye el aviso integral requerido antes del piloto.</small>
        </span>
      </div>
      <div class="definition-grid">
        <div><span>Datos mínimos</span><strong>Correo, alias, rol y departamento</strong></div>
        <div><span>Operación</span><strong>Paquetes, accesos y mantenimiento</strong></div>
        <div><span>No se recaba</span><strong>Biometría, identificación o datos bancarios</strong></div>
        <div><span>Versión</span><strong>Demo · 20 jul 2026</strong></div>
      </div>
      <div class="form-stack">
        <div class="callout"><span class="callout__icon">1</span><p><strong>Responsable y domicilio:</strong> pendientes de definición por la administración.</p></div>
        <div class="callout"><span class="callout__icon">2</span><p><strong>Canal ARCO:</strong> debe publicarse con requisitos y plazos antes de usar datos reales.</p></div>
        <div class="callout"><span class="callout__icon">3</span><p><strong>Retención:</strong> los plazos propuestos necesitan aprobación jurídica y contable.</p></div>
      </div>
      <div class="modal__actions">
        <button class="button button--secondary" type="button" data-action="close-modal">Cerrar</button>
      </div>
    `,
  );
}

function openProfileModal() {
  const profile = profiles[state.role];
  openModal(
    "Perfil y sesión",
    profile.name,
    `
      <div class="detail-hero">
        <span class="detail-hero__icon" aria-hidden="true">${profile.initials}</span>
        <span class="detail-hero__copy"><strong>${profile.label}</strong><small>${maskEmail(profile.email)}</small></span>
        <span class="status status--active">Demo</span>
      </div>
      <div class="form-stack">
        <div class="field">
          <span>Cambiar perfil de demostración</span>
          <div class="segmented">
            <button class="${state.role === "resident" ? "is-active" : ""}" type="button" data-action="role-jump" data-role="resident">Residente</button>
            <button class="${state.role === "caseta" ? "is-active" : ""}" type="button" data-action="role-jump" data-role="caseta">Caseta</button>
            <button class="${state.role === "admin" ? "is-active" : ""}" type="button" data-action="role-jump" data-role="admin">Admin.</button>
          </div>
        </div>
        <button class="button button--secondary" type="button" data-action="show-privacy">Ver privacidad y derechos ARCO</button>
        <button class="button button--secondary" type="button" data-action="reset-demo">Reiniciar datos ficticios</button>
      </div>
      <div class="modal__actions">
        <button class="button button--text" type="button" data-action="logout">Salir de la demo</button>
        <button class="button button--primary" type="button" data-action="close-modal">Listo</button>
      </div>
    `,
  );
}

function handleFormSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;

  const handledForms = [
    "movement-form",
    "movement-confirm-form",
    "package-form",
    "delivery-form",
    "payment-form",
    "payment-confirm-form",
    "invite-form",
    "charges-form",
  ];
  if (!handledForms.includes(form.id)) return;

  event.preventDefault();
  const formData = new FormData(form);

  if (form.id === "movement-form") {
    const movement = event.submitter?.value || "ENTRADA";
    recordMovement(String(formData.get("employeeId")), movement);
  }
  if (form.id === "movement-confirm-form") {
    recordMovement(String(formData.get("employeeId")), String(formData.get("movement")));
  }
  if (form.id === "package-form") createPackage(formData);
  if (form.id === "delivery-form") deliverPackage(String(formData.get("packageId")));
  if (form.id === "payment-form") openPaymentPreview(formData);
  if (form.id === "payment-confirm-form") confirmPayment(formData);
  if (form.id === "invite-form") createInvitation(formData);
  if (form.id === "charges-form") {
    state.nextChargesGenerated = true;
    closeModal();
    renderShell();
    showToast("Cargos generados", "La demo marcó 54 cargos de agosto sin conflictos.");
  }
}

function handleAction(event) {
  const navButton = event.target.closest("[data-nav]");
  if (navButton) {
    event.preventDefault();
    setView(navButton.dataset.nav);
    return;
  }

  const trigger = event.target.closest("[data-action]");
  if (!trigger) return;
  event.preventDefault();

  const action = trigger.dataset.action;
  const id = trigger.dataset.id;

  if (action === "close-modal") closeModal();
  if (action === "home") setView(navigation[state.role][0].id);
  if (action === "profile") openProfileModal();
  if (action === "show-privacy") showPrivacyModal();
  if (action === "reset-demo") resetDemo();
  if (action === "logout") logout();
  if (action === "role-jump") {
    closeModal();
    switchRole(trigger.dataset.role);
  }
  if (action === "toggle-online") {
    state.online = !state.online;
    renderShell();
    showToast(
      state.online ? "Conexión restaurada" : "Modo sin conexión",
      state.online
        ? state.queue.length
          ? "La cola está lista para sincronizar."
          : "No hay capturas pendientes."
        : "Las nuevas capturas se guardarán en la cola simulada.",
    );
  }
  if (action === "sync-queue") syncQueue();
  if (action === "open-movement") openMovementDialog();
  if (action === "movement-confirm") openMovementConfirm(id, trigger.dataset.movement);
  if (action === "open-package-intake") openPackageIntake();
  if (action === "package-detail") openPackageDetail(id);
  if (action === "manual-notice") registerManualNotice(id);
  if (action === "deliver-package") openDeliveryConfirm(id);
  if (action === "package-filter") {
    state.packageFilter = trigger.dataset.filter;
    renderShell();
  }
  if (action === "resident-package-filter") {
    state.residentPackageFilter = trigger.dataset.filter;
    renderShell();
  }
  if (action === "open-payment") openPaymentDialog();
  if (action === "open-invite") openInviteDialog();
  if (action === "generate-charges") openGenerateCharges();
  if (action === "contact-admin") {
    showToast("Canal de soporte pendiente", "La administración debe definir el medio real antes del piloto.");
  }
}

function handleChange(event) {
  if (event.target.matches("[data-department-select]")) {
    state.selectedDepartment = event.target.value;
    renderShell();
  }
  if (event.target.matches("#role-switch")) {
    switchRole(event.target.value);
  }
}

function handleInput(event) {
  if (event.target.matches("#roster-search")) {
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll("[data-roster-card]").forEach((card) => {
      card.hidden = !card.dataset.search.includes(query);
    });
  }
}

function selectAuthRole(role) {
  selectedRole = role;
  document.querySelectorAll("[data-demo-role]").forEach((button) => {
    const active = button.dataset.demoRole === role;
    button.classList.toggle("is-selected", active);
    button.setAttribute("aria-pressed", String(active));
  });
  loginEmail.value = profiles[role].email;
}

function showAuthStep(step) {
  loginStep.hidden = step !== "login";
  linkStep.hidden = step !== "link";
  privacyStep.hidden = step !== "privacy";
}

function launchDemo() {
  state.role = selectedRole;
  state.view = navigation[selectedRole][0].id;
  authScreen.hidden = true;
  demoShell.hidden = false;
  renderShell();
  window.scrollTo(0, 0);
  mainContent.focus();
}

function logout() {
  closeModal();
  demoShell.hidden = true;
  authScreen.hidden = false;
  showAuthStep("login");
  privacyAck.checked = false;
  enterAppButton.disabled = true;
  window.scrollTo(0, 0);
}

document.querySelector("#login-form").addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelector("#sent-email").textContent = maskEmail(loginEmail.value);
  showAuthStep("link");
});

document.querySelectorAll("[data-demo-role]").forEach((button) => {
  button.addEventListener("click", () => selectAuthRole(button.dataset.demoRole));
});

document.querySelector("#open-demo-link").addEventListener("click", () => showAuthStep("privacy"));
document.querySelector("#back-to-login").addEventListener("click", () => showAuthStep("login"));
document.querySelector("#exit-privacy").addEventListener("click", () => showAuthStep("login"));
privacyAck.addEventListener("change", () => {
  enterAppButton.disabled = !privacyAck.checked;
});
enterAppButton.addEventListener("click", launchDemo);

document.addEventListener("click", handleAction);
document.addEventListener("change", handleChange);
document.addEventListener("input", handleInput);
document.addEventListener("submit", handleFormSubmit);

modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

selectAuthRole("resident");
