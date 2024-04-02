const { Router } = require('express');
const { jwtValidator } = require('../middlewares/jwtValidator');

const {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
} = require('../controllers/events');
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { isDate } = require('../helpers/isDate');

const router = Router();

//* Validar Token en todas las rutas
router.use(jwtValidator);

router.get('/', getEvents);

router.post(
	'/',
	[
		check('title', 'Titulo es obligatorio').not().isEmpty(),
		//Con el custom hacemos validaciones personalizadas
		check('start', 'Fecha de inicio es obligatoria').custom(isDate),
		check('end', 'Fecha de finalización es obligatoria').custom(isDate),
		fieldsValidator,
	],
	createEvent
);

router.put('/:id', updateEvent);

router.delete('/:id', deleteEvent);

module.exports = router;
