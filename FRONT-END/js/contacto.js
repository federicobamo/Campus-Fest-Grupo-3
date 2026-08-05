// Página de contacto (RF-FE-07)
// El formulario de consulta es VISUAL (Etapa 1): valida los campos con
// JavaScript y muestra la confirmación en pantalla mediante el toast,
// pero no envía datos a ningún servidor (el envío real queda para Etapa 2).

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("#formularioConsulta");
    if (formulario) {
        formulario.addEventListener("submit", enviarConsulta);
    }
});

function enviarConsulta(e) {
    e.preventDefault();

    const nombre = document.querySelector("#nombreConsulta").value.trim();
    const correo = document.querySelector("#correoConsulta").value.trim();
    const asunto = document.querySelector("#asuntoConsulta").value;
    const mensaje = document.querySelector("#mensajeConsulta").value.trim();

    // Campos obligatorios
    if (!nombre || !correo || !asunto || !mensaje) {
        showToast("Error", "Por favor, complete todos los campos de la consulta.");
        return;
    }

    // Formato básico de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(correo)) {
        showToast("Error", "El correo ingresado no tiene un formato válido.");
        return;
    }

    // Confirmación en pantalla (simulada — Etapa 1)
    showToast("Consulta enviada", "Gracias, el comité organizador te responderá pronto.");
    document.querySelector("#formularioConsulta").reset();
}
