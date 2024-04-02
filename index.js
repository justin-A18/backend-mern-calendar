const express = require('express');

const { dbConection } = require('./database/config');
require('dotenv').config();

const cors = require('cors');

//* Crear servidor
const app = express();

//* Base de datos
dbConection();

//* CORS
app.use(cors());

//* Directorio publico
//* "Use" Es un middleware es una funcion que se ejecuta siempre que pasa por algun lugar.

app.use(express.static('public'));

//* Lectura y parceo en el body
app.use(express.json());

//* Todo lo que este archivo va expotar "./routes/auth" lo va habilitar en esta ruta "/api/auth".
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//* Escuchar perticiones
app.listen(process.env.PORT, () => {
	console.log(`🚀 servidor corriendo en el puerto ${process.env.PORT}`);
});
