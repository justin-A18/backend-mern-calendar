const { response, request } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {
	//Populate obtener una key de un objeto
	const events = await Event.find().populate('user', 'name');

	return res.status(201).json({
		ok: true,
		events,
	});
};

const createEvent = async (req = request, res = response) => {
	const event = new Event(req.body);

	try {
		event.user = req.uid;

		const eventDB = await event.save();

		return res.status(201).json({
			ok: true,
			event: eventDB,
		});
	} catch (error) {
		return res.status(500).json({
			ok: true,
			message: 'Hable con el administrador',
		});
	}
};

const updateEvent = async (req, res = response) => {
	try {
		const eventId = req.params.id;

		const event = await Event.findById(eventId);
		const uid = req.uid;

		if (!event) {
			return res.status(404).json({
				ok: false,
				message: 'Evento no existe con ese id',
			});
		}

		if (event.user.toString() != uid) {
			return res.status(401).json({
				ok: false,
				message: 'No tiene permisos para editar este evento',
			});
		}

		const newEvent = {
			...req.body,
			user: uid,
		};

		const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, {
			new: true,
		});

		return res.status(201).json({
			ok: true,
			event: eventUpdated,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			message: 'Hable con el administrador',
		});
	}
};

const deleteEvent = async (req, res = response) => {
	try {
		const eventId = req.params.id;

		const event = await Event.findById(eventId);
		const uid = req.uid;

		if (!event) {
			return res.status(404).json({
				ok: false,
				message: 'No se puede eliminar un evento que no existe',
			});
		}

		if (event.user.toString() != uid) {
			return res.status(401).json({
				ok: false,
				message: 'No tiene permisos para eliminar este evento',
			});
		}

		await Event.findByIdAndDelete(eventId, { new: true });

		return res.status(201).json({
			ok: true,
			event: "evento eliminado",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			ok: false,
			message: 'Hable con el administrador',
		});
	}
};

module.exports = {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
};
