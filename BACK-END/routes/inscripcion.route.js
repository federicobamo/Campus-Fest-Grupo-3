const express = require("express");
const router = express.Router();
const Inscripcion = require("../models/inscripcion.model"); // conexion con el modelo de inscripciones 
const Actividad = require("../models/actividad.model"); // conexion con el modelo de actividades
const DOMINIO_INSTITUCIONAL = "@ucenfotec.ac.cr"; // formato del correo institucional 


// Guardar 
router.post("/", async (req, res) => {
    try { // intenta o error
        const {
            nombreCompleto,
            indentificacion,
            correo,
            telefono,
            carrera,
            actividadSeleccionada,
            comentarioOpcional
        } = req.body;

        if ( // validacion 
            !nombreCompleto ||
            !indentificacion ||
            !correo ||
            !telefono ||
            !carrera ||
            !actividadSeleccionada
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

        if (correoNormalizado.endsWith(DOMINIO_INSTITUCIONAL)) { // correo institucional
            return res.status(401).json({
                mensajeError: "Un administrador no puede registrarse en la actividad"
            });
        }
        const actividad = await Actividad.findById(actividadSeleccionada); // buscar por id la actividadselecionada por el usuario

        if (!actividad) {
            return res.status(404).json({
                mensajeError: "No se encontró ninguna actividad seleccionada"
            }); // error de actividad no encontrada 
        }

        // RF03: Cerrar inscripción 36 horas antes del inicio de la actividad
        const ahora = new Date();

        const horasRestantes = (actividad.fechaActividad - ahora) / (1000 * 60 * 60);// para horas

        // Evalúa a true si faltan entre 0 y 36 horas
        if (horasRestantes > 0 && horasRestantes <= 36) {
            console.log("Faltan 36 horas o menos para la actividad");
            return res.status(400).json({
                mensajeError: "La inscripción está cerrada, faltan 36 horas o menos para la actividad"
            });
        }
        
        //RF04: inscripciones cuando el cupo esté lleno.
        const cuposDisponibles = actividad.cuposDisponiblesActividad ?? actividad.cupoMaximoActividad; // ?? nulo 

        if (cuposDisponibles <= 0) { // validacion de campos disponibles 
            return res.status(400).json({
                mensajeError: "La actividad ya no tiene cupos disponibles"
            });
        }
        //RF05: El sistema debe impedir que un estudiante se inscriba dos veces 
        const inscripcionExistente = await Inscripcion.findOne({ indentificacion, actividadSeleccionada }); // busqueda de inscripcion por idetificacion y la actividad selecionada
        if (inscripcionExistente) {
            return res.status(400).json({
                mensajeError: "El estudiante ya está inscrito en esta actividad" // no se permite inscripciones con identificacion duplicada 
            });
        }


        // nueva inscripcion 
        const nuevaInscripcion = new Inscripcion({ // solicitar los datos requeridos 
            nombreCompleto,
            indentificacion,
            correo: correoNormalizado,
            telefono,
            carrera,
            actividadSeleccionada,
            comentarioOpcional
            //Aca no fue necesario agregar fechaInscripcion porque ya tiene un valor por defecto en el modelo
        });

        await nuevaInscripcion.save(); // guardar la informacion 


        // Se descuenta el cupo y, si se lleno, se cambia el estado de la actividad
        actividad.cuposDisponiblesActividad = cuposDisponibles - 1;

        if (actividad.cuposDisponiblesActividad === 0) { // Validacion : cupos disponibles igual a 0 (lleno)
            actividad.estadoActividad = "Lleno";
        }

        await actividad.save(); // guardar actividad selecionada 

        return res.status(201).json(nuevaInscripcion); //  nueva inscripcion con sucesso 


    } catch (error) { // error al interntar la funcion 
        return res.status(500).json({
            mensajeError: "Error al guardar la inscripción",
            error: error.message
        });
    }

});


//  consultar Lista de inscripciones 

router.get("/", async (req, res) => {
    try { 

        const inscripciones = await Inscripcion.find() // buscar inscripcion 
            .sort({ nombreCompleto: 1 }) // ordenar en forma ascendente A-z
            .populate("actividadSeleccionada", "nombreActividad"); // populate trae el nombre y no el id de las actividades vinculadas 

        return res.status(200).json(inscripciones); // retornar la informacion de la inscripcion 

    } catch (error) {
        return res.status(500).json({
            mensajeError: "Error al obtener las inscripciones",
            error: error.message
        });
    }
});




// Eliminar una inscripción 
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;  // solicitar el id 

        const inscripcion = await Inscripcion.findByIdAndDelete(id);  // buscar inscripcion 

        if (!inscripcion) { // error  id no encontrado 
            return res.status(404).json({
                mensajeError: "No se encontró ningún inscripcion con ese ID"
            });
        }

        const actividad = await Actividad.findById(inscripcion.actividadSeleccionada); //  volver a dejar el espacio disponible para una nueva inscripcion 

        if (actividad) {
            actividad.cuposDisponiblesActividad += 1;
            if (actividad.estadoActividad === "Lleno") {
                actividad.estadoActividad = "Disponible";
            }
            await actividad.save(); // guardar nuevo cupo para la actividad 
        }



        return res.status(200).json({ // responde con exito 
            mensaje: "Inscripción eliminada correctamente"
        });

    } catch (error) { // en caso algo falle con el try
        return res.status(500).json({
            mensajeError: "Error al eliminar la inscripción",
            error: error.message
        });
    }
});


module.exports = router; // conexion index 
