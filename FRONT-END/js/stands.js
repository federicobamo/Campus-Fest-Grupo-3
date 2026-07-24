const API_URL = "http://localhost:3000/stand";

// Ícono que se muestra en la tarjeta según la categoría del stand
const ICONOS_STAND = {
    "Académico": "📚",
    "Deportivo": "⚽",
    "Cultural": "🎭",
    "Tecnológico": "💻",
    "Emprendimiento": "💡"
};

// Se ejecuta apenas carga la página
document.addEventListener("DOMContentLoaded", () => {
    cargarStands();

    // Cada vez que cambia el filtro de categoría se vuelve a consultar la API
    const filtroCategoria = document.querySelector(".filter-bar select");
    filtroCategoria.addEventListener("change", cargarStands);
});

// LISTAR (GET /stand)

async function cargarStands() {
    const grid = document.querySelector(".cards-grid");

    try {
        const categoria = document.querySelector(".filter-bar select").value;

        let url = API_URL;

        if (categoria) {
            url = `${API_URL}?categoria=${encodeURIComponent(categoria)}`;
        }

        const response = await fetch(url);
        const stands = await response.json();

        renderizarStands(stands);

    } catch (error) {
        console.error("Error al cargar los stands:", error);
        grid.innerHTML = `<p class="desc">No se pudo conectar con el servidor. Revisá que el backend esté corriendo.</p>`;
    }
}

function renderizarStands(stands) {
    const grid = document.querySelector(".cards-grid");
    grid.innerHTML = ""; // limpia las tarjetas quemadas del HTML

    if (stands.length === 0) {
        grid.innerHTML = `<p class="desc">No hay stands registrados en esta categoría.</p>`;
        return;
    }

    stands.forEach(stand => {
        const icono = ICONOS_STAND[stand.categoriaStand] || "🎪";

        const tarjeta = document.createElement("div");
        tarjeta.className = "stand-card";

        tarjeta.innerHTML = `
            <div class="stand-card-header">
                <div class="stand-icon">${icono}</div>
                <h3>${stand.nombreStand}</h3>
            </div>
            <span class="activity-card-category" style="align-self: flex-start;">${stand.categoriaStand}</span>
            <p class="desc">${stand.descripcionStand || "Sin descripción."}</p>
            <div class="stand-card-meta">
                <span>👤 Responsable: ${stand.responsableStand}</span>
                <span>📍 Ubicación: ${stand.ubicacionStand}</span>
            </div>
        `;

        grid.appendChild(tarjeta);
    });
}
