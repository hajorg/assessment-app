const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const table = 'skills';


const handler = async (req, res) => {
  try {
    jwt.verify(req.headers['x-access-token'], process.env.APP_SECRET);

    const { id } = req.params;

    const skills = await knex(table).select('*').where({ candidate_id: id });
    res.status(200).json(skills);
  } catch (error) {
    console.log(error); //eslint-disable-line
    res.status(422).json({ error: 'An error occurred' });
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
  [
    check('id').exists().isInt(),
  ],
  validate,
  handler
];
