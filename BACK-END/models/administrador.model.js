const mongoose = require("mongoose");
 
const schemaAdministrador = new mongoose.Schema({
 
    correoAdministrador: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
 
    nombreAdministrador: {
        type: String,
        required: false
    }
 
});
 
module.exports = mongoose.model("administrador", schemaAdministrador);
 