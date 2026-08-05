const API_URL = "http://localhost:3000/actividad";
 
// Se ejecuta apenas carga la página
document.addEventListener("DOMContentLoaded", cargarActividades);
 
// LISTAR (GET /actividad)

async function cargarActividades() {
    try {
        const response = await fetch(API_URL);
        const actividades = await response.json();
        renderizarTabla(actividades);
    } catch (error) {
        console.error("Error al cargar actividades:", error);
    }
}
 
function renderizarTabla(actividades) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // limpia las filas quemadas del HTML
 
    actividades.forEach(act => {
        const fila = document.createElement("tr");
 
        const fecha = new Date(act.fechaActividad).toLocaleDateString("es-CR");
        const claseEstado = "status-" + act.estadoActividad.toLowerCase();
 
        fila.innerHTML = `
            <td>${act.nombreActividad}</td>
            <td>${act.categoriaActividad}</td>
            <td>${fecha} · ${act.horaActividad}</td>
            <td>${act.esVirtual ? "🔗 " + act.enlaceActividad : "📍 " + act.lugarActividad}</td>
            <td>${act.cuposDisponiblesActividad} / ${act.cupoMaximoActividad}</td>
            <td><span class="status-badge ${claseEstado}"><span class="status-dot"></span> ${act.estadoActividad}</span></td>
            <td class="admin-table-actions">
                <button class="icon-btn" onclick="abrirEditar('${act._id}')" aria-label="Editar">✎</button>
                <button class="icon-btn danger" onclick="cancelarActividad('${act._id}')" aria-label="Cancelar">✕</button>
            </td>
        `;
 
        tbody.appendChild(fila);
    });
}
 
// CREAR (POST /actividad)

const btnGuardarActividad = document.querySelector("#modalNuevaActividad .btn-primary");
 
btnGuardarActividad.addEventListener("click", async (e) => {
    e.preventDefault();
 
    const modalidad = document.querySelector("#modalidadAct").value;
    const esVirtual = modalidad === "Virtual";
    const lugarOEnlace = document.querySelector("#lugarAct").value;
 
    const nuevaActividad = {
        nombreActividad: document.querySelector("#nombreAct").value,
        categoriaActividad: document.querySelector("#categoriaAct").value,
        descripcionActividad: document.querySelector("#requisitosAct").value || "Sin descripción",
        requisitosActividad: document.querySelector("#requisitosAct").value,
        fechaActividad: document.querySelector("#fechaAct").value,
        horaActividad: document.querySelector("#horaAct").value,
        esVirtual: esVirtual,
        lugarActividad: esVirtual ? "Virtual" : lugarOEnlace,
        enlaceActividad: esVirtual ? lugarOEnlace : undefined,
        cupoMaximoActividad: Number(document.querySelector("#cupoAct").value)
    };
 
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaActividad)
        });
 
        if (!response.ok) {
            const error = await response.json();
            showToast("Error", error.mensajeError);
            return;
        }
 
        closeModal("modalNuevaActividad");
        showToast("Actividad creada", "La actividad se publicó en el catálogo.");
        cargarActividades(); // refresca la tabla con el nuevo dato
 
    } catch (error) {
        console.error("Error al crear actividad:", error);
        showToast("Error", "No se pudo conectar con el servidor.");
    }
});
 

// EDITAR 

let idActividadActual = null; // guarda cuál actividad se está editando/cancelando
 
async function abrirEditar(id) {
    idActividadActual = id;
 
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const act = await response.json();
 
        document.querySelector("#nombreEdit").value = act.nombreActividad;
        document.querySelector("#categoriaEdit").value = act.categoriaActividad;
        document.querySelector("#cupoEdit").value = act.cupoMaximoActividad;
        document.querySelector("#fechaEdit").value = act.fechaActividad.split("T")[0];
        document.querySelector("#horaEdit").value = act.horaActividad;
        document.querySelector("#lugarEdit").value = act.esVirtual ? act.enlaceActividad : act.lugarActividad;
 
        openModal("modalEditarActividad");
 
    } catch (error) {
        console.error("Error al cargar la actividad:", error);
        showToast("Error", "No se pudo cargar la actividad.");
    }
}
 
const btnGuardarEdicion = document.querySelector("#modalEditarActividad .btn-primary");
 
btnGuardarEdicion.addEventListener("click", async (e) => {
    e.preventDefault();
 
    const cambios = {
        nombreActividad: document.querySelector("#nombreEdit").value,
        categoriaActividad: document.querySelector("#categoriaEdit").value,
        cupoMaximoActividad: Number(document.querySelector("#cupoEdit").value),
        fechaActividad: document.querySelector("#fechaEdit").value,
        horaActividad: document.querySelector("#horaEdit").value,
        lugarActividad: document.querySelector("#lugarEdit").value
    };
 
    try {
        const response = await fetch(`${API_URL}/${idActividadActual}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cambios)
        });
 
        if (!response.ok) {
            const error = await response.json();
            showToast("Error", error.mensajeError);
            return;
        }
 
        closeModal("modalEditarActividad");
        showToast("Cambios guardados", "La actividad fue actualizada correctamente.");
        cargarActividades();
 
    } catch (error) {
        console.error("Error al editar actividad:", error);
        showToast("Error", "No se pudo conectar con el servidor.");
    }
});
 
// CANCELAR (DELETE /actividad/:id)

function cancelarActividad(id) {
    idActividadActual = id;
    openModal("modalCancelarActividad");
}
 
const btnConfirmarCancelar = document.querySelector("#modalCancelarActividad .btn-primary");
 
btnConfirmarCancelar.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_URL}/${idActividadActual}`, {
            method: "DELETE"
        });
 
        if (!response.ok) {
            const error = await response.json();
            showToast("Error", error.mensajeError);
            return;
        }
 
        closeModal("modalCancelarActividad");
        showToast("Actividad cancelada", "El estado se actualizó a cancelado.");
        cargarActividades();
 
    } catch (error) {
        console.error("Error al cancelar actividad:", error);
        showToast("Error", "No se pudo conectar con el servidor.");
    }
});