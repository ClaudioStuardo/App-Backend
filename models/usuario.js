var mongoose = require('mongoose');
// npm install --save mongoose-unique-validator
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({

    nombreUsuario: { type: String, unique: true, required: [true, 'Nombre obligatorio'], minlength: 3 },
    correo: { type: String, unique: true, required: [true, 'El correo es obligatorio'] },
    password: { type: String, required: [true, 'Contraseña incorrecta'], minlength: 3 },
    imagen: { type: String, required: false, default: '' },
    activo: { type: Boolean, default: true }

});

usuarioSchema.plugin(uniqueValidator, { message: 'el {PATH} debe se único' });

module.exports = mongoose.model('Usuario', usuarioSchema);