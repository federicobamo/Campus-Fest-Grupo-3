const express = require("express");
const router = express.Router();
const Actividad = require("../models/actividad.model");

// Agenda general del festival (RF-AGE-01 a RF-AGE-05)
// Lista todas las actividades ordenadas por fecha y hora.
// Filtros opcionales: ?fecha=aaaa-mm-dd y ?categoria=Cultural
router.get("/", async (req, res) => {
    try {
        const { fecha, categoria } = req.query;

        const filtro = {};

        if (categoria) {
            filtro.categoriaActividad = categoria;
        }

        if (fecha) {

            // Se valida que la fecha tenga un formato correcto
            const fechaConsulta = new Date(fecha);

            if (isNaN(fechaConsulta.getTime())) {
                return res.status(400).json({
                    mensajeError: "La fecha enviada no tiene un formato válido, se espera aaaa-mm-dd"
                });
            }

            // Se arma el rango del día completo en UTC, porque MongoDB guarda
            // las fechas en UTC. Si se usara la hora local, el filtro se
            // correría 6 horas al correr el servidor en Costa Rica.
            const inicioDia = new Date(fecha);
            inicioDia.setUTCHours(0, 0, 0, 0);

            const finDia = new Date(fecha);
            finDia.setUTCHours(23, 59, 59, 999);

            filtro.fechaActividad = { $gte: inicioDia, $lte: finDia };
        }

        // Orden por fecha y luego por hora (RF-AGE-01, RF-AGE-02)
        const actividades = await Actividad.find(filtro).sort({
            fechaActividad: 1,
            horaActividad: 1
        });

        return res.status(200).json(actividades);

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al obtener la agenda",
            error: error.message
        });
    }
});

module.exports = router;
