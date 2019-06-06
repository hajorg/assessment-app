const { body, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const Authentication = require('../../middleware/auth');
const table = 'jobs';


const handler = async (req, res) => {
  try {
    const payload = req.decoded;

    if (payload.user.role !== 'client') {
      return res.status(403).json({ error: 'You cannot perform this action:)' });
    }

    const { title, description, skills } = req.body;
    const [ job ] = await knex(table).insert({
      user_id: payload.user.id,
      title,
      description
    }).returning('*');

    const jobSkills = skills.map((skill) => ({ name: skill, job_id: job.id }));
    if (jobSkills.length) await knex('skills').insert(jobSkills).returning('*');

    res.status(201).json({ ...job });
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
    body('title', 'Title is required with at least 3 characters').exists().isLength({ min: 3 }),
    body('description', 'Description is required').exists().isString().isLength({ min: 5 }),
    body('skills', 'Select at least a skill:)').exists().isArray().isLength({ min: 1 })
  ],
  validate,
  handler
];
