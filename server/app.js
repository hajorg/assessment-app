const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '..', 'client/build')));

app.get('/api/v1', (req, res) => res.status(200).json({ message: 'Welcome to Assessment App!' }));
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../client/build/index.html`));
});

module.exports = app;
