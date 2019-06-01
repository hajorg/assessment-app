const express = require('express');
const dotenv = require('dotenv');

const app = express();

dotenv.config();
app.use(express.json());

app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to Assessment App!' }));

module.exports = app;
