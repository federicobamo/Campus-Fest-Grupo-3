const API_URL = "http://localhost:3000/administrador";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#formLogin");
    form.addEventListener("submit", iniciarSesion);
});

async function iniciarSesion(e) {
    e.preventDefault();

    const correo = document.querySelector("#correoLogin").value;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ correo })
        });

        const data = await response.json();

        if (!response.ok) {
            mostrarError(data.mensajeError);
            return;
        }

        // Guarda la sesión en el navegador (dura mientras la pestaña esté abierta)
        sessionStorage.setItem("adminCorreo", data.correo);

        window.location.href = "admin-dashboard.html";

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        mostrarError("No se pudo conectar con el servidor.");
    }
}

function mostrarError(mensaje) {
    const errorBox = document.querySelector("#loginError");
    errorBox.textContent = mensaje;
    errorBox.style.display = "block";
}