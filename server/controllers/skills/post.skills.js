const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const table = 'skills';


const handler = async (req, res) => {
  try {
    const payload = jwt.verify(req.body.token, process.env.APP_SECRET);

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
    body('name').exists().isString(),
    body('token').exists().isString()
  ],
  validate,
  handler
];
