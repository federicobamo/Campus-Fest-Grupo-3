const mongoose = require("mongoose")

// Esquema  de "contacto".
const schemaContacto = new mongoose.Schema({
// informacion que guardara del formulario 
    
nombreCompleto: { 

        type: String,
        required: true // CAMPO OBLIGATORIO
    },

    correo: {

        type: String,
        required: true // CAMPO OBLIGATORIO
    },

    asuntoContacto: { // Filtro mostrando las opciones 

        type: String,
        enum: ["Actividad", "Inscripciones", "Solicitud de cancelacion de inscripcion", "Stands", " Soporte Tecnico"], 
        required: true // CAMPO OBLIGATORIO
    },
    mensaje: {
        type: String,
        required: true // CAMPO OBLIGATORIO
    },

    fechaContacto: {
        type: String,
        required: true // CAMPO OBLIGATORIO
    }


     

});

    module.exports = mongoose.model("Contacto",schemaContacto); 
