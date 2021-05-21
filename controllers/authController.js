const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

exports.autenticarUsuario = async (req, res) => {

    // revisamos errores
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    // extraer email y password
    const { email, password } = req.body;






    try {
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ msg: 'el usuario no existe' })
        }

        const passCorrecto = await bcryptjs.compare(password, usuario.password);
        if (!passCorrecto) {
            return res.status(400).json({ msg: 'el password es incorrecto' })
        }

        //json web token
        const payload = {
            usuario: {
                id: usuario.id
            }
        }
        // firmar jwt
        jwt.sign(payload, process.env.SECRETA, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;
            res.json({ token });

        })

        // // crea nuevo usuario
        // usuario = new Usuario(req.body);
        // // hash password
        // const salt = await bcryptjs.genSalt(10);

        // usuario.password = await bcryptjs.hash(password, salt);

        // // guardar nuevo usuario
        // await usuario.save();




    } catch (error) {
        console.log(error);
    }
}

exports.usuarioAutenticado = async (req, res) => {

    try {
        const usuario = await Usuario.findById(req.usuario.id).select('-password');
        res.json({ usuario });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'ocurrio un error' })
    }
}