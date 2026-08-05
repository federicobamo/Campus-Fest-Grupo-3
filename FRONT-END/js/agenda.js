const API_URL = "http://localhost:3000/agenda";

const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];

// Se ejecuta apenas carga la página
document.addEventListener("DOMContentLoaded", () => {
    cargarAgenda(true);

    const selects = document.querySelectorAll(".filter-bar select");

    // selects[0] = fecha, selects[1] = categoría
    selects[0].addEventListener("change", () => cargarAgenda(false));
    selects[1].addEventListener("change", () => cargarAgenda(false));
});

// LISTAR (GET /agenda)
// primeraCarga: en la primera carga se llenan las opciones del filtro de fecha
// con los días que realmente existen en la base de datos

async function cargarAgenda(primeraCarga) {
    const contenedor = document.querySelector("#contenedorAgenda");

    try {
        const selects = document.querySelectorAll(".filter-bar select");
        const fecha = selects[0].value;
        const categoria = selects[1].value;

        let url = API_URL;
        const parametros = [];

        if (fecha) {
            parametros.push(`fecha=${fecha}`);
        }

        if (categoria) {
            parametros.push(`categoria=${encodeURIComponent(categoria)}`);
        }

        if (parametros.length > 0) {
            url = `${API_URL}?${parametros.join("&")}`;
        }

        const response = await fetch(url);
        const actividades = await response.json();

        if (primeraCarga) {
            llenarFiltroFechas(actividades);
        }

        renderizarAgenda(actividades);

    } catch (error) {
        console.error("Error al cargar la agenda:", error);
        contenedor.innerHTML = `<p class="desc">No se pudo conectar con el servidor. Revisá que el backend esté corriendo.</p>`;
    }
}

// Agrupa las actividades por día. Se usa la parte de fecha en UTC (aaaa-mm-dd)
// porque MongoDB guarda las fechas en UTC; así el día mostrado siempre calza
// con el día que filtra el backend.
function agruparPorDia(actividades) {
    const grupos = {};

    actividades.forEach(act => {
        const dia = act.fechaActividad.split("T")[0];

        if (!grupos[dia]) {
            grupos[dia] = [];
        }

        grupos[dia].push(act);
    });

    return grupos;
}

// Convierte "2026-10-15" en "Jueves 15 de octubre"
function tituloDelDia(dia) {
    const fecha = new Date(dia + "T00:00:00Z");

    const nombreDia = DIAS_SEMANA[fecha.getUTCDay()];
    const numero = fecha.getUTCDate();
    const mes = MESES[fecha.getUTCMonth()];

    return `${nombreDia} ${numero} de ${mes}`;
}

function renderizarAgenda(actividades) {
    const contenedor = document.querySelector("#contenedorAgenda");
    contenedor.innerHTML = ""; // limpia las tablas quemadas del HTML

    if (actividades.length === 0) {
        contenedor.innerHTML = `<p class="desc">No hay actividades que coincidan con los filtros seleccionados.</p>`;
        return;
    }

    const grupos = agruparPorDia(actividades);
    const dias = Object.keys(grupos).sort();

    dias.forEach(dia => {
        const titulo = document.createElement("h3");
        titulo.style.cssText = "font-size: 18px; margin: 28px 0 12px;";
        titulo.textContent = tituloDelDia(dia);
        contenedor.appendChild(titulo);

        const wrapper = document.createElement("div");
        wrapper.className = "table-wrapper";
        wrapper.style.marginBottom = "32px";

        let filas = "";

        grupos[dia].forEach(act => {
            const claseEstado = "status-" + act.estadoActividad.toLowerCase();
            const lugar = act.esVirtual ? "🔗 " + act.enlaceActividad : "📍 " + act.lugarActividad;

            filas += `
                <tr>
                    <td>${act.horaActividad}</td>
                    <td>${act.nombreActividad}</td>
                    <td>${lugar}</td>
                    <td>${act.categoriaActividad}</td>
                    <td><span class="status-badge ${claseEstado}"><span class="status-dot"></span> ${act.estadoActividad}</span></td>
                </tr>
            `;
        });

        wrapper.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Hora</th>
                        <th>Actividad</th>
                        <th>Lugar</th>
                        <th>Categoría</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
        `;

        contenedor.appendChild(wrapper);
    });
}

// Llena el filtro de fecha con los días que existen en la base de datos
function llenarFiltroFechas(actividades) {
    const selectFecha = document.querySelectorAll(".filter-bar select")[0];
    const grupos = agruparPorDia(actividades);
    const dias = Object.keys(grupos).sort();

    selectFecha.innerHTML = `<option value="">Todas las fechas</option>`;

    dias.forEach(dia => {
        const opcion = document.createElement("option");
        opcion.value = dia;
        opcion.textContent = tituloDelDia(dia);
        selectFecha.appendChild(opcion);
    });
}
