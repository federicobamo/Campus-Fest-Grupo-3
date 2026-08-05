const mongoose = require("mongoose")

// Esquema "Actividad"
const schemaActividad = new mongoose.Schema({

    nombreActividad: {

        type:String,
        required: true // CAMPO OBLIGATORIO
    }, 

    categoriaActividad: {

        type:String,
        required: true // CAMPO OBLOGATORIO

    },

    descripcionActividad: {
        type:String,
        required: true // CAMPO OBLOGATORIO
    
    },

    requisitosActividad: {

        type:String,
        required: false // CAMPO NO OBLOGATORIO

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

    esVirtual: {
        type:Boolean,
        required: true
    },

    enlaceActividad: {
    type: String,
    required: function() {
        return this.esVirtual === true;
        }
    },

    cupoMaximoActividad: { 
        type:Number, 
        required: true // CAMPO OBLIGATORIO
    }, 
        
    estadoActividad: {
        type: String,
        enum: ["Disponible", "Lleno", "Cancelado"],
        default: "Disponible",
        required: true // CAMPO OBLIGATORIO 
    },

    cuposDisponiblesActividad: {
    type: Number,
    default: function() {
        return this.cupoMaximoActividad;
    }
}

});

module.exports = mongoose.model("actividad",schemaActividad);

