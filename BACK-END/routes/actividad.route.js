const express = require("express");
const router = express.Router();
const Actividad = require("../models/actividad.model");

// Guardar una actividad
router.post("/", async (req, res) => {
    try {

        const {
            nombreActividad,
            fechaActividad,
            horaActividad,
            lugarActividad,
            cupoMaximoActividad,
            estadoActividad,
            inscripcionesCierreActividad
        } = req.body;

        if (
            !nombreActividad ||
            !fechaActividad ||
            !horaActividad ||
            !lugarActividad ||
            !cupoMaximoActividad ||
            !estadoActividad ||
            !inscripcionesCierreActividad
        ) {
            return res.status(400).json({
                mensajeError: "Todos los campos son obligatorios para crear una actividad"
            });
        }

        const nuevaActividad = new Actividad(req.body);

        await nuevaActividad.save();

        return res.status(201).json(nuevaActividad);

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al guardar la actividad",
            error: error.message
        });
    }
});

module.exports = router;