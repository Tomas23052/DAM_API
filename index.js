require('dotenv').config();

const mongoString = process.env.DATABASE_URL;

const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes/rotas');

const app = express();

app.use(express.json);
app.use(routes);

app.listen(3000, () => {
    console.log('Server is running');
})

mongoose.connect(mongoString);

const database = mongoose.connection;

database.on('erro', (erro) => {
    console.log(erro);
}) 

database.once('connected', () => {
    console.log('Database connected');
})