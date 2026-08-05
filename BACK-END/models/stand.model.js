const mongoose = require("mongoose")

// Esquema "Stand"
const schemaStand = new mongoose.Schema({

    nombreStand: {

        type:String,
        required: true // CAMPO OBLIGATORIO
    },

    // Las categorías son las mismas que aparecen en los select de los wireframes
    categoriaStand: {

        type: String,
        enum: ["Académico", "Deportivo", "Cultural", "Tecnológico", "Emprendimiento"],
        required: true // CAMPO OBLIGATORIO
    },

    responsableStand: {

        type:String,
        required: true // CAMPO OBLIGATORIO
    },

    ubicacionStand: {
        type:String,
        required: true // CAMPO OBLIGATORIO
    },

    descripcionStand: {

        type:String,
        required: false // CAMPO NO OBLIGATORIO
    },

    // Relación con actividades (RF-STA-05): guarda los id de las actividades
    // vinculadas al stand, haciendo referencia al modelo "actividad" de Federico
    actividadesStand: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "actividad",
        required: false
    }]

});

module.exports = mongoose.model("stand",schemaStand);
