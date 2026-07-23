const express = require("express");
const router = express.Router();
const Actividad = require("../models/actividad.model");

// Guardar una actividad
router.post("/", async (req, res) => {
    try {
        const {
            nombreActividad,
            categoriaActividad,
            descripcionActividad,
            requisitosActividad,
            fechaActividad,
            horaActividad,
            lugarActividad,
            esVirtual,
            enlaceActividad,
            cupoMaximoActividad
        } = req.body;

        if (
            !nombreActividad ||
            !categoriaActividad ||
            !descripcionActividad ||
            !fechaActividad ||
            !horaActividad ||
            !lugarActividad ||
            esVirtual === undefined || esVirtual === null ||
            (esVirtual === true && !enlaceActividad) ||
            cupoMaximoActividad === undefined || cupoMaximoActividad === null
        ) {
            return res.status(400).json({
                mensajeError: "Todos los campos son obligatorios para crear una actividad"
            });
        }

        const nuevaActividad = new Actividad({
            nombreActividad,
            categoriaActividad,
            descripcionActividad,
            requisitosActividad,
            fechaActividad,
            horaActividad,
            lugarActividad,
            esVirtual,
            enlaceActividad,
            cupoMaximoActividad
            // estadoActividad y cuposDisponiblesActividad se calculan solos
        });

        await nuevaActividad.save();

        return res.status(201).json(nuevaActividad);

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al guardar la actividad",
            error: error.message
        });
    }

 });


// listar las actividades 

router.get("/", async (req, res) => {
    try {
        const { categoria, estado, esVirtual, fecha } = req.query;

        const filtro = {};

        if (categoria) {
            filtro.categoriaActividad = categoria;
        }

        if (estado) {
            filtro.estadoActividad = estado;
        }

        if (esVirtual !== undefined) {
            filtro.esVirtual = esVirtual === "true";
        }

        if (fecha) {
            filtro.fechaActividad = new Date(fecha);
        }

        const actividades = await Actividad.find(filtro).sort({ fechaActividad: 1 });

        return res.status(200).json(actividades);

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al obtener las actividades",
            error: error.message
        });
    }
});

// Obtener una actividad por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const actividad = await Actividad.findById(id);

        if (!actividad) {
            return res.status(404).json({
                mensajeError: "No se encontró ninguna actividad con ese ID"
            });
        }

        return res.status(200).json(actividad);

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al obtener la actividad",
            error: error.message
        });
    }
});

// Editar una actividad
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const actividad = await Actividad.findById(id);

        if (!actividad) {
            return res.status(404).json({
                mensajeError: "No se encontró ninguna actividad con ese ID"
            });
        }

        const { cupoMaximoActividad } = req.body;

        if (cupoMaximoActividad !== undefined && cupoMaximoActividad !== actividad.cupoMaximoActividad) {
            const diferencia = cupoMaximoActividad - actividad.cupoMaximoActividad;
            actividad.cuposDisponiblesActividad += diferencia;
        }

        Object.assign(actividad, req.body);

        await actividad.save();

        return res.status(200).json(actividad);

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al actualizar la actividad",
            error: error.message
        });
    }
});

// Cancelar actividad
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const actividad = await Actividad.findByIdAndUpdate(
            id,
            { estadoActividad: "Cancelado" },
            { new: true, runValidators: true }
        );

        if (!actividad) {
            return res.status(404).json({
                mensajeError: "No se encontró ninguna actividad con ese ID"
            });
        }

        return res.status(200).json({
            mensaje: "Actividad cancelada correctamente",
            actividad
        });

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al cancelar la actividad",
            error: error.message
        });
    }
});




module.exports = router;