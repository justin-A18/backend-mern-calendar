//* Son los controladores de mis rutas
const { response, request } = require('express');
const { generarJWT } = require('../helpers/jwt');

const bcryptjs = require('bcryptjs');
const User = require('../models/User');

const createUser = async (req = request, res = response) => {
	try {
		const { email, password } = req.body;

		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				ok: false,
				message: 'El correo ya existe',
			});
		}

		user = new User(req.body);

		//* Encriptar Contraseña

		const salt = bcryptjs.genSaltSync();
		user.password = bcryptjs.hashSync(password, salt);

		await user.save();

		//* Generar JWT
		const token = await generarJWT(user._id, user.name);

		res.status(201).json({
			ok: true,
			uid: user._id,
			name: user.name,
			token,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};

const loginUser = async (req = request, res = response) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(400).json({
				ok: false,
				message: 'El correo no existe',
			});
		}

		//* Confirmar los password

		const validPassword = bcryptjs.compareSync(password, user.password);

		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				message: 'Contraseña incorrecta',
			});
		}

		//* Generar JWT
		const token = await generarJWT(user._id, user.name);

		res.status(201).json({
			ok: true,
			uid: user._id,
			name: user.name,
			token,
		});
	} catch (error) {
		res.status(500).json({
			ok: false,
			message: 'Por favor hable con el administrador',
		});
	}
};

const revalidateToken = async (req, res = response) => {
	const { uid, name } = req;

	//* Generar un JWT
	const token = await generarJWT(uid, name);

	res.status(201).json({
		ok: true,
		token,
	});
};

module.exports = {
	loginUser,
	createUser,
	revalidateToken,
};
