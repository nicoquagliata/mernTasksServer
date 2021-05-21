const Proyecto = require('../models/Proyecto');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

exports.crearProyecto = async (req, res) => {

    // revisamos errores
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    try {
        // crear proyecto
        const proyecto = new Proyecto(req.body);
        proyecto.creador = req.usuario.id;

        // guardamos
        proyecto.save();
        res.json(proyecto);


    } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error');
    }
}


exports.obtenerProyectos = async (req, res) => {

    try {
        console.log(req.usuario);
        const proyectos = await Proyecto.find({ creador: req.usuario.id }).sort({ creado: -1 })
        res.json({ proyectos });
    } catch (error) {
        console.log(error);
        res.status(500).send('ocurrio un error');
    }
}

// actualiza un proyecto
exports.actualizarProyecto = async (req, res) => {
    // revisamos errores
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }

    // extraer inf proyecto
    const { nombre } = req.body;
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        // revisar el id
        let proyecto = await Proyecto.findById(req.params.id);

        // revisar si existe el proyecto
        if (!proyecto) {
            return res.status(404).json({ msg: 'proyecto no encontrado' })
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'no autorizado' })
        }

        // actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });

        res.json({ proyecto });

    } catch (error) {
        console.log(error);
        res.status(500).send('error en el servidor')
    }


}

// eliminar un proyecto
exports.eliminarProyecto = async (req, res) => {

    try {
        // revisar el id
        let proyecto = await Proyecto.findById(req.params.id);

        // revisar si existe el proyecto
        if (!proyecto) {
            return res.status(404).json({ msg: 'proyecto no encontrado' })
        }

        // verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'no autorizado' })
        }

        // actualizar
        await Proyecto.findOneAndRemove({ _id: req.params.id });

        res.json({ msg: 'Proyecto eliminado' });

    } catch (error) {
        console.log(error);
        res.status(500).send('error en el servidor')
    }


}