const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const knex = require('knex')(require('./knexfile').development);
const ambienteRoutes = require('./ambienteRoutes');
const loginRoutes = require('./loginRoutes');

const app = express();

// Configuración de middlewares y ajustes de Express

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../client')));
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));


app.get('/', (req, res) => {
    const filePath = path.join(__dirname, '../client/html/index.html');
    res.sendFile(filePath);
});


app.use('/ambiente', ambienteRoutes);
app.use('/', loginRoutes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('¡Algo salió mal!');
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
