const API_URL = "http://localhost:3000/actividad";
 
document.addEventListener("DOMContentLoaded", cargarDashboard);
 
async function cargarDashboard() {
    try {
        const response = await fetch(API_URL);
        const actividades = await response.json();
 
        pintarStatsActividades(actividades);
        pintarTablaDemanda(actividades);
 
    } catch (error) {
        console.error("Error al cargar el dashboard:", error);
    }
}
 
function pintarStatsActividades(actividades) {
    const total = actividades.length;
    const disponibles = actividades.filter(a => a.estadoActividad === "Disponible").length;
    const llenas = actividades.filter(a => a.estadoActividad === "Lleno").length;
    const canceladas = actividades.filter(a => a.estadoActividad === "Cancelado").length;
 
    const cupoTotal = actividades.reduce((suma, a) => suma + a.cupoMaximoActividad, 0);
    const cupoDisponible = actividades.reduce((suma, a) => suma + a.cuposDisponiblesActividad, 0);
 
    // Tarjeta "Actividades publicadas" (1er .stat-card)
    document.querySelector("#statActividadesValor").textContent = total;
    document.querySelector("#statActividadesTrend").textContent =
        `${disponibles} disponibles · ${llenas} llenas · ${canceladas} cancelada(s)`;
 
    // Tarjeta "Cupos disponibles" (4to .stat-card)
    document.querySelector("#statCupoValor").textContent = cupoDisponible;
    document.querySelector("#statCupoTrend").textContent = `de ${cupoTotal} cupos totales`;
}
 
function pintarTablaDemanda(actividades) {
    // Ordena por porcentaje de ocupación (cupo lleno primero) y toma las 4 con más demanda
    const conOcupacion = actividades
        .filter(a => a.estadoActividad !== "Cancelado")
        .map(a => ({
            ...a,
            inscritos: a.cupoMaximoActividad - a.cuposDisponiblesActividad
        }))
        .sort((a, b) => (b.inscritos / b.cupoMaximoActividad) - (a.inscritos / a.cupoMaximoActividad))
        .slice(0, 4);
 
    const tbody = document.querySelector("#tablaDemandaBody");
    tbody.innerHTML = "";
 
    conOcupacion.forEach(act => {
        const fila = document.createElement("tr");
        const fecha = new Date(act.fechaActividad).toLocaleDateString("es-CR");
        const claseEstado = "status-" + act.estadoActividad.toLowerCase();
 
        fila.innerHTML = `
            <td>${act.nombreActividad}</td>
            <td>${act.categoriaActividad}</td>
            <td>${fecha} · ${act.horaActividad}</td>
            <td>${act.inscritos} / ${act.cupoMaximoActividad}</td>
            <td><span class="status-badge ${claseEstado}"><span class="status-dot"></span> ${act.estadoActividad}</span></td>
        `;
 
        tbody.appendChild(fila);
    });
}