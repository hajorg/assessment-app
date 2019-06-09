const { check, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const Authentication = require('../../middleware/auth');
const table = 'jobs';


const handler = async (req, res) => {
  try {
    const { id } = req.params;

    const [ job ] = await knex(table).select('*').where({ id });
    if (!job) return res.status(404).json({ error: 'Oops. Job posting does not exist.' });
    res.status(200).json({ ...job });

    
  } catch (error) {
    console.log(error); //eslint-disable-line
    res.status(500).json({ error: 'An error occurred' });
  }
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};

module.exports = [
  Authentication.auth,
  [
    check('id').exists().isInt(),
  ],
  validate,
  handler
];
