//* Ruta de Usuario / Auth
//* host + /api/auth

const {
	createUser,
	loginUser,
	revalidateToken,
} = require('../controllers/auth');
const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fieldsValidator');
const { jwtValidator } = require('../middlewares/jwtValidator');

const router = Router();

router.post(
	'/',
	[
		[
			check('email', 'El email es obligatorio').isEmail(),
			check('password', 'El password debe de ser de 6 caracteres').isLength({
				min: 6,
			}),
			fieldsValidator,
		],
	],
	loginUser
);

router.post(
	'/new',
	[
		check('name', 'El nombre es obligatorio').not().isEmpty(),
		check('email', 'El email es obligatorio').isEmail(),
		check('password', 'El password debe de ser de 6 caracteres').isLength({
			min: 6,
		}),
		fieldsValidator,
	],
	createUser
);

router.get('/renew', jwtValidator, revalidateToken);

module.exports = router;
