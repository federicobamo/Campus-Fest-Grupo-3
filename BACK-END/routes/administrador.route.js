
const express = require("express");
const router = express.Router();
 
const DOMINIO_INSTITUCIONAL = "@ucenfotec.ac.cr";
 
// Login de administrador — sin contraseña, solo valida el dominio institucional
router.post("/login", async (req, res) => {
    try {
        const { correo } = req.body;
 
        if (!correo) {
            return res.status(400).json({
                mensajeError: "El correo es obligatorio"
            });
        }
 
        const correoNormalizado = correo.trim().toLowerCase();
 
        if (!correoNormalizado.endsWith(DOMINIO_INSTITUCIONAL)) {
            return res.status(401).json({
                mensajeError: "El correo debe ser institucional (@ucenfotec.ac.cr)"
            });
        }
 
        return res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            correo: correoNormalizado
        });
 
    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al iniciar sesión",
            error: error.message
        });
    }
});
 
module.exports = router;
 