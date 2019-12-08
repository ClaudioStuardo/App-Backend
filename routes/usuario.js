var express = require('express');
// npm install --save bcryptjs
// encriptar una contraseña
var bcrypt = require('bcryptjs');

var app = express();

// Modelo de Usuario
var Usuario = require('../models/usuario');

// Ruta principal

// ==================================================
// Obtener todos los usuarios
// ==================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombreUsuario correo imagen activo')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {

                if (err) {
                    // 500 internal server error
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuario',
                        errors: err
                    });
                }

                Usuario.count({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });

                });

            });

});

// ==================================================
// Actualizar un usuario
// ==================================================
app.put('/:id', (req, res) => {

    var id = req.params.id;
    // solo funciona con el body parser en app.js
    var body = req.body;

    // findById función de mongoose
    Usuario.findById(id, (err, usuario) => {

        if (err) {
            // 500 internal server error
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar en actualizar usuario',
                errors: err
            });
        }

        if (!usuario) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        usuario.nombreUsuario = body.nombreUsuario;
        usuario.correo = body.correo;
        usuario.imagen = body.imagen;
        usuario.activo = body.activo;

        usuario.save((err, usuarioGuardado) => {

            // 400 bad request
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = 'Contraseña oculta';

            // 200 petición correcta
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});

// ==================================================
// Crear un nuevo usuario
// ==================================================
app.post('/', (req, res) => {

    // solo funciona con el body parser en app.js
    var body = req.body;

    // Usando mongoose - Usuario viene de models
    var usuario = new Usuario({
        nombreUsuario: body.nombreUsuario,
        correo: body.correo,
        // encriptación de contraseña
        password: bcrypt.hashSync(body.password, 10),
        activo: body.activo,
    });

    // Para guardarlo
    usuario.save((err, usuarioGuardado) => {

        // 400 bad request
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        usuarioGuardado.password = 'Contraseña oculta';

        // 201 recurso creado
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });

});

// ==================================================
// Borrar un usuario
// ==================================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {

        // 500 internal server error
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            // 400 bad request
            return res.status(400).json({
                ok: false,
                errors: { message: 'No existe un usuario con ese id' }
            });
        }

        usuarioBorrado.password = 'Contraseña oculta';

        // 200 petición correcta
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});

module.exports = app;