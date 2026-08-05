// Detalle de actividad (RF-FE-03)
// Muestra: nombre, descripción completa, categoría, fecha y hora, lugar,
// cupo máximo, requisitos de participación y botón de inscripción.
// El id de la actividad llega por query string: detalle-actividad.html?id=...

const API_URL_DETALLE = "http://localhost:3000/actividad";

const MESES_DET = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];

document.addEventListener("DOMContentLoaded", cargarDetalle);

async function cargarDetalle() {
    const contenedor = document.querySelector("#contenedorDetalle");
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) {
        contenedor.innerHTML = `
            <p class="desc">No se indicó ninguna actividad.
            <a href="actividades.html">Volver al catálogo</a>.</p>`;
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL_DETALLE}/${id}`);

        if (respuesta.status === 404) {
            contenedor.innerHTML = `
                <p class="desc">No se encontró la actividad solicitada.
                <a href="actividades.html">Volver al catálogo</a>.</p>`;
            return;
        }
        if (!respuesta.ok) throw new Error("La API respondió con un error");

        const act = await respuesta.json();
        pintarDetalle(contenedor, act);

    } catch (error) {
        console.error("Error al cargar el detalle:", error);
        contenedor.innerHTML = `<p class="desc">No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.</p>`;
    }
}

function pintarDetalle(contenedor, act) {
    const fecha = formatearFechaDetalle(act.fechaActividad);
    const inscribible = act.estadoActividad === "Disponible";
    const cupos = act.cuposDisponiblesActividad ?? act.cupoMaximoActividad;

    contenedor.innerHTML = `
    <div class="form-card">
        <span class="activity-card-category">${act.categoriaActividad}</span>
        <h2 style="margin: 12px 0 6px;">${act.nombreActividad}</h2>
        ${badgeEstadoDetalle(act)}

        <p style="margin: 18px 0;">${act.descripcionActividad}</p>

        <div class="activity-card-meta" style="margin-bottom: 18px;">
            <div class="activity-card-meta-item">📅 <strong>Fecha y hora:</strong> ${fecha} · ${act.horaActividad}</div>
            <div class="activity-card-meta-item">📍 <strong>Lugar:</strong> ${act.esVirtual ? `Virtual — <a href="${act.enlaceActividad}" target="_blank" rel="noopener">enlace de la sesión</a>` : act.lugarActividad}</div>
            <div class="activity-card-meta-item">👥 <strong>Cupo máximo:</strong> ${act.cupoMaximoActividad} personas (${cupos} disponibles)</div>
            <div class="activity-card-meta-item">📋 <strong>Requisitos de participación:</strong> ${act.requisitosActividad ? act.requisitosActividad : "Sin requisitos especiales"}</div>
        </div>

        ${inscribible
            ? `<a href="inscripcion.html" class="btn btn-acento">Inscribirme a esta actividad</a>`
            : `<button class="btn btn-secondary" disabled>Inscripción no disponible (${act.estadoActividad.toLowerCase()})</button>`}
        <a href="actividades.html" class="btn btn-secondary" style="margin-left: 10px;">Volver al catálogo</a>
    </div>`;
}

function badgeEstadoDetalle(act) {
    const clases = {
        "Disponible": "status-disponible",
        "Lleno": "status-lleno",
        "Cancelado": "status-cancelado"
    };
    return `<span class="status-badge ${clases[act.estadoActividad] || "status-disponible"}">
        <span class="status-dot"></span>${act.estadoActividad}</span>`;
}

function formatearFechaDetalle(fechaISO) {
    const fecha = new Date(fechaISO);
    if (isNaN(fecha.getTime())) return "";
    return fecha.getUTCDate() + " de " + MESES_DET[fecha.getUTCMonth()] + " de " + fecha.getUTCFullYear();
}
