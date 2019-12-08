var express = require('express');

var app = express();

// Tener el path imagen según url
var path = require('path');
// Manejo de archivos
var fs = require('fs');

// Ruta principal
app.get('/:tipo/:imagen', (req, res, next) => {

    var tipo = req.params.tipo;
    var imagen = req.params.imagen;

    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ imagen }`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        var pathNoImagen = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImagen);
    }

});

module.exports = app;