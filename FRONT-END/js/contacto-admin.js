const API_URL = "http://localhost:3000/contacto";

let contactos = []; // guarda la última respuesta del backend

document.addEventListener("DOMContentLoaded", () => { // Se ejecuta apenas carga la página
    cargarContactos();
});

// LISTAR (GET contacto)
async function cargarContactos() {
    try {
        const response = await fetch(API_URL);
        contactos = await response.json();
        renderizarTabla(contactos);
    } catch (error) {
        console.error("Error al cargar los contactos:", error);
        showToast("Error", "No se pudo conectar con el servidor.");
    }
}

function renderizarTabla(lista) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // limpia las filas quemadas del HTML tabla

    if (lista.length === 0) { // en caso no haya mensajes de contacto
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--color-texto-secundario);">No hay mensajes de contacto guardados.</td></tr>`;
        return;
    }

    lista.forEach(contacto => {
        const fila = document.createElement("tr"); // crea una fila dentro de la tabla

        const fecha = new Date(contacto.fechaContacto).toLocaleString("es-CR");

        fila.innerHTML = `
            <td>${contacto.nombreCompleto}</td>
            <td>${contacto.correo}</td>
            <td>${contacto.asuntoContacto}</td>
            <td>${contacto.mensaje}</td>
            <td>${fecha}</td>
            <td class="admin-table-actions">
                <button class="icon-btn danger" onclick="borrarMensaje('${contacto._id}', '${contacto.nombreCompleto}')" aria-label="Borrar mensaje">✕</button>
            </td>
        `;

        tbody.appendChild(fila);
    });
}

// Borrar mensaje

let idContactoActual = null; // guarda cual mensaje se esta borrando

function borrarMensaje(id, nombreCompleto) {
    idContactoActual = id; // guarda el id del mensaje seleccionado
    document.querySelector("#nombreContactoMensaje").textContent = nombreCompleto;
    openModal("modalBorrarMensaje");
}

const btnConfirmarBorrarMensaje = document.querySelector("#btnConfirmarBorrarMensaje");

btnConfirmarBorrarMensaje.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_URL}/${idContactoActual}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const error = await response.json();
            showToast("Error", error.mensajeError);
            return;
        }

        closeModal("modalBorrarMensaje");
        showToast("Mensaje borrado", "El mensaje de contacto fue eliminado.");
        cargarContactos(); // cargar de nuevo la tabla

    } catch (error) {
        console.error("Error al borrar el mensaje:", error);
        showToast("Error", "No se pudo conectar con el servidor.");
    }
});
