// Catálogo público de actividades (RF-FE-02)
// Cada tarjeta muestra: nombre, categoría, fecha, hora, lugar,
// cupo disponible y botón "Ver detalle" hacia detalle-actividad.html?id=...

const API_URL_ACTIVIDADES = "http://localhost:3000/actividad";

const MESES_ACT = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];

document.addEventListener("DOMContentLoaded", () => {
    cargarActividades();
    document.querySelector("#filtroCategoria").addEventListener("change", cargarActividades);
    document.querySelector("#filtroEstado").addEventListener("change", cargarActividades);
});

async function cargarActividades() {
    const contenedor = document.querySelector("#contenedorActividades");
    const categoria = document.querySelector("#filtroCategoria").value;
    const estado = document.querySelector("#filtroEstado").value;

    try {
        const params = new URLSearchParams();
        if (categoria) params.append("categoria", categoria);
        if (estado) params.append("estado", estado);

        const url = params.toString()
            ? `${API_URL_ACTIVIDADES}?${params.toString()}`
            : API_URL_ACTIVIDADES;

        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("La API respondió con un error");

        const actividades = await respuesta.json();

        if (actividades.length === 0) {
            contenedor.innerHTML = `<p class="desc">No hay actividades que coincidan con los filtros seleccionados.</p>`;
            return;
        }

        contenedor.innerHTML = actividades.map(act => pintarTarjeta(act)).join("");

    } catch (error) {
        console.error("Error al cargar actividades:", error);
        contenedor.innerHTML = `<p class="desc">No se pudo conectar con el servidor. Verifique que el backend esté en ejecución.</p>`;
    }
}

function pintarTarjeta(act) {
    const fecha = formatearFechaCatalogo(act.fechaActividad);
    return `
    <article class="activity-card">
        <div class="activity-card-image">${iconoCategoriaCatalogo(act.categoriaActividad)}</div>
        <div class="activity-card-body">
            <span class="activity-card-category">${act.categoriaActividad}</span>
            <h3>${act.nombreActividad}</h3>
            <div class="activity-card-meta">
                <div class="activity-card-meta-item">📅 ${fecha} · ${act.horaActividad}</div>
                <div class="activity-card-meta-item">📍 ${act.esVirtual ? "Virtual" : act.lugarActividad}</div>
            </div>
            <div class="activity-card-footer">
                ${badgeCupoCatalogo(act)}
                <a href="detalle-actividad.html?id=${act._id}" class="btn btn-secondary btn-sm">Ver detalle</a>
            </div>
        </div>
    </article>`;
}

function badgeCupoCatalogo(act) {
    if (act.estadoActividad === "Lleno") {
        return `<span class="cupo-badge cupo-lleno">Cupo lleno</span>`;
    }
    if (act.estadoActividad === "Cancelado") {
        return `<span class="cupo-badge cupo-cancelado">Cancelada</span>`;
    }
    const cupos = act.cuposDisponiblesActividad ?? act.cupoMaximoActividad;
    return `<span class="cupo-badge cupo-disponible">${cupos} cupos disponibles</span>`;
}

function formatearFechaCatalogo(fechaISO) {
    const fecha = new Date(fechaISO);
    if (isNaN(fecha.getTime())) return "";
    return fecha.getUTCDate() + " de " + MESES_ACT[fecha.getUTCMonth()];
}

function iconoCategoriaCatalogo(categoria) {
    const iconos = {
        "Cultural": "🎭",
        "Deportiva": "⚽",
        "Tecnológica": "💻",
        "Artística": "🎨",
        "Gastronómica": "🍽️",
        "Recreativa": "🎯"
    };
    return iconos[categoria] || "🎪";
}
