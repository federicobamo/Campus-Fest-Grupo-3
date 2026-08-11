# CampusFest — Gestión del Festival Estudiantil

Aplicación web full stack para la gestión del festival estudiantil anual de **Universidad CENFOTEC**. Permite publicar las actividades del evento, controlar las inscripciones con límite de cupo y fecha de cierre, administrar los stands participantes, mostrar la agenda general y recibir consultas del público, todo desde una única plataforma.

El sistema reemplaza el manejo previo del festival mediante hojas de cálculo, formularios externos y mensajería.

**Proyecto Integrador 1 (SOFT-11)** · Sección SCV0 · Periodo 2026-C2
**Grupo 3:** Federico Barón Montoya · Steven Méndez Jiménez · Mariana Soto Castro
**Profesora:** Verónica Isabel Mora Lezcano

---

## Tabla de contenido

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Uso del sistema](#uso-del-sistema)
- [Estructura del proyecto](#estructura-del-proyecto)
- [API REST](#api-rest)
- [Reglas de negocio](#reglas-de-negocio)
- [Documentación](#documentación)
- [Convenciones de desarrollo](#convenciones-de-desarrollo)
- [Solución de problemas](#solución-de-problemas)

---

## Descripción

CampusFest atiende dos perfiles de usuario:

**Visitante / Estudiante** — Consulta la información del festival sin necesidad de autenticarse: portada, catálogo de actividades con filtros, detalle de cada actividad, agenda cronológica y stands participantes. Puede inscribirse en las actividades usando su correo institucional y enviar consultas al comité organizador.

**Administrador** — Accede a un panel protegido mediante su correo institucional, desde donde gestiona actividades (crear, editar, cancelar, eliminar), consulta y cancela inscripciones, administra los stands, atiende los mensajes de contacto y registra los resultados o reconocimientos del evento.

### Módulos funcionales

| Módulo | Descripción |
|---|---|
| Autenticación | Inicio de sesión del administrador y protección del panel |
| Actividades | Gestión completa de actividades, catálogo público y detalle |
| Inscripciones | Registro de participantes con validación de cupos, duplicados y cierre |
| Stands | Gestión de stands participantes con actividades vinculadas |
| Agenda | Consulta cronológica de las actividades del festival |
| Contacto | Recepción y gestión de consultas del público |

---

## Tecnologías

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 18 o superior | Entorno de ejecución |
| Express | ^5.2.1 | Framework del servidor y API REST |
| Mongoose | ^9.7.4 | Modelado de datos y validaciones |
| MongoDB Atlas | — | Base de datos documental en la nube |
| cors | ^2.8.6 | Habilitación de peticiones desde el frontend |
| body-parser | ^2.3.0 | Análisis del cuerpo de las peticiones |
| dotenv | ^17.4.2 | Carga de variables de entorno |

### Frontend
| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de las 13 pantallas |
| CSS3 | Estilos propios con variables, componentes reutilizables, diseño responsive y modo oscuro |
| JavaScript (ES6+) | Lógica del cliente y consumo de la API mediante Fetch |

> El frontend no utiliza frameworks ni dependencias externas: se sirve como archivos estáticos.

---

## Requisitos previos

Antes de instalar, verifica que tengas:

- **Node.js 18 o superior** y **npm**. Comprueba las versiones con:
  ```bash
  node --version
  npm --version
  ```
  Si no lo tienes, descárgalo desde [nodejs.org](https://nodejs.org).

- **Git**, para clonar el repositorio:
  ```bash
  git --version
  ```

- **Una cuenta de MongoDB Atlas** con un clúster creado, un usuario de base de datos y el acceso de red habilitado. La cadena de conexión se obtiene en Atlas desde **Database → Connect → Drivers**.

- Un **navegador moderno** (Chrome, Firefox, Safari o Edge en versiones recientes).

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/federicobamo/Campus-Fest-Grupo-3.git
cd Campus-Fest-Grupo-3
```

### 2. Instalar las dependencias del backend

Las dependencias se instalan **dentro de la carpeta `BACK-END`**, no en la raíz del repositorio:

```bash
cd BACK-END
npm install
```

Esto instala Express, Mongoose, cors, body-parser y dotenv según el `package.json`. La instalación crea la carpeta `node_modules`, que está excluida del control de versiones.

El frontend no requiere instalación: son archivos estáticos.

---

## Configuración

El proyecto necesita un archivo `.env` en la carpeta `BACK-END`. **Este archivo no está en el repositorio** y debe crearse localmente, ya que contiene credenciales.

### Crear el archivo `.env`

Desde la carpeta `BACK-END`:

```bash
cat > .env << 'EOF'
PORT=3000
MONGODB_URI=mongodb+srv://USUARIO:CONTRASEÑA@CLUSTER.mongodb.net/campusfest?retryWrites=true&w=majority
EOF
```

En Windows (PowerShell):

```powershell
@"
PORT=3000
MONGODB_URI=mongodb+srv://USUARIO:CONTRASEÑA@CLUSTER.mongodb.net/campusfest?retryWrites=true&w=majority
"@ | Out-File -Encoding utf8 .env
```

### Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `PORT` | No | Puerto en el que escucha el servidor. Por omisión, 3000. |
| `MONGODB_URI` | **Sí** | Cadena de conexión completa a MongoDB Atlas, incluyendo el nombre de la base de datos (`campusfest`). |

### Reglas de formato

- Sin espacios alrededor del signo `=`
- Sin comillas alrededor de los valores
- Un par `clave=valor` por línea

### Verificar la configuración

```bash
cat .env
```

Debe mostrar las dos variables con sus valores.

> **Importante:** el archivo `.env` está listado en el `.gitignore` y nunca debe subirse al repositorio. Antes de hacer un commit, verifica con `git status` que no aparezca.

---

## Ejecución

### Levantar el backend

Desde la carpeta `BACK-END`:

```bash
node index.js
```

Si todo está correcto, la consola muestra:

```
Servidor corriendo en http://localhost:3000
MongoDB Atlas conectado
```

Deja esta terminal abierta mientras uses el sistema. Para detener el servidor: `Ctrl + C`.

### Abrir el frontend

En **otra terminal**, desde la raíz del repositorio:

**Opción A — Abrir el archivo directamente**

```bash
# macOS
open FRONT-END/index.html

# Linux
xdg-open FRONT-END/index.html

# Windows
start FRONT-END/index.html
```

**Opción B — Servirlo con un servidor local (recomendado)**

```bash
cd FRONT-END
npx serve -p 5500
```

Luego abre `http://localhost:5500` en el navegador.

> Si usas Visual Studio Code, la extensión **Live Server** cumple la misma función: clic derecho sobre `index.html` → *Open with Live Server*.

### Comprobar que la API responde

```bash
curl http://localhost:3000/actividad
```

Devuelve un arreglo JSON (vacío si aún no hay actividades registradas).

---

## Uso del sistema

### Primer arranque

Al iniciar por primera vez la base de datos está vacía, por lo que el sitio público no mostrará contenido. Para poblarla:

1. Abre `admin-login.html` (botón **Administrador** en la barra de navegación)
2. Ingresa cualquier correo del dominio institucional, por ejemplo `admin@ucenfotec.ac.cr`
3. En **Actividades**, crea dos o tres actividades. Usa fechas con más de 36 horas de margen para poder probar las inscripciones
4. En **Stands**, registra uno o dos stands y vincúlalos a las actividades creadas
5. Vuelve al sitio público: la portada, el catálogo, la agenda y los stands ya mostrarán la información

### Probar una inscripción

Desde `inscripcion.html`, completa el formulario usando un correo del dominio `@ucenfotec.ac.cr` (es obligatorio). Al enviarlo aparece la confirmación en pantalla y el cupo disponible de la actividad disminuye en uno.

---

## Estructura del proyecto

```
Campus-Fest-Grupo-3/
│
├── README.md                    Este archivo
├── .gitignore                   Excluye node_modules y .env
│
├── BACK-END/
│   ├── index.js                 Punto de entrada: middleware, conexión y rutas
│   ├── package.json             Dependencias
│   ├── .env                     Variables de entorno (crear localmente)
│   │
│   ├── models/                  Esquemas de datos
│   │   ├── actividad.model.js
│   │   ├── administrador.model.js
│   │   ├── contacto.model.js
│   │   ├── inscripcion.model.js
│   │   └── stand.model.js
│   │
│   └── routes/                  Endpoints y reglas de negocio
│       ├── actividad.route.js
│       ├── administrador.route.js
│       ├── agenda.route.js
│       ├── contacto.route.js
│       ├── inscripcion.route.js
│       └── stand.route.js
│
├── FRONT-END/
│   ├── index.html               Portada
│   ├── actividades.html         Catálogo con filtros
│   ├── detalle-actividad.html   Detalle de actividad
│   ├── agenda.html              Agenda cronológica
│   ├── stands.html              Stands participantes
│   ├── inscripcion.html         Formulario de inscripción
│   ├── contacto.html            Contacto y consultas
│   │
│   ├── admin-login.html         Inicio de sesión
│   ├── admin-dashboard.html     Indicadores
│   ├── admin-actividades.html   Gestión de actividades
│   ├── admin-inscripciones.html Gestión de inscripciones
│   ├── admin-stands.html        Gestión de stands
│   ├── admin-contacto.html      Gestión de mensajes
│   ├── admin-resultados.html    Resultados y reconocimientos
│   │
│   ├── css/styles.css           Hoja única: variables, componentes, modo oscuro
│   └── js/                      Un módulo por vista + utilidades comunes
│
└── docs/                        Documentación del proyecto
```

---

## API REST

Base: `http://localhost:3000`

### Autenticación

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/administrador/login` | Inicia sesión validando que el correo pertenezca al dominio institucional |

### Actividades

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/actividad` | Crea una actividad |
| GET | `/actividad` | Lista las actividades. Filtros: `categoria`, `estado`, `esVirtual`, `fecha` |
| GET | `/actividad/:id` | Consulta una actividad concreta |
| PUT | `/actividad/:id` | Modifica o cancela una actividad |
| DELETE | `/actividad/:id` | Elimina una actividad |

### Inscripciones

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/inscripcion` | Registra una inscripción aplicando todas las reglas de negocio |
| GET | `/inscripcion` | Lista las inscripciones con el nombre de su actividad |
| DELETE | `/inscripcion/:id` | Cancela una inscripción y libera el cupo |

### Stands

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/stand` | Registra un stand |
| GET | `/stand` | Lista los stands. Filtro: `categoria` |
| GET | `/stand/:id` | Consulta un stand concreto |
| PUT | `/stand/:id` | Modifica un stand |
| DELETE | `/stand/:id` | Elimina un stand |

### Agenda

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/agenda` | Actividades ordenadas por fecha y hora. Filtros: `fecha`, `categoria` |

### Contacto

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/contacto` | Registra una consulta |
| GET | `/contacto` | Lista las consultas recibidas |
| DELETE | `/contacto/:id` | Elimina una consulta atendida |

### Códigos de estado

| Código | Significado |
|---|---|
| 200 | Operación completada |
| 201 | Recurso creado |
| 400 | Petición inválida o regla de negocio incumplida |
| 401 | Correo no institucional en el inicio de sesión |
| 404 | Recurso inexistente |
| 500 | Error interno del servidor |

Los errores devuelven un objeto con la propiedad `mensajeError` y un texto comprensible.

### Ejemplos

```bash
# Listar actividades disponibles de categoría deportiva
curl "http://localhost:3000/actividad?categoria=Deportiva&estado=Disponible"

# Consultar la agenda de un día
curl "http://localhost:3000/agenda?fecha=2026-10-15"

# Registrar una inscripción
curl -X POST http://localhost:3000/inscripcion \
  -H "Content-Type: application/json" \
  -d '{
    "nombreCompleto": "Ana Mora",
    "identificacion": "1-1111-1111",
    "correo": "ana.mora@ucenfotec.ac.cr",
    "telefono": "8888-8888",
    "carrera": "Ingeniería del Software",
    "actividadSeleccionada": "ID_DE_LA_ACTIVIDAD"
  }'
```

---

## Reglas de negocio

Estas reglas se aplican en el servidor y son las que gobiernan el comportamiento del sistema:

| Regla | Comportamiento |
|---|---|
| **Correo institucional obligatorio** | Solo se aceptan inscripciones con correo del dominio `@ucenfotec.ac.cr` |
| **Cierre de 36 horas** | Las inscripciones se cierran 36 horas antes del inicio de la actividad. Las actividades ya realizadas también se rechazan |
| **Sin duplicados** | Un estudiante no puede inscribirse dos veces en la misma actividad (se compara por identificación) |
| **Inscripción múltiple** | Un estudiante sí puede inscribirse en varias actividades distintas |
| **Control de cupos** | No se permiten inscripciones sin cupos disponibles. Al agotarse, la actividad pasa automáticamente al estado *Lleno* |
| **Liberación de cupo** | Al cancelar una inscripción, el cupo se libera y la actividad vuelve al estado *Disponible* |
| **Actividades canceladas** | No admiten inscripciones |
| **Confirmación en pantalla** | La confirmación se muestra en la interfaz; el sistema no envía correos |
| **Cancelación exclusiva del administrador** | El estudiante no puede cancelar su propia inscripción |
| **Enlace en actividades virtuales** | Si la actividad es virtual, el enlace de acceso es obligatorio |

---

## Documentación

La documentación del proyecto se encuentra en la carpeta `docs/`:

| Documento | Contenido |
|---|---|
| **ERS v2.0** | Especificación de requisitos: actores, requisitos funcionales y no funcionales con criterios medibles, restricciones, estado de implementación y matriz de trazabilidad |
| **EDS v2.0** | Especificación de diseño: arquitectura por capas, patrones aplicados, diseño de las colecciones con campo y tipo de dato, catálogo de la API, validación y manejo de errores, diseño de interfaz y navegación |
| **Matriz de Trazabilidad v3.0** | Relación requisito → épica → historia de Jira → endpoint → caso de prueba |
| **Plan de Pruebas** | 47 casos de prueba con cobertura del 100 % de los módulos, con flujo feliz y escenarios de borde |

Gestión del proyecto: **Jira**, proyecto CampusFest-Grupo3 (clave SCRUM), metodología Scrum con 6 épicas y 25 historias de usuario.

---

## Convenciones de desarrollo

### Nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Variables y funciones | camelCase | `cuposDisponiblesActividad` |
| Campos de esquema | camelCase, incluyendo la entidad | `nombreActividad`, `categoriaStand` |
| Modelos | minúscula, singular | `actividad`, `stand` |
| Archivos de backend | `entidad.model.js`, `entidad.route.js` | `inscripcion.route.js` |
| Archivos de frontend | minúscula con guiones | `detalle-actividad.html` |
| Rutas de la API | minúscula, singular | `/actividad`, `/inscripcion` |

### Ramas

| Rama | Propósito |
|---|---|
| `main` | Versión integrada y estable. Rama entregable |
| `feature/<nombre>` | Trabajo por módulo. Se integra mediante pull request |

### Tipos de commit

```
feat:     nueva funcionalidad
fix:      corrección de un defecto
docs:     cambios en documentación
style:    formato sin cambio de comportamiento
refactor: reorganización sin cambio de comportamiento
test:     adición o modificación de pruebas
chore:    mantenimiento y configuración
```

Formato: tipo, dos puntos y descripción en imperativo, minúscula y sin punto final.

---

## Solución de problemas

### `Cannot find module '.../index.js'` o `Could not read package.json`

Estás ejecutando el comando desde la raíz del repositorio. Los comandos de npm y node deben ejecutarse dentro de `BACK-END`:

```bash
cd BACK-END
npm install
node index.js
```

### `injected env (0) from .env`

El archivo `.env` existe pero está vacío o mal escrito, por lo que `MONGODB_URI` llega sin valor. Revisa su contenido con `cat .env` y vuelve a crearlo siguiendo la sección [Configuración](#configuración).

### `The uri parameter to openUri() must be a string, got "undefined"`

Misma causa que el punto anterior: la variable `MONGODB_URI` no se está cargando.

### `bad auth : Authentication failed`

La contraseña dentro de la cadena de conexión es incorrecta. Verifícala en Atlas → **Database Access**. Si contiene caracteres especiales (`@`, `:`, `/`, `#`), deben codificarse para URL.

### `querySrv ENOTFOUND` o la conexión queda en espera

Tu dirección IP no tiene acceso al clúster. En Atlas ve a **Network Access → Add IP Address** y agrega tu IP actual (o `0.0.0.0/0` solo para desarrollo).

### El navegador muestra una versión antigua de una página

Es caché del navegador. Fuerza la recarga:

- macOS: `Cmd + Shift + R`
- Windows / Linux: `Ctrl + Shift + F5`

### El sitio carga pero no muestra actividades

Comprueba que el backend esté en ejecución y que la consola del navegador (F12) no reporte errores de conexión. Verifica también que la API responda:

```bash
curl http://localhost:3000/actividad
```

Si devuelve `[]`, la base de datos está vacía: crea actividades desde el panel administrativo.

### El puerto 3000 está ocupado

Cambia el valor de `PORT` en el `.env`, o libera el puerto:

```bash
# macOS / Linux
lsof -ti:3000 | xargs kill -9
```

---

## Licencia y uso

Proyecto desarrollado con fines académicos para el curso Proyecto Integrador 1 (SOFT-11) de Universidad CENFOTEC, periodo 2026-C2.
