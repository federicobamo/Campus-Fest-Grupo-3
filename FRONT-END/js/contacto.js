const API_URL = "http://localhost:3000/contacto";

const enviarContacto = async (e) => {

    e.preventDefault();

    const nuevoContacto = {
        nombreCompleto: document.querySelector("#nombrecompletoEdith").value,
        correo: document.querySelector("#correoelectronicoEdit").value,
        asuntoContacto: document.querySelector("#asuntocontactoEdith").value,
        mensaje: document.querySelector("#mensajeEdith").value,
        fechaContacto: new Date().toISOString(),
    };

    if ( // validando que los campos esten completos en el nuevo contacto
        !nuevoContacto.nombreCompleto ||
        !nuevoContacto.correo ||
        !nuevoContacto.asuntoContacto ||
        !nuevoContacto.mensaje
    ) {
        showToast("Error", "Por favor, complete todos los campos requeridos.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoContacto)
        });

        if (!response.ok) {
            const error = await response.json();
            showToast("Error", error.mensajeError);
            return;
        }

        showToast("Mensaje enviado", "Tu mensaje se envió correctamente.");
        document.querySelector("#formularioContacto").reset(); // resetear el formulario

    } catch (error) {
        console.error("Error al enviar el contacto:", error);
        showToast("Error", "No se pudo conectar con el servidor.");
    }
};
