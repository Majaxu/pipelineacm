# Pipeline ACM – Juarez Beltrán Asesores Inmobiliarios

## 1. Objetivo del proyecto

Desarrollar una aplicación web simple para hacer seguimiento del proceso de **captación de propiedades mediante ACM** de Juarez Beltrán Asesores Inmobiliarios.

La idea principal es que cada propiedad ingresada aparezca como una línea dentro de un listado general y permita visualizar rápidamente en qué etapa del proceso de captación se encuentra.

Cada propiedad tiene una serie de **checkpoints o hitos**.

A medida que los hitos se cumplen:

- aumenta el porcentaje de avance;
- la línea de la propiedad pasa progresivamente de gris claro a verde;
- cuando todos los hitos están completos, la propiedad queda en verde pleno.

La interfaz debe permitir que alguien de la inmobiliaria pueda usarla sin conocimientos técnicos.

---

# 2. Archivo principal actual

Actualmente el proyecto consiste en un único archivo:

`pipeline_acm_juarez_beltran.html`

Es una aplicación HTML autocontenida:

- HTML
- CSS
- JavaScript

No necesita backend por ahora.

La información se guarda utilizando `localStorage` del navegador.

También permite:

- exportar los datos a JSON;
- importar nuevamente un respaldo JSON.

La intención es seguir desarrollando esta versión antes de decidir si se migra a una arquitectura con backend, usuarios y base de datos.

---

# 3. Concepto general de la interfaz

La pantalla principal muestra un listado de propiedades.

Cada fila contiene:

- Dirección del inmueble.
- Nombre del propietario.
- Contacto.
- Estado general.
- Checkpoints principales.
- Barra de avance.
- Porcentaje de avance.
- Botón para expandir los detalles.

La línea comienza en gris.

A medida que aumenta el porcentaje de cumplimiento debe ir tomando color verde.

Al llegar al 100%, debe quedar claramente identificada como completada.

Al abrir una propiedad aparecen todos los datos y controles detallados de cada etapa.

---

# 4. Proceso ACM original

El flujo está basado en el documento interno:

`Proceso captacion sugerido.pdf`

El proceso general es:

1. Ingresa Lead
2. Llamada pre-calificación
3. Investigación
4. Visita al inmueble
5. Presentación ACM
6. Pedido / recepción de documentación
7. Producción audiovisual PRO
8. Informes de comercialización
9. Llevar la propiedad a precio de mercado

Luego existe una etapa posterior de cierre comercial:

- Negociación
- Toma de reserva
- Proceso de escritura

Actualmente estos últimos tres ítems se registran, pero **no forman parte del porcentaje de captación**.

---

# 5. Ingreso del Lead

Al agregar una propiedad nueva se solicita:

### Dirección del inmueble

Dato obligatorio.

Ejemplo:

`Av. Colón 1234`

### Propietario

Nombre y apellido del propietario.

Dato obligatorio.

### Contacto

Teléfono u otro dato de contacto.

Opcional.

Una vez ingresado el lead se agrega automáticamente una nueva línea al listado general.

---

# 6. Llamada de pre-calificación

Esta etapa tiene un checkpoint principal pero requiere información adicional.

Debe cargarse obligatoriamente:

### Número de cuenta de Rentas

El checkpoint de Precalificación **no puede considerarse completo si este dato está vacío**.

Además existen campos de texto para registrar información obtenida durante la llamada.

Preguntas sugeridas:

- ¿Por qué necesita vender?
- ¿En cuánto tiempo necesita vender?
- ¿Ya lo tiene publicado otra inmobiliaria?
- ¿Conoce los gastos a la hora de vender?

También existe:

### Información extra / Notas

Campo de texto libre.

El objetivo no es obligar al usuario a completar cada pregunta por separado, sino permitir registrar información útil obtenida durante la conversación.

---

# 7. Investigación

La etapa Investigación actualmente contempla:

### Confirmación de identidad

Checkbox:

`Identidad de la persona confirmada`

El objetivo es corroborar que la persona que ofrece el inmueble realmente tenga relación con el titular registral.

### Pedido de informe de matrícula

Checkbox:

`Informe de matrícula pedido`

### Link al informe

Campo URL donde se puede guardar el link al informe de matrícula o al documento almacenado en Drive u otro sistema.

Debe existir un botón:

`Abrir`

para acceder directamente al informe.

### Resultado del análisis

Dropdown con exactamente estos estados:

- Apto Venta
- Apto pendiente
- No apto

Si se selecciona:

`No apto`

el lead debe considerarse cancelado y deben bloquearse las etapas posteriores.

La propiedad debe quedar claramente marcada como:

`NO APTO / Lead cancelado`

Debe existir una opción posterior para reactivar el lead en caso de error.

---

# 8. Visita al inmueble

Checkpoint:

`Visita confirmada / realizada`

Según el procedimiento original, durante esta etapa se considera importante:

- llegar puntual;
- llevar ficha de tasación;
- recorrer el inmueble;
- sacar fotos enfocadas en detalles de mantenimiento;
- profundizar el vínculo con el cliente;
- coordinar la presentación posterior de la estimación de precio;
- pedir que el propietario exhiba la escritura durante la presentación.

Actualmente estos puntos son información de contexto y no checkpoints individuales.

---

# 9. Presentación ACM

Checkpoint:

`ACM presentado / entregado`

Debe existir además:

### Link al ACM / estimación

Campo URL.

Puede apuntar a:

- PDF;
- Google Drive;
- Google Docs;
- sistema interno;
- cualquier otro documento web.

El procedimiento contempla:

- preparar entregables tangibles;
- presentar el ACM;
- volver a contactar posteriormente al propietario.

---

# 10. Documentación

Esta etapa contempla:

### Escritura escaneada

Checkbox.

### Link a escritura escaneada

Campo URL.

### Resto de documentación

Checkbox:

`Resto de documentación pedida / recibida`

### Link a carpeta de documentación

Campo URL.

### Documentación validada

Checkpoint general de la etapa.

Actualmente, para completar el checkpoint general de Documentación debe estar marcada como mínimo:

`Escritura escaneada`.

---

# 11. Producción audiovisual PRO

Checkpoint:

`HECHO`

También existe:

### Link a material audiovisual

Puede contener un link a:

- carpeta de fotos;
- video;
- publicación;
- Google Drive;
- otro repositorio.

Según el procedimiento interno:

- abrir ventanas;
- prender todas las luces;
- despejar mesas y mesadas si el inmueble está ocupado;
- hacer fotografías;
- publicar inicialmente incluso con material sin edición;
- posteriormente reemplazarlo o complementarlo con material editado y video.

---

# 12. Informes de comercialización

Actualmente se contemplan tres informes.

### Informe 1

- Checkbox: entregado.
- Campo URL al informe.

### Informe 2

- Checkbox: entregado.
- Campo URL al informe.

### Informe 3

- Checkbox: entregado.
- Campo URL al informe.

Existe además un checkpoint general:

`Ciclo de informes completado`

Para que la etapa esté completa deben estar marcados:

- Informe 1
- Informe 2
- Informe 3
- Ciclo de informes completado

El procedimiento original propone informes aproximadamente cada 30 días incluyendo:

- conclusión;
- análisis;
- plan de acción.

---

# 13. Precio de mercado

Checkpoint:

`Llevado a precio de mercado`

Existe además:

### Notas de ajuste / conversación con propietario

Campo de texto libre.

Sirve para registrar:

- precio anterior;
- precio sugerido;
- conversación mantenida;
- objeciones;
- decisiones del propietario;
- observaciones.

---

# 14. Cierre comercial

Actualmente aparecen tres campos adicionales:

- Negociación
- Toma de reserva
- Proceso de escritura

Estos checkpoints son informativos.

Por ahora **NO modifican el porcentaje de avance del proceso ACM**.

Son considerados parte de la etapa posterior a la captación y comercialización.

---

# 15. Checkpoints que cuentan para el porcentaje

Actualmente existen 8 hitos principales:

1. Precalificación
2. Investigación
3. Visita
4. ACM
5. Documentación
6. Audiovisual
7. Informes
8. Precio de mercado

Cada checkpoint representa:

`12,5 %`

del total.

Por lo tanto:

- 0 hitos = 0 %
- 1 hito = 12,5 %
- 2 hitos = 25 %
- 4 hitos = 50 %
- 6 hitos = 75 %
- 8 hitos = 100 %

La interfaz actualmente redondea visualmente el porcentaje.

---

# 16. Reglas especiales actuales

## Precalificación

No puede completarse si no existe:

`Número de cuenta de Rentas`.

---

## Investigación

No puede completarse si no se cumple:

- identidad confirmada;
- informe de matrícula pedido;
- resultado seleccionado.

---

## No apto

Si Investigación tiene:

`No apto`

la propiedad se cancela.

Las etapas posteriores quedan bloqueadas.

---

## Documentación

Para completar la etapa debe estar marcada al menos:

`Escritura escaneada`.

---

## Informes

Para completar Informes deben estar marcados:

- Informe 1 entregado;
- Informe 2 entregado;
- Informe 3 entregado;
- Ciclo de informes completado.

---

# 17. Listado principal

La intención es que el usuario pueda comprender el estado de una propiedad **sin necesidad de abrirla**.

Por eso cada línea debe mostrar los checkpoints principales.

Actualmente son:

- Precalificación
- Investigación
- Visita
- ACM
- Documentación
- Audiovisual
- Informes
- Precio mercado

Cada checkpoint puede pulsarse desde la propia fila.

Al completar uno se muestra visualmente con tilde.

---

# 18. Color según avance

Una característica importante del proyecto es que el color de fondo de cada propiedad muestre su evolución.

Conceptualmente:

### 0 %

Gris claro.

### Avance bajo

Gris con una pequeña presencia verde.

### Avance medio

Verde claro.

### Avance alto

Verde más evidente.

### 100 %

Verde pleno.

El objetivo es que mirando la pantalla se identifique inmediatamente qué propiedades están avanzadas y cuáles están estancadas.

---

# 19. Buscador y filtros

Actualmente existe búsqueda por:

- dirección;
- propietario;
- contacto;
- cuenta de Rentas.

Filtros:

- Todos
- Activos
- Completos
- Cancelados / No aptos

Orden:

- Más recientes
- Mayor avance
- Menor avance
- Dirección A-Z

---

# 20. Estadísticas

En la parte superior aparecen:

### Propiedades

Cantidad total.

### Leads activos

Propiedades que todavía están en proceso.

### Completados

Propiedades que llegaron al 100 %.

### Avance promedio

Promedio de cumplimiento de todas las propiedades.

---

# 21. Persistencia

Actualmente se utiliza:

`localStorage`

Clave aproximada:

`jb_acm_pipeline_v1`

Esto significa que los datos quedan guardados en el navegador donde se utiliza el HTML.

Limitación importante:

Los datos **no se sincronizan entre computadoras ni usuarios**.

Esto es aceptable para la etapa de prototipo.

---

# 22. Backup

La aplicación permite:

### Exportar respaldo

Genera un archivo JSON con todos los leads.

### Importar respaldo

Permite cargar nuevamente un JSON exportado anteriormente.

Al importar actualmente se reemplaza la base local existente.

---

# 23. Filosofía del desarrollo

Este proyecto se encuentra todavía en etapa de iteración.

NO realizar grandes cambios de arquitectura sin necesidad.

Prioridades:

1. Que sea muy fácil de usar.
2. Que la información pueda verse rápidamente.
3. Que registrar un avance requiera pocos clics.
4. Que no haya campos obligatorios innecesarios.
5. Que los checkpoints reflejen el proceso real de la inmobiliaria.
6. Que sea visualmente evidente dónde se encuentra cada propiedad.
7. Mantener el código sencillo mientras se termina de definir el producto.

---

# 24. Próxima etapa de trabajo

El archivo HTML existente debe considerarse la base del proyecto.

A partir de ahora se introducirán mejoras progresivamente.

Cuando el usuario solicite un cambio:

1. Analizar primero cómo afecta la lógica actual.
2. Mantener compatibilidad con los datos existentes siempre que sea posible.
3. Modificar directamente el código.
4. Evitar eliminar funcionalidades existentes salvo indicación expresa.
5. Mantener todo funcionando después de cada modificación.
6. Priorizar una buena experiencia de uso.
7. No convertir todavía el proyecto en React, Next.js u otro framework salvo que se solicite explícitamente.

---

# 25. Archivos recomendados dentro de la carpeta

La carpeta puede inicialmente quedar así:

```text
Pipeline-ACM/
│
├── pipeline_acm_juarez_beltran.html
│
├── PROJECT_CONTEXT.md
│
└── docs/
    └── Proceso captacion sugerido.pdf
```

Más adelante, si el proyecto crece, puede reorganizarse.

---

# 26. Instrucción para Codex

Trabajá sobre el archivo existente:

`pipeline_acm_juarez_beltran.html`

Este proyecto ya tiene funcionalidad implementada.

No recrearlo desde cero salvo que sea estrictamente necesario.

Antes de realizar cada modificación:

- entender la estructura actual;
- preservar las funcionalidades existentes;
- evitar regresiones;
- mantener almacenamiento local y compatibilidad con datos guardados;
- implementar los cambios solicitados directamente sobre el archivo.

El usuario irá indicando nuevas mejoras progresivamente.