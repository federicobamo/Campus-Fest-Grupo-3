const API_URL = "http://localhost:3000/stand";
const API_ACTIVIDADES = "http://localhost:3000/actividad";

// Se ejecuta apenas carga la página
document.addEventListener("DOMContentLoaded", () => {
    cargarStands();
    llenarSelectActividades();

    const filtroCategoria = document.querySelector(".filter-bar select");
    filtroCategoria.addEventListener("change", cargarStands);
});

// LISTAR (GET /stand)

async function cargarStands() {
    try {
        const categoria = document.querySelector(".filter-bar select").value;

        let url = API_URL;

        if (categoria) {
            url = `${API_URL}?categoria=${encodeURIComponent(categoria)}`;
        }

        const response = await fetch(url);
        const stands = await response.json();
        renderizarTabla(stands);
    } catch (error) {
        console.error("Error al cargar stands:", error);
    }
}

function renderizarTabla(stands) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // limpia las filas quemadas del HTML

    stands.forEach(stand => {
        const fila = document.createElement("tr");

        // Nombres de las actividades vinculadas (vienen del populate)
        let actividades = "Ninguna";

        if (stand.actividadesStand && stand.actividadesStand.length > 0) {
            actividades = stand.actividadesStand
                .map(act => act.nombreActividad)
                .join(", ");
        }

        fila.innerHTML = `
            <td>${stand.nombreStand}</td>
            <td>${stand.categoriaStand}</td>
            <td>${stand.responsableStand}</td>
            <td>${stand.ubicacionStand}</td>
            <td>${actividades}</td>
            <td class="admin-table-actions">
                <button class="icon-btn" onclick="abrirEditar('${stand._id}')" aria-label="Editar">✎</button>
                <button class="icon-btn danger" onclick="eliminarStand('${stand._id}')" aria-label="Eliminar">✕</button>
            </td>
        `;

        tbody.appendChild(fila);
    });
}

// Llena los select de actividades relacionadas con las actividades reales
// de la base de datos (RF-STA-05)

async function llenarSelectActividades() {
    try {
        const response = await fetch(API_ACTIVIDADES);
        const actividades = await response.json();

        const selectNuevo = document.querySelector("#actividadesStand");
        const selectEdit = document.querySelector("#actividadesStandEdit");

        actividades.forEach(act => {
            const opcionNuevo = document.createElement("option");
            opcionNuevo.value = act._id;
            opcionNuevo.textContent = act.nombreActividad;
            selectNuevo.appendChild(opcionNuevo);

            const opcionEdit = document.createElement("option");
            opcionEdit.value = act._id;
            opcionEdit.textContent = act.nombreActividad;
            selectEdit.appendChild(opcionEdit);
        });

    } catch (error) {
        // Si el módulo de actividades no responde, el combo queda solo con "Ninguna"
        // y la pantalla sigue funcionando
        console.error("No se pudieron cargar las actividades para el combo:", error);
    }
}

// Lee las actividades seleccionadas de un select múltiple con un for normal
function leerActividadesSeleccionadas(idSelect) {
    const select = document.querySelector("#" + idSelect);
    const seleccionadas = [];

    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].selected && select.options[i].value !== "") {
            seleccionadas.push(select.options[i].value);
        }
    }

    return seleccionadas;
}

// CREAR (POST /stand)

const btnGuardarStand = document.querySelector("#modalNuevoStand .btn-primary");

btnGuardarStand.addEventListener("click", async (e) => {
    e.preventDefault();

    const nuevoStand = {
        nombreStand: document.querySelector("#nombreStand").value,
        categoriaStand: document.querySelector("#categoriaStand").value,
        responsableStand: document.querySelector("#responsableStand").value,
        ubicacionStand: document.querySelector("#ubicacionStand").value,
        descripcionStand: document.querySelector("#descripcionStand").value,
        actividadesStand: leerActividadesSeleccionadas("actividadesStand")
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoStand)
        });

        if (!response.ok) {
            const error = await response.json();
            showToast("Error", error.mensajeError);
            return;
        }

        closeModal("modalNuevoStand");
        showToast("Stand registrado", "El stand se agregó a la lista.");
        cargarStands(); // refresca la tabla con el nuevo dato

    } catch (error) {
        console.error("Error al crear el stand:", error);
        showToast("Error", "No se pudo conectar con el servidor.");
    }
});


// EDITAR

let idStandActual = null; // guarda cuál stand se está editando/eliminando

async function abrirEditar(id) {
    idStandActual = id;

    try {
        const response = await fetch(`${API_URL}/${id}`);
        const stand = await response.json();

        document.querySelector("#nombreStandEdit").value = stand.nombreStand;
        document.querySelector("#categoriaStandEdit").value = stand.categoriaStand;
        document.querySelector("#responsableStandEdit").value = stand.responsableStand;
        document.querySelector("#ubicacionStandEdit").value = stand.ubicacionStand;
        document.querySelector("#descripcionStandEdit").value = stand.descripcionStand || "";

        // Marca las actividades que ya estaban vinculadas
        const selectEdit = document.querySelector("#actividadesStandEdit");
        const vinculadas = (stand.actividadesStand || []).map(act => act._id);

        for (let i = 0; i < selectEdit.options.length; i++) {
            selectEdit.options[i].selected = vinculadas.includes(selectEdit.options[i].value);
        }

        openModal("modalEditarStand");

    } catch (error) {
        console.error("Error al cargar el stand:", error);
        showToast("Error", "No se pudo cargar el stand.");
    }
}

const btnGuardarEdicionStand = document.querySelector("#modalEditarStand .btn-primary");

btnGuardarEdicionStand.addEventListener("click", async (e) => {
    e.preventDefault();

    const cambios = {
        nombreStand: document.querySelector("#nombreStandEdit").value,
        categoriaStand: document.querySelector("#categoriaStandEdit").value,
        responsableStand: document.querySelector("#responsableStandEdit").value,
        ubicacionStand: document.querySelector("#ubicacionStandEdit").value,
        descripcionStand: document.querySelector("#descripcionStandEdit").value,
        actividadesStand: leerActividadesSeleccionadas("actividadesStandEdit")
    };

    try {
        const response = await fetch(`${API_URL}/${idStandActual}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cambios)
        });

        if (!response.ok) {
            const error = await response.json();
            showToast("Error", error.mensajeError);
            return;
        }

        closeModal("modalEditarStand");
        showToast("Cambios guardados", "El stand fue actualizado correctamente.");
        cargarStands();

    } catch (error) {
        console.error("Error al editar el stand:", error);
        showToast("Error", "No se pudo conectar con el servidor.");
    }
});

// ELIMINAR (DELETE /stand/:id)

function eliminarStand(id) {
    idStandActual = id;
    openModal("modalEliminarStand");
}

const btnConfirmarEliminar = document.querySelector("#modalEliminarStand .btn-primary");

btnConfirmarEliminar.addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_URL}/${idStandActual}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            const error = await response.json();
            showToast("Error", error.mensajeError);
            return;
        }

        closeModal("modalEliminarStand");
        showToast("Stand eliminado", "El stand se eliminó correctamente.");
        cargarStands();

    } catch (error) {
        console.error("Error al eliminar el stand:", error);
        showToast("Error", "No se pudo conectar con el servidor.");
    }
});
