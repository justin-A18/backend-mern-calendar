const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const jwtValidator = (req = request, res = response, next) => {
	//x-token Headers

	const token = req.header('x-token');

	if (!token) {
		return res.status(401).json({
			ok: false,
			message: 'No hay token en la petición',
		});
	}

	try {
		const { uid, name } = jwt.verify(token, process.env.SECRET_JWT_SEED);

		req.uid = uid;
		req.name = name;
	} catch (error) {
		return res.status(401).json({
			ok: false,
			message: 'Token no valido',
		});
	}

	next();
};

module.exports = {
	jwtValidator,
};
