const express = require("express");
const router = express.Router();
const Stand = require("../models/stand.model");

// Guardar un stand
router.post("/", async (req, res) => {
    try {
        const {
            nombreStand,
            categoriaStand,
            responsableStand,
            ubicacionStand,
            descripcionStand,
            actividadesStand
        } = req.body;

        if (
            !nombreStand ||
            !categoriaStand ||
            !responsableStand ||
            !ubicacionStand
        ) {
            return res.status(400).json({
                mensajeError: "El nombre, la categoría, el responsable y la ubicación son obligatorios"
            });
        }

        const nuevoStand = new Stand({
            nombreStand,
            categoriaStand,
            responsableStand,
            ubicacionStand,
            descripcionStand,
            actividadesStand
        });

        await nuevoStand.save();

        return res.status(201).json(nuevoStand);

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al guardar el stand",
            error: error.message
        });
    }

});


// Listar los stands

router.get("/", async (req, res) => {
    try {
        const { categoria } = req.query;

        const filtro = {};

        if (categoria) {
            filtro.categoriaStand = categoria;
        }

        // populate trae el nombre de las actividades vinculadas (RF-STA-05)
        const stands = await Stand.find(filtro)
            .sort({ nombreStand: 1 })
            .populate("actividadesStand", "nombreActividad");

        return res.status(200).json(stands);

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al obtener los stands",
            error: error.message
        });
    }
});

// Obtener un stand por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const stand = await Stand.findById(id)
            .populate("actividadesStand", "nombreActividad");

        if (!stand) {
            return res.status(404).json({
                mensajeError: "No se encontró ningún stand con ese ID"
            });
        }

        return res.status(200).json(stand);

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al obtener el stand",
            error: error.message
        });
    }
});

// Editar un stand
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombreStand,
            categoriaStand,
            responsableStand,
            ubicacionStand
        } = req.body;

        if (
            !nombreStand ||
            !categoriaStand ||
            !responsableStand ||
            !ubicacionStand
        ) {
            return res.status(400).json({
                mensajeError: "El nombre, la categoría, el responsable y la ubicación son obligatorios"
            });
        }

        const stand = await Stand.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!stand) {
            return res.status(404).json({
                mensajeError: "No se encontró ningún stand con ese ID"
            });
        }

        return res.status(200).json(stand);

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al actualizar el stand",
            error: error.message
        });
    }
});

// Eliminar un stand
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const stand = await Stand.findByIdAndDelete(id);

        if (!stand) {
            return res.status(404).json({
                mensajeError: "No se encontró ningún stand con ese ID"
            });
        }

        return res.status(200).json({
            mensaje: "Stand eliminado correctamente"
        });

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al eliminar el stand",
            error: error.message
        });
    }
});


module.exports = router;
