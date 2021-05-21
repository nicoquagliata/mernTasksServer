const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

exports.crearUsuario = async (req, res) => {

    // revisamos errores
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }


    // extraer email y password
    const { email, password } = req.body;



    try {
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({ msg: 'el usuario ya existe' })
        }

        // crea nuevo usuario
        usuario = new Usuario(req.body);
        // hash password
        const salt = await bcryptjs.genSalt(10);

        usuario.password = await bcryptjs.hash(password, salt);

        // guardar nuevo usuario
        await usuario.save();

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


    } catch (error) {
        console.log(error);
        res.status(400).send("Ocurrio un error");
    }
}