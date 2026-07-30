const API_URL = "http://localhost:3000/inscripcion";
const API_ACTIVIDADES = "http://localhost:3000/actividad";

function esActividadDisponible(actividad) {
    const cupos = actividad.cuposDisponiblesActividad ?? actividad.cupoMaximoActividad;// ??cuposDisponiblesActividad si es nulo , en ese caso se toma el cupoMaximoActividad
    const ahora = new Date();
    const fecha = new Date(actividad.fechaActividad);
    const diferencia = fecha - ahora;
    const HORAS_36_MS = 36 * 60 * 60 * 1000;

    return actividad.estadoActividad !== "Cancelado" &&
        cupos > 0 &&
        diferencia > HORAS_36_MS;
}

// Se ejecuta apenas carga la página ( Para cargar las actividades disponibles en el select de la inscripción)
document.addEventListener("DOMContentLoaded", () => {

    llenarSelectActividades();


});
// Buscar la informacion de la actividade en el backend y llenar el select con las actividades disponibles
async function llenarSelectActividades() {
    try {
        const response = await fetch(API_ACTIVIDADES);
        const actividades = await response.json();


        const selectActividad = document.querySelector("#selectActividad");
        selectActividad.innerHTML = '<option value="">Seleccione una actividad</option>'; // evita duplicar opciones si se vuelve a llamar

        // Llenar el select con las actividades disponibles
        actividades.forEach(act => {
            if (esActividadDisponible(act)) {
                const opcionEdit = document.createElement("option");
                opcionEdit.value = act._id;
                opcionEdit.textContent = act.nombreActividad;
                selectActividad.appendChild(opcionEdit);
            }



        });



    } catch (error) {
        // Si el módulo de actividades no responde, el combo queda solo con "Ninguna"
        // y la pantalla sigue funcionando
        console.error("No se pudieron cargar las actividades para el combo:", error);
    }

}
// funcion 
const enviarFormulario = async (e) => {

    e.preventDefault();

    const nuevaInscripcion = {
        nombreCompleto: document.querySelector("#nombrecompletoEdit").value,
        indentificacion: document.querySelector("#identificacionEdit").value,
        correo: document.querySelector("#correoelectronicoEdit").value,
        telefono: document.querySelector("#telefonoEdit").value,
        carrera: document.querySelector("#carreraEdit").value,
        comentarioOpcional: document.querySelector("#comentarioEdit").value,
        actividadSeleccionada: document.querySelector("#selectActividad").value,
    };

    if ( // validando que los campos  esten completos en la nueva inscripcion
        !nuevaInscripcion.nombreCompleto ||
        !nuevaInscripcion.indentificacion ||
        !nuevaInscripcion.correo ||
        !nuevaInscripcion.telefono ||
        !nuevaInscripcion.carrera ||
        !nuevaInscripcion.actividadSeleccionada
    ) {
        showToast("Error", "Por favor, complete todos los campos requeridos.");
        return;
    }


    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaInscripcion)
        });

        if (!response.ok) {
            const error = await response.json();
            showToast("Error", error.mensajeError);
            return;
        }
        llenarSelectActividades();



        showToast("Inscripción realizada", "Su inscripción se ha guardado correctamente.");
        document.querySelector("#formatoInscripciones").reset(); // resetear el formulario 

    } catch (error) {
        console.error("Error al crear el stand:", error);
        showToast("Error", "No se pudo conectar con el servidor.");
    }
};


