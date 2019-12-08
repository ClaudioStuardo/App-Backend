var express = require('express');

// npm install --save randomstring
var randomstring = require("randomstring");

// npm install --save express-fileupload@1.0.0
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');

// default options
app.use(fileUpload());

// Ruta principal
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // Tipos de colección
    var tiposValidos = 'usuarios';
    if (tiposValidos.indexOf(tipo) < 0) {
        // 400 bad request
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: { message: 'Tipo de colección no válida' }
        });
    }

    if (!req.files) {
        // 400 bad request
        return res.status(400).json({
            ok: false,
            mensaje: 'Seleccione un archivo',
            errors: { message: 'Debe seleccionar un archivo' }
        });
    }


    // Obtener el nombre de la imagen
    if (req.files.imagen) {
        var archivo = req.files.imagen;
        var nombreCortado = archivo.name.split('.');
        var extencionArchivo = nombreCortado[nombreCortado.length - 1].toLowerCase();
    }

    // Solo estas extensiones aceptamos
    var extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesValidas.indexOf(extencionArchivo) < 0) {
        // 400 bad request
        return res.status(400).json({
            ok: false,
            mensaje: 'Archivo no válido',
            errors: { message: 'Los archivos válidos son ' + extencionesValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${ randomstring.generate() }-${ new Date().getMilliseconds() }.${extencionArchivo}`;

    // Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv(path, err => {

        if (err) {
            // 500 internal server error
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirImagen(tipo, id, nombreArchivo, extencionArchivo, res);

    });

});

// Actualizar registros de la BD
function subirImagen(tipo, id, nombreArchivo, extencionArchivo, res) {

    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            var pathViejo = './uploads/usuarios/' + usuario.imagen;

            try {
                fs.unlinkSync(pathViejo);
            } catch (err) {
                console.log(err);
            }

            usuario.imagen = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = 'Contraseña oculta';
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });
            });

        });

    }

}

module.exports = app;