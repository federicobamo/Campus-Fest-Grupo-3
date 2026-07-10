const mongoose = require("mongoose")

// Esquema "Actividad"
const schemaActividad = new mongoose.Schema({

    nombreActividad: {

        type:String,
        required: true // CAMPO OBLIGATORIO
    }, 

    fechaActividad: { 

        type:Date,
        required: true // CAMPO OBLOGATORIO
    },

    horaActividad: {

        type:String,
        required: true // CAMPO OBLIGATORIO
    },

    lugarActividad: { 
        type:String, 
        required: true // CAMPO OBLIGATORIO 
    }, 

    cupoMaximoActividad: { 
        type:Number, 
        required: true // CAMPO OBLIGATORIO
    }, 
        
    estadoActividad: {
        type: String,
        enum: ["Disponible", "No disponible"],
        default: "Disponible",
        required: true // CAMPO OBLIGATORIO 
    },

    inscripcionesCierreActividad: {
        type: Date,
        required: true // CAMPO OBLIGATARIO

    }

});

module.exports = mongoose.model("actividad",schemaActividad);

