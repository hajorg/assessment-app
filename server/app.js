const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

const router = require('./routes');

const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', router);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '..', 'client/build')));

app.get('/api/v1', (req, res) => res.status(200).json({ message: 'Welcome to Job Posting!' }));
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../client/build/index.html`));
});

module.exports = app;
