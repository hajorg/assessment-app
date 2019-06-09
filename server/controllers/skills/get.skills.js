const knex = require('../../../db_connection');
const table = 'skills';


const handler = async (req, res) => {
  try {
    const skills = await knex(table).select('*');
    res.status(200).json(skills);
  } catch (error) {
    console.log(error); //eslint-disable-line
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = [
  handler
];
