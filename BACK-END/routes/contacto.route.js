const express = require("express");
const router = express.Router();
const Contacto = require("../models/contacto.model"); // conexion con el modelo de inscripciones 

// Guardar 
router.post("/", async (req, res) => {
    try { // intenta o error
        const {
            nombreCompleto,
            correo,
            asuntoContacto,
            mensaje,
            fechaContacto,

        } = req.body;

        if ( // validacion 
            !nombreCompleto ||
            !correo ||
            !asuntoContacto ||
            !mensaje ||
            !fechaContacto
        ) {
            return res.status(400).json({ // retorno de error 
                mensajeError: "Todo los campos son obligatorios"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]{2,}$/; // formato de email por defecto 

        if (
            !emailRegex.test(correo)
        ) {
            return res.status(400).json({
                mensajeError: "El correo no es válido" // retorno de error no valido
            });
        }
        const correoNormalizado = correo.trim().toLowerCase(); // validar que el correo tenga el formato correcto 

// Crear nuevo contacto ya validado
const nuevoContacto = new Contacto({
    nombreCompleto,
    correo: correoNormalizado,
    asuntoContacto,
    mensaje,
    fechaContacto

});

await nuevoContacto.save(); // Para que se guarde en la base de datos de contato

return  res.status(201).json(nuevoContacto) // responde con notificacion de exito 



    }
    catch (error){ // si algo falla en el try 
        return res.status(500).json({
        mensajeError:"Error al guardar el contacto",
        error: error.message

        });
    }


});

//  consultar Lista de mensajes de contacto

router.get("/", async (req, res) => {
    try { 

        const listaMensajes = await Contacto.find() // buscar contactos
            .sort({ nombreCompleto: 1, asuntoContacto: 1, fechaContacto: -1 }); // ordenar en forma ascendente y desendente  la lista: nombre,asunto,fecha

        return res.status(200).json(listaMensajes); // retornar la informacion 

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al obtener lista",
            error: error.message
        });
    }
});

// Borrar un mensaje de contacto
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params; // solicitar el id

        const contacto = await Contacto.findByIdAndDelete(id); // buscar y borrar el contacto

        if (!contacto) { // error id no encontrado
            return res.status(404).json({
                mensajeError: "No se encontró ningún mensaje con ese ID"
            });
        }

        return res.status(200).json({ // responde con exito
            mensaje: "Mensaje de contacto eliminado correctamente"
        });

    } catch (error) { // en caso algo falle con el try
        return res.status(500).json({
            mensajeError: "Error al eliminar el mensaje de contacto",
            error: error.message
        });
    }
});

module.exports = router; // para poder usarlo con el index
