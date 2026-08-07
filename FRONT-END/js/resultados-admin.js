// Gestión de resultados y reconocimientos (RF-ADM-05 · SCRUM-29)
// Versión VISUAL (Etapa 1): los resultados se manejan en memoria durante la
// sesión. La persistencia real en MongoDB corresponde a la Etapa 2.

let resultados = [
    { actividad: "Torneo de fútbol 5", descripcion: "Primer lugar del torneo", ganador: "Equipo Los Halcones" },
    { actividad: "Hackathon CampusFest", descripcion: "Proyecto más innovador", ganador: "Equipo CodeCrafters" }
];

document.addEventListener("DOMContentLoaded", pintarResultados);

function pintarResultados() {
    const tabla = document.querySelector("#tablaResultados");

    if (resultados.length === 0) {
        tabla.innerHTML = `<tr><td colspan="4" style="padding:10px;">Aún no hay resultados registrados.</td></tr>`;
        return;
    }

    tabla.innerHTML = resultados.map((r, i) => `
        <tr style="border-top: 1px solid var(--border-color);">
            <td style="padding:10px;">${r.actividad}</td>
            <td style="padding:10px;">${r.descripcion}</td>
            <td style="padding:10px;">${r.ganador}</td>
            <td style="padding:10px;">
                <button class="btn btn-secondary btn-sm" onclick="eliminarResultado(${i})">Eliminar</button>
            </td>
        </tr>`).join("");
}

function guardarResultado() {
    const actividad = document.querySelector("#actividadResultado").value.trim();
    const descripcion = document.querySelector("#descripcionResultado").value.trim();
    const ganador = document.querySelector("#ganadorResultado").value.trim();

    if (!actividad || !descripcion || !ganador) {
        showToast("Error", "Todos los campos son obligatorios.");
        return;
    }

    resultados.push({ actividad, descripcion, ganador });
    pintarResultados();
    closeModal("modalNuevoResultado");
    showToast("Resultado registrado", "El resultado se agregó correctamente.");

    document.querySelector("#actividadResultado").value = "";
    document.querySelector("#descripcionResultado").value = "";
    document.querySelector("#ganadorResultado").value = "";
}

function eliminarResultado(indice) {
    resultados.splice(indice, 1);
    pintarResultados();
    showToast("Resultado eliminado", "El registro se eliminó correctamente.");
}
