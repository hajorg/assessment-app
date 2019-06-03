const jwt = require('jsonwebtoken');

const knex = require('../../../db_connection');
const table = 'jobs';


const handler = async (req, res) => {
  try {
    jwt.verify(req.headers['x-access-token'], process.env.APP_SECRET);

    const jobs = await knex(table).select('*');
    res.status(200).json(jobs);

    
  } catch (error) {
    console.log(error); //eslint-disable-line
    res.status(422).json({ error: 'An error occurred' });
  }
};

module.exports = [
  handler
];
