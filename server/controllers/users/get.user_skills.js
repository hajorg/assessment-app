const { check, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const Authentication = require('../../middleware/auth');
const table = 'skills';


const handler = async (req, res) => {
  try {
    const { id } = req.params;

    const skills = await knex(table).select('*').where({ candidate_id: id });
    res.status(200).json(skills);
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
