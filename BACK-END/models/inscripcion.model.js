const mongoose = require("mongoose")

// Esquema "inscripción".
const schemaInscripcion = new mongoose.Schema({
// Informacion solicitada en el formlario 
    nombreCompleto: {

        type:String,
        required: true // CAMPO OBLIGATORIO
    },

    // Identificacion 
    identificacion: {

        type: String,
        required: true // CAMPO OBLIGATORIO
    },

    correo: {

        type:String,
        required: true // CAMPO OBLIGATORIO
    },

    telefono: {
        type:String,
        required: true // CAMPO OBLIGATORIO
    },

    carrera: {

        type:String,
        required: true // CAMPO OBLIGATORIO
    },

    
    actividadSeleccionada: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "actividad",
        required: true // CAMPO OBLIGATORIO
    },

    comentarioOpcional: {
        type: String,
        required: false // CAMPO NO OBLIGATORIO
    },
    
    fechaInscripcion: {
        type: Date,
        default: Date.now // CAMPO NO OBLIGATORIO, se asigna la fecha actual por defecto
    }

    

});

module.exports = mongoose.model("inscripcion",schemaInscripcion);
