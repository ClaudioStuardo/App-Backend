var express = require('express');

var app = express();

var Usuario = require('../models/usuario');

// Ruta principal
app.get('/usuario/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    // Expresión regular - javascript
    var regex = new RegExp(busqueda, 'i');

    // Arreglo de promesas para realizarlas todas
    Promise.all([
        buscarUsuario(busqueda, regex)
    ]).then(respuestas => {

        res.status(200).json({
            ok: true,
            usuarios: respuestas[0]
        });

    });

});

function buscarUsuario(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombreUsuario correo imagen activo')
            .or([{ 'nombreUsuario': regex }, { 'correo': regex }])
            .exec((err, usuarios) => {

                if (err) {

                    reject('Error al cargar usuarios', err);

                } else {

                    resolve(usuarios);

                }

            });

    });

}

module.exports = app;