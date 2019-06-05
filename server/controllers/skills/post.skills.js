const { body, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const Authentication = require('../../middleware/auth');
const table = 'skills';


const handler = async (req, res) => {
  try {
    const payload = req.decoded;

    if (payload.user.role !== 'candidate') {
      return res.status(403).json({ error: 'You cannot perform this action:)' });
    }

    const { name } = req.body;
    const [ skill ] = await knex(table).insert({
      candidate_id: payload.user.id,
      name
    }).returning('*');

    res.status(201).json({ ...skill });

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
    body('name').exists().isString(),
  ],
  validate,
  handler
];
