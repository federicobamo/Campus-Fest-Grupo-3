const mongoose = require("mongoose")

// Esquema "Administradores"
const schemaAdministrador = new mongoose.Schema({

    correoAdministrador: {

        type:String,
        required: true // CAMPO OBLIGATORIO
    }, 

    contrasenaAdministrador: { 

        type:String, 
        required: true

    }

});

module.exports = mongoose.model("administrador",schemaAdministrador); 