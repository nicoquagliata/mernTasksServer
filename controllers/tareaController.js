const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');

const { validationResult } = require('express-validator');

// crea una nueva tarea
exports.crearTarea = async (req, res) => {

    // revisamos errores
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() })
    }


    // extraer el proyecto y comprobar si existe
    try {

        const { proyecto } = req.body


        const existeProyecto = await Proyecto.findById(proyecto)
        if (!existeProyecto) {
            res.status(404).json({ msg: 'proyecto no encontrado' });
        }

        // revisar si el proyecto pertenece al usuario autenticado
        // verificar el creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'no autorizado' })
        }


        // creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json(tarea)


    } catch (error) {
        console.log(error);
        res.status(500).send('ocurrio un error')
    }

}



// listar tareas
exports.obtenerTareas = async (req, res) => {

    // extraer el proyecto y comprobar si existe
    try {

        const { proyecto } = req.query;


        const existeProyecto = await Proyecto.findById(proyecto)
        if (!existeProyecto) {
            res.status(404).json({ msg: 'proyecto no encontrado' });
        }

        // revisar si el proyecto pertenece al usuario autenticado
        // verificar el creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'no autorizado' })
        }


        // obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto }).sort({ creado: -1 });
        res.json({ tareas })


    } catch (error) {
        console.log(error);
        res.status(500).send('ocurrio un error')
    }

}




// actualiza una tarea
exports.actualizarTarea = async (req, res) => {

    try {

        const { proyecto, nombre, estado } = req.body;
        console.log(estado);

        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            res.status(404).json({ msg: 'tarea no encontrada' });
        }

        const existeProyecto = await Proyecto.findById(proyecto)

        if (!existeProyecto) {
            res.status(404).json({ msg: 'proyecto no encontrado' });
        }

        // verificar el creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'no autorizado' })
        }

        const nuevaTarea = {};

        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;



        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });

        res.json({ tarea });



    } catch (error) {
        console.log(error);
        res.status(500).send('error en el servidor')
    }


}



// eliminar una tarea
exports.eliminarTarea = async (req, res) => {

    try {

        const { proyecto } = req.query;

        let tarea = await Tarea.findById(req.params.id);

        if (!tarea) {
            res.status(404).json({ msg: 'tarea no encontrada' });
        }

        const existeProyecto = await Proyecto.findById(proyecto)

        if (!existeProyecto) {
            res.status(404).json({ msg: 'proyecto no encontrado' });
        }

        // verificar el creador del proyecto
        if (existeProyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'no autorizado' })
        }

        // eliminar 

        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'tarea eliminada' });



    } catch (error) {
        console.log(error);
        res.status(500).send('error en el servidor')
    }


}