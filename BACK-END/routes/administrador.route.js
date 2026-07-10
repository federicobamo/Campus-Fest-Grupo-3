const express = require("express");
const router = express.Router();
const Certificacion = require("../models/administrador.model");

// Guardar un administrador

router.post("/", async (req, res) => {
    try{ 

        const {correoAdministrador, contrasenaAdministrador} = req.body; 

        // Validar los campos obligatorios 

        if (!correoAdministrador || !contrasenaAdministrador) {
            return res.status(400).json({mensajeError: "El correo y la contraseña son obligatorios"});
        }
        

    } catch (error) {
        return res.status(400).json ({mensajeError: "Error al validar los datos ingresados" });

    }
});

module.exports = router; 

