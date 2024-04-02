//* CUSTOM MIDDLEWARES

const { response } = require('express');
const { validationResult } = require('express-validator');

const fieldsValidator = (req, res = response, next) => {
	if (!req.body) {
		return res.status(400).json({
			ok: false,
			message: 'No se ha proporcionado un cuerpo de solicitud válido.',
		});
	}

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({
			ok: false,
			errors: errors.mapped(),
		});
	}

	next();
};

module.exports = {
	fieldsValidator,
};
