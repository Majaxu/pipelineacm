/**
 * Pipeline ACM · Juarez Beltrán
 * Backend en Google Apps Script + Google Sheets.
 *
 * Modelo: "cada uno lo suyo".
 *  - Cada vendedor ve y edita SOLO sus propiedades.
 *  - El APP_OWNER ve y puede editar TODAS.
 *  - La seguridad se decide en el servidor con el email real de Google
 *    (Session.getActiveUser()), nunca confiando en el navegador.
 *
 * Configurar antes de usar:
 *  1) SHEET_ID  -> ID de la planilla de Google Sheets (ver DEPLOY.md).
 *  2) APP_OWNER -> tu email de Workspace (ve todo).
 */

const SHEET_ID   = '117byqE5c8phnaTKHopOVEaSH7-bF-1Y_RYuWfM3-TB0';
const SHEET_NAME = 'Leads';

/** Cuentas que ven y editan TODO (dueño + acceso total). */
const APP_ADMINS = [
  'tjuarez_h@juarezbeltran.com.ar',
  'mjuarez@juarezbeltran.com.ar'
];

/** Carpetas en TU Drive (se crean solas). */
const BACKUP_FOLDER = 'Pipeline ACM · Respaldos';
const FILES_FOLDER  = 'Pipeline ACM · Archivos';
const BACKUP_KEEP    = 30; // cuántos respaldos conservar

const HEADERS = [
  'id', 'ownerEmail', 'address', 'owner', 'phone', 'rentas',
  'status', 'progress', 'createdAt', 'updatedAt', 'data'
];

/* ------------------------------------------------------------------ */
/* Servir la app                                                       */
/* ------------------------------------------------------------------ */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Pipeline ACM · Juarez Beltrán')
    .setFaviconUrl('https://majaxu.github.io/pipelineacm/favicon-32.png')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/* ------------------------------------------------------------------ */
/* Identidad y permisos                                                */
/* ------------------------------------------------------------------ */
function currentEmail_() {
  const e = Session.getActiveUser().getEmail();
  if (!e) throw new Error('No se pudo identificar tu cuenta de Google. Iniciá sesión con tu cuenta del dominio.');
  return e.toLowerCase();
}
function isAdmin_(email) {
  return APP_ADMINS.map(x => String(x).toLowerCase()).indexOf(email) !== -1;
}

/* ------------------------------------------------------------------ */
/* Acceso a la planilla                                                */
/* ------------------------------------------------------------------ */
function sheet_() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function readAll_() {
  const sh = sheet_();
  const last = sh.getLastRow();
  if (last < 2) return [];
  const values = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  return values.map((cells, idx) => ({ row: idx + 2, cells: cells }));
}

function rowToItem_(cells) {
  try { return JSON.parse(cells[HEADERS.indexOf('data')] || '{}'); }
  catch (e) { return {}; }
}

/* ------------------------------------------------------------------ */
/* API que consume el frontend (via google.script.run)                 */
/* ------------------------------------------------------------------ */

/** Datos iniciales: quién soy y mis propiedades (o todas si soy dueño). */
function getBootstrap() {
  const email = currentEmail_();
  const owner = isAdmin_(email);
  const items = readAll_()
    .filter(r => owner || String(r.cells[1]).toLowerCase() === email)
    .map(r => {
      const it = rowToItem_(r.cells);
      it._ownerEmail = String(r.cells[1]).toLowerCase();
      return it;
    });
  return { email: email, isOwner: owner, items: items };
}

/** Crea o actualiza un lead. Devuelve campos autorizados por el servidor. */
function saveLead(item) {
  const email = currentEmail_();
  if (!item || !item.id) throw new Error('Lead inválido.');

  const sh = sheet_();
  const existing = readAll_().find(r => String(r.cells[0]) === String(item.id));
  const rowOwner = existing ? String(existing.cells[1]).toLowerCase() : email;

  if (existing && rowOwner !== email && !isAdmin_(email)) {
    throw new Error('No tenés permiso para editar este lead.');
  }

  const finalOwner = existing ? rowOwner : email;
  item._ownerEmail = finalOwner;

  const now = new Date().toISOString();
  const rowData = [
    item.id,
    finalOwner,
    item.address || '',
    item.owner || '',
    item.phone || '',
    (item.pre && item.pre.rentas) || '',
    statusOf_(item),
    progressOf_(item),
    item.createdAt || now,
    now,
    JSON.stringify(item)
  ];

  if (existing) sh.getRange(existing.row, 1, 1, HEADERS.length).setValues([rowData]);
  else sh.appendRow(rowData);

  return { ok: true, id: item.id, ownerEmail: finalOwner, updatedAt: now };
}

/** Elimina un lead (solo el dueño del lead o el APP_OWNER). */
function deleteLead(id) {
  const email = currentEmail_();
  const sh = sheet_();
  const existing = readAll_().find(r => String(r.cells[0]) === String(id));
  if (!existing) return { ok: true, id: id };

  const rowOwner = String(existing.cells[1]).toLowerCase();
  if (rowOwner !== email && !isAdmin_(email)) {
    throw new Error('No tenés permiso para eliminar este lead.');
  }
  sh.deleteRow(existing.row);
  return { ok: true, id: id };
}

/* ------------------------------------------------------------------ */
/* Lógica de progreso (espejo de la del frontend, para las columnas    */
/* legibles de la planilla)                                            */
/* ------------------------------------------------------------------ */
function effectiveDone_(item, key) {
  if (key === 'pre')      return !!(item.pre && item.pre.done && String(item.pre.rentas || '').trim());
  if (key === 'research') return !!(item.research && item.research.done && item.research.identity && item.research.reportRequested && item.research.status);
  if (key === 'docs')     return !!(item.docs && item.docs.done && item.docs.escritura);
  if (key === 'reports')  return !!(item.reports && item.reports.done && item.reports.r1 && item.reports.r2 && item.reports.r3);
  return !!(item[key] && item[key].done);
}
function progressOf_(item) {
  const keys = ['pre', 'research', 'visit', 'acm', 'docs', 'media', 'reports', 'market'];
  const done = keys.filter(k => effectiveDone_(item, k)).length;
  return Math.round(done / keys.length * 100);
}
function statusOf_(item) {
  if (item.cancelled) return 'cancelado';
  return progressOf_(item) === 100 ? 'completo' : 'activo';
}

/* ------------------------------------------------------------------ */
/* Carpetas en Drive                                                   */
/* ------------------------------------------------------------------ */
function folderNextTo_(name) {
  // Crea (o reutiliza) la carpeta al lado de la planilla, dentro de TU Drive.
  const parents = DriveApp.getFileById(SHEET_ID).getParents();
  const parent = parents.hasNext() ? parents.next() : DriveApp.getRootFolder();
  const found = parent.getFoldersByName(name);
  return found.hasNext() ? found.next() : parent.createFolder(name);
}

/* ------------------------------------------------------------------ */
/* Respaldo automático                                                 */
/* ------------------------------------------------------------------ */

/** Ejecutar UNA vez para programar el respaldo diario (crea el disparador). */
function installDailyBackup() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'dailyBackup')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('dailyBackup').timeBased().everyDays(1).atHour(3).create();
  return 'Respaldo diario programado (~03:00). Carpeta: ' + BACKUP_FOLDER;
}

/** Genera un respaldo: copia de la planilla + export JSON. Conserva los últimos BACKUP_KEEP. */
function dailyBackup() {
  const folder = folderNextTo_(BACKUP_FOLDER);
  const stamp = Utilities.formatDate(new Date(), 'America/Argentina/Cordoba', 'yyyy-MM-dd_HH-mm');

  DriveApp.getFileById(SHEET_ID).makeCopy('Pipeline ACM · Base ' + stamp, folder);

  const items = readAll_().map(r => rowToItem_(r.cells));
  folder.createFile(
    'pipeline-acm-' + stamp + '.json',
    JSON.stringify({ exportedAt: new Date().toISOString(), items: items }, null, 2),
    'application/json'
  );

  pruneBackups_(folder, BACKUP_KEEP);
  return 'Respaldo generado: ' + stamp;
}

function pruneBackups_(folder, keep) {
  const files = [];
  const it = folder.getFiles();
  while (it.hasNext()) files.push(it.next());
  files.sort((a, b) => b.getDateCreated() - a.getDateCreated());
  files.slice(keep * 2).forEach(f => f.setTrashed(true)); // *2: por copia + json de cada día
}

/* ------------------------------------------------------------------ */
/* Subida de archivos (planilla de tasación, etc.)                     */
/* ------------------------------------------------------------------ */

/**
 * Sube un archivo a la carpeta "Pipeline ACM · Archivos" de tu Drive.
 * @param {string} leadId   id del lead (para permisos y nombre)
 * @param {string} base64   contenido del archivo en base64
 * @param {string} filename nombre original
 * @param {string} mime     tipo MIME
 * @return {{url:string,name:string}}
 */
function uploadFile(leadId, base64, filename, mime) {
  const email = currentEmail_();
  const existing = readAll_().find(r => String(r.cells[0]) === String(leadId));
  if (existing) {
    const rowOwner = String(existing.cells[1]).toLowerCase();
    if (rowOwner !== email && !isAdmin_(email)) {
      throw new Error('No tenés permiso para subir archivos a este lead.');
    }
  }
  if (!base64) throw new Error('Archivo vacío.');

  const folder = folderNextTo_(FILES_FOLDER);
  const blob = Utilities.newBlob(Utilities.base64Decode(base64), mime || 'application/octet-stream', filename || ('archivo-' + leadId));
  const file = folder.createFile(blob);
  file.setDescription('Lead ' + leadId + ' · subido por ' + email);
  return { url: file.getUrl(), name: file.getName() };
}
