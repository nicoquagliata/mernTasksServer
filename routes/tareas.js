// rutas para proyectos
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const tareaController = require('../controllers/tareaController');

const auth = require('../middleware/auth');

// crea una tarea
// api/tareas
router.post('/',
    auth,
    [
        check('nombre', 'El nombre de la tarea es obligatorio').not().isEmpty()
    ],
    tareaController.crearTarea
);

// obtener tareas
// api/tareas
router.get('/',
    auth,
    tareaController.obtenerTareas
);

// actualizar tarea
// api/tareas/id
router.put('/:id',
    auth,
    tareaController.actualizarTarea
);

// eliminar tarea via ID
router.delete('/:id',
    auth,
    tareaController.eliminarTarea
)

module.exports = router;