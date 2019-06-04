const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const table = 'jobs';


const handler = async (req, res) => {
  try {
    const payload = jwt.verify(req.body.token, process.env.APP_SECRET);
    console.log(payload); //eslint-disable-line 

    if (payload.user.role !== 'client') {
      return res.status(403).json({ error: 'You cannot perform this action:)' });
    }

    const { title, description, skills } = req.body;
    const [ job ] = await knex(table).insert({
      user_id: payload.user.id,
      title,
      description
    }).returning('*');

    for (let i = 0; i < skills.length; i++) {
      await knex('skills').insert({
        job_id: job.id,
        name: skills[i]
      }).returning('*');
    }

    res.status(201).json({ ...job });

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
    body('title').exists().isLength({ min: 3 }),
    body('description').exists().isString(),
    body('skills').exists().isArray()
  ],
  validate,
  handler
];
