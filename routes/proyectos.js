// rutas para proyectos
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const proyectoController = require('../controllers/proyectoController');

const auth = require('../middleware/auth');

// lista proyectos
// api/proyectos
router.get('/',
    auth,
    proyectoController.obtenerProyectos
);

// crea un proyecto
// api/proyectos
router.post('/',
    auth,
    [
        check('nombre', 'El nombre del prooyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.crearProyecto
);

// actualizar proyecto via ID
router.put('/:id',
    auth,
    [
        check('nombre', 'El nombre del prooyecto es obligatorio').not().isEmpty()
    ],
    proyectoController.actualizarProyecto
)

// eliminar proyecto via ID
router.delete('/:id',
    auth,
    proyectoController.eliminarProyecto
)



module.exports = router;