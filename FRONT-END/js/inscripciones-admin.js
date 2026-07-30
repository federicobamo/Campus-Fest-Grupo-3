const API_URL = "http://localhost:3000/inscripcion";
const API_ACTIVIDADES = "http://localhost:3000/actividad";

let inscripciones = []; // guarda la última respuesta del backend para poder filtrarla sin volver a pedirla


document.addEventListener("DOMContentLoaded", () => {// Se ejecuta apenas carga la página: inscripciones y actividades
    cargarInscripciones(); 
    llenarFiltroActividades();

    document.querySelector("#filtroActividad").addEventListener("change", aplicarFiltros);
    document.querySelector("#filtroBusqueda").addEventListener("input", aplicarFiltros);
});

// LISTAR (GET inscripcion) 
async function cargarInscripciones() {
    try {
        const response = await fetch(API_URL); 
        inscripciones = await response.json();
        aplicarFiltros();
    } catch (error) {
        console.error("Error al cargar las inscripciones:", error);
        showToast("Error", "No se pudo conectar con el servidor.");
    }
}

// Llena el select de actividades para poder consultar por actividad 
async function llenarFiltroActividades() {
    try {
        const response = await fetch(API_ACTIVIDADES);
        const actividades = await response.json();

        const select = document.querySelector("#filtroActividad");

        actividades.forEach(act => {
            const opcion = document.createElement("option");
            opcion.value = act._id;
            opcion.textContent = act.nombreActividad;
            select.appendChild(opcion);
        });

    } catch (error) {
        console.error("No se pudieron cargar las actividades para el filtro:", error);
    }
}

// Filtra por actividad seleccionada y por texto (nombre o identificación)
function aplicarFiltros() {
    const actividadId = document.querySelector("#filtroActividad").value;
    const texto = document.querySelector("#filtroBusqueda").value.trim().toLowerCase();

    const filtradas = inscripciones.filter(insc => { // recorre la lista y la filtra segun la condicion de la fun
        const coincideActividad = !actividadId || insc.actividadSeleccionada?._id === actividadId;

        const identificacion = insc.indentificacion || "";
        const coincideTexto = !texto ||
            insc.nombreCompleto.toLowerCase().includes(texto) ||
            identificacion.toLowerCase().includes(texto);

        return coincideActividad && coincideTexto;  // retorna lo que coincide
    });

    renderizarTabla(filtradas);  // tabla 
}

function renderizarTabla(lista) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // limpia las filas quemadas del HTML tabla 

    if (lista.length === 0) { // en caso no haya inscripciones 
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--color-texto-secundario);">No hay inscripciones que coincidan con la búsqueda.</td></tr>`;
        return;
    }

    lista.forEach(insc => {
        const fila = document.createElement("tr");// crea una fila dentro de una tabla 

        const fecha = new Date(insc.fechaInscripcion).toLocaleString("es-CR");
        const actividad = insc.actividadSeleccionada?.nombreActividad || "Actividad eliminada";

        fila.innerHTML = ` 
            <td>${insc.nombreCompleto}</td>
            <td>${insc.indentificacion}</td>
            <td>${insc.correo}</td>
            <td>${insc.telefono}</td>
            <td>${insc.carrera}</td>
            <td>${actividad}</td>
            <td>${fecha}</td>
            <td class="admin-table-actions">
                <button class="icon-btn danger" onclick="cancelarInscripcion('${insc._id}', '${insc.nombreCompleto}')" aria-label="Cancelar inscripción">✕</button>
            </td>
        `;

        tbody.appendChild(fila); // 
    });
}

// Cancelar inscripcion

let idInscripcionActual = null; // guarda cual inscripcion se esta cancelando

function cancelarInscripcion(id, nombreCompleto) {
    idInscripcionActual = id; //guarda 
    document.querySelector("#nombreInscripcionCancelar").textContent = nombreCompleto;
    openModal("modalCancelarInscripcion"); // 
}

const btnConfirmarCancelarInscripcion = document.querySelector("#btnConfirmarCancelarInscripcion");

btnConfirmarCancelarInscripcion.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_URL}/${idInscripcionActual}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const error = await response.json();
            showToast("Error", error.mensajeError);
            return;
        }

        closeModal("modalCancelarInscripcion");
        showToast("Inscripción cancelada", "El cupo de la actividad fue liberado.");
        cargarInscripciones(); // cargar de nuevo la tabla 

    } catch (error) {
        console.error("Error al cancelar la inscripción:", error);
        showToast("Error", "No se pudo conectar con el servidor.");
    }
});
