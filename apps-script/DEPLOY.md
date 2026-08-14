# Pipeline ACM · Puesta en marcha online (Google)

Esta versión convierte la app en un sistema **online, multiusuario y multi-dispositivo**:

- Cada vendedor entra con **su cuenta de Google del dominio `juarezbeltran.com.ar`**.
- Cada vendedor ve y edita **solo sus propiedades**.
- **Admins que ven y editan TODO:** `tjuarez_h@juarezbeltran.com.ar` y `mjuarez@juarezbeltran.com.ar`.
- Todo se guarda en **una planilla de Google Sheets en el Drive de `mjuarez`** (la cuenta que publica).
- **Respaldo automático diario** a una carpeta de ese mismo Drive.
- Los archivos que suban los vendedores (planilla de tasación, etc.) también quedan en ese Drive.
- Funciona en **celular** (navegador o "Agregar a pantalla de inicio").

No hace falta servidor ni pagar hosting: usa **Google Apps Script** (gratis).

> **Importante:** hacé todos los pasos **logueado como `mjuarez@juarezbeltran.com.ar`**, para que la
> planilla, los respaldos y los archivos queden dentro de ese Drive.

---

## Archivos de esta carpeta

| Archivo            | Qué es                                             |
|--------------------|----------------------------------------------------|
| `Code.gs`          | Backend: login, permisos y lectura/escritura Sheet |
| `Index.html`       | La app (mismo diseño, conectada al backend)        |
| `appsscript.json`  | Configuración (permisos y acceso por dominio)      |

---

## Paso 1 · Crear la planilla en tu Drive

1. Entrá a <https://sheets.google.com> con tu cuenta `mjuarez@juarezbeltran.com.ar`.
2. Creá una planilla nueva y ponele de nombre, por ejemplo, **Pipeline ACM · Base**.
3. Mirá la URL. El **ID** es la parte del medio:
   `https://docs.google.com/spreadsheets/d/`**`ESTE_ES_EL_ID`**`/edit`
4. Copiá ese ID. No hace falta crear columnas: la app arma la hoja `Leads` sola.

---

## Paso 2 · Crear el proyecto de Apps Script

1. Entrá a <https://script.google.com> con la misma cuenta.
2. **Nuevo proyecto**.
3. Borrá el contenido del archivo `Código.gs` que viene por defecto y pegá **todo** el contenido de `Code.gs` de esta carpeta.
4. En la parte de arriba del código, cambiá:
   - `const SHEET_ID = 'PEGAR_AQUI_EL_ID_DE_LA_PLANILLA';` → pegá el ID del Paso 1.
   - `const APP_OWNER = 'mjuarez@juarezbeltran.com.ar';` → verificá que sea tu email (ya está puesto).
5. Creá el archivo HTML:
   - Botón **+** al lado de "Archivos" → **HTML** → nombralo exactamente **`Index`** (sin `.html`).
   - Borrá lo que trae y pegá **todo** el contenido de `Index.html` de esta carpeta.
6. Mostrá el manifiesto y pegá la config:
   - Rueda de **Configuración del proyecto** (⚙️) → tildá **"Mostrar el archivo de manifiesto appsscript.json"**.
   - Volvé al editor, abrí `appsscript.json` y reemplazá su contenido por el de esta carpeta.
7. Guardá todo (Ctrl+S).

---

## Paso 3 · Publicar como aplicación web

1. Arriba a la derecha: **Implementar → Nueva implementación**.
2. En el engranaje elegí el tipo **Aplicación web**.
3. Configurá:
   - **Descripción:** `Pipeline ACM`
   - **Ejecutar como:** *Yo* (`mjuarez@juarezbeltran.com.ar`).
   - **Quién tiene acceso:** *Cualquier usuario de Juarez Beltrán* (tu dominio).
4. **Implementar**. La primera vez te va a pedir **autorizar permisos**: aceptá con tu cuenta
   (permite leer tu email y trabajar con tu Drive: planilla, respaldos y archivos subidos).
5. Te da una **URL** que termina en `/exec`. **Esa es la app.** Compartila con tus vendedores.

> Cada vez que cambies el código, entrá a **Implementar → Gestionar implementaciones → (lápiz) → Versión: Nueva → Implementar** para publicar la actualización en la misma URL.

---

## Paso 3.5 · Activar el respaldo automático diario

1. En el editor de Apps Script, arriba, elegí en el desplegable de funciones **`installDailyBackup`**.
2. Tocá **Ejecutar** (▶). Autorizá si lo pide.
3. Listo: queda programado un respaldo diario (~03:00) en la carpeta **`Pipeline ACM · Respaldos`**
   de tu Drive (copia de la planilla + un JSON; conserva los últimos 30 días).

> Para probarlo en el momento, ejecutá la función **`dailyBackup`** una vez y revisá la carpeta.

---

## Paso 4 · Probar

1. Abrí la URL `/exec` vos mismo. Deberías ver arriba tu email y el rol **"Dueño · ve todo"**.
2. Creá una propiedad de prueba. Fijate que aparezca una fila nueva en la planilla del Drive.
3. Pedile a un vendedor que la abra con su cuenta del dominio: verá el rol **"Vendedor"** y solo sus propias propiedades.

---

## En el celular

- Abrí la URL en Chrome (Android) o Safari (iPhone).
- Menú del navegador → **"Agregar a pantalla de inicio"**.
- Queda un ícono como si fuera una app nativa. Los datos son los mismos (están en la nube).

---

## Preguntas frecuentes

**¿Los vendedores pueden ver los leads de otros?**
No. El servidor filtra por el email de cada uno. Solo tu cuenta (`APP_OWNER`) ve todo.

**¿Dónde están mis datos?**
En la planilla de Google Sheets de tu Drive. Podés abrirla y verla/filtrarla cuando quieras.
Cada fila es una propiedad; la columna `data` guarda el detalle completo en formato JSON.
Además hay un **respaldo diario** en `Pipeline ACM · Respaldos`.

**¿Dónde quedan los archivos que suben los vendedores (planilla de tasación)?**
En la carpeta **`Pipeline ACM · Archivos`** de tu Drive. En la app queda el botón **Abrir** para verlos.

**¿Se pierden los datos que ya tenía cargados en el HTML viejo?**
La app nueva ya no tiene importar/exportar en pantalla (lo sacamos). Si tenías datos cargados en la
versión vieja y los querés pasar, avisame: se migran una sola vez cargándolos directo en la planilla.

**¿Cuánto cuesta?**
$0 dentro de los límites gratuitos de Google Apps Script, más que suficientes para una inmobiliaria.

**¿Y si más adelante somos muchos y queda lento?**
Se puede migrar el backend a Supabase o Firebase manteniendo la misma pantalla. Por ahora no hace falta.

---

## Nota sobre el archivo viejo

`pipeline_acm_juarez_beltran.html` (en la carpeta de arriba) sigue **intacto** como respaldo y para
migrar los datos existentes. No se borró nada.
