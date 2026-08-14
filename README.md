# Pipeline ACM · Juarez Beltrán Asesores Inmobiliarios

Aplicación web para el seguimiento de la **captación de propiedades mediante ACM**.
Cada propiedad avanza por 8 hitos y se pinta de gris a verde a medida que se cumplen.

Es **online y multiusuario**: corre sobre **Google Apps Script + Google Sheets**, cada
vendedor entra con su cuenta de Google del dominio y ve solo sus propiedades; los
administradores ven todo. Los datos y archivos quedan en Google Drive.

## Acceso

Los vendedores entran desde **https://majaxu.github.io/pipelineacm/**, que redirige a la
aplicación (hay que iniciar sesión con la cuenta del dominio `@juarezbeltran.com.ar`).
Esa página es el `index.html` de la raíz, servido por GitHub Pages.

## Estructura

```
Pipeline ACM/
├── apps-script/            → la app que se publica en Google Apps Script
│   ├── Code.gs             → backend (login, permisos, lectura/escritura Sheet, backup, subida de archivos)
│   ├── Index.html          → interfaz (HTML + CSS + JS en un solo archivo)
│   ├── appsscript.json     → manifiesto (permisos y acceso por dominio)
│   └── DEPLOY.md           → guía paso a paso para publicarla
├── web/
│   └── index.html          → página de redirección para un link "lindo" (ej. /pipeline)
├── PROYECT_CONTEXT.md      → contexto y reglas de negocio del proyecto
└── docs/                   → documentación de referencia
```

## Puesta en marcha

Ver **[apps-script/DEPLOY.md](apps-script/DEPLOY.md)**. En resumen: crear una planilla de
Google Sheets, crear un proyecto en [script.google.com](https://script.google.com) con los
archivos de `apps-script/`, y publicarlo como **Aplicación web** (ejecutar como el dueño,
acceso restringido al dominio).

## Modelo de datos

Cada propiedad es una fila en la hoja `Leads`. La columna `data` guarda el detalle completo
en formato JSON; el resto de las columnas (dirección, propietario, avance, estado, vendedor)
son legibles para revisar la planilla directamente.
