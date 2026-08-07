// Página de inicio (RF-FE-01)
// Carga las 3 actividades destacadas desde la API de actividades.
// Si el backend no está levantado, se muestran 3 actividades de ejemplo
// para que el prototipo visual (Etapa 1) siga funcionando.

const API_ACTIVIDADES = "http://localhost:3000/actividad";

const MESES_INICIO = ["enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "setiembre", "octubre", "noviembre", "diciembre"];

// Actividades de respaldo (mismo formato que devuelve la API)
const DESTACADAS_RESPALDO = [
    {
        nombreActividad: "Torneo de fútbol 5",
        categoriaActividad: "Deportiva",
        fechaActividad: "2026-10-15T00:00:00.000Z",
        horaActividad: "10:00",
        lugarActividad: "Cancha principal",
        estadoActividad: "Disponible",
        cuposDisponiblesActividad: 12
    },
    {
        nombreActividad: "Hackathon CampusFest",
        categoriaActividad: "Tecnológica",
        fechaActividad: "2026-10-16T00:00:00.000Z",
        horaActividad: "09:00",
        lugarActividad: "Laboratorio de innovación",
        estadoActividad: "Disponible",
        cuposDisponiblesActividad: 8
    },
    {
        nombreActividad: "Festival gastronómico",
        categoriaActividad: "Gastronómica",
        fechaActividad: "2026-10-17T00:00:00.000Z",
        horaActividad: "12:00",
        lugarActividad: "Plaza central",
        estadoActividad: "Disponible",
        cuposDisponiblesActividad: 25
    }
];

document.addEventListener("DOMContentLoaded", cargarDestacadas);

async function cargarDestacadas() {
    const contenedor = document.querySelector("#contenedorDestacadas");

    try {
        const respuesta = await fetch(API_ACTIVIDADES);

        if (!respuesta.ok) {
            throw new Error("La API respondió con un error");
        }

        const actividades = await respuesta.json();

        // Se priorizan las actividades disponibles y se toman las 3 primeras
        const destacadas = actividades
            .filter(act => act.estadoActividad !== "Cancelado")
            .slice(0, 3);

        if (destacadas.length === 0) {
            pintarDestacadas(contenedor, DESTACADAS_RESPALDO);
            return;
        }

        pintarDestacadas(contenedor, destacadas);

    } catch (error) {
        // Etapa 1 (visual): si el backend está apagado se muestran ejemplos
        console.warn("No se pudo conectar con la API, se muestran actividades de ejemplo:", error.message);
        pintarDestacadas(contenedor, DESTACADAS_RESPALDO);
    }
}

function pintarDestacadas(contenedor, actividades) {
    contenedor.innerHTML = actividades.map(act => {
        const fecha = formatearFechaInicio(act.fechaActividad);
        const badge = badgeCupo(act);
        const icono = iconoCategoria(act.categoriaActividad);

        return `
        <article class="activity-card">
            <div class="activity-card-image">${icono}</div>
            <div class="activity-card-body">
                <span class="activity-card-category">${act.categoriaActividad}</span>
                <h3>${act.nombreActividad}</h3>
                <div class="activity-card-meta">
                    <div class="activity-card-meta-item">📅 ${fecha} · ${act.horaActividad}</div>
                    <div class="activity-card-meta-item">📍 ${act.lugarActividad}</div>
                </div>
                <div class="activity-card-footer">
                    ${badge}
                    <a href="actividades.html" class="btn btn-secondary btn-sm">Ver detalle</a>
                </div>
            </div>
        </article>`;
    }).join("");
}

function formatearFechaInicio(fechaISO) {
    const fecha = new Date(fechaISO);
    if (isNaN(fecha.getTime())) return "";
    return fecha.getUTCDate() + " de " + MESES_INICIO[fecha.getUTCMonth()];
}

function badgeCupo(act) {
    if (act.estadoActividad === "Lleno") {
        return `<span class="cupo-badge cupo-lleno">Cupo lleno</span>`;
    }
    if (act.estadoActividad === "Cancelado") {
        return `<span class="cupo-badge cupo-cancelado">Cancelada</span>`;
    }
    const cupos = act.cuposDisponiblesActividad ?? act.cupoMaximoActividad ?? "";
    return `<span class="cupo-badge cupo-disponible">${cupos !== "" ? cupos + " cupos disponibles" : "Disponible"}</span>`;
}

function iconoCategoria(categoria) {
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
