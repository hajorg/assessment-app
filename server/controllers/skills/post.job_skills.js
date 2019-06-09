const { body, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const Authentication = require('../../middleware/auth');
const table = 'job_skills';

const handler = async (req, res) => {
  try {
    const payload = req.decoded;
    const { job_id } = req.body;

    if (payload.user.role !== 'client') {
      return res.status(403).json({ error: 'You cannot perform this action:)' });
    }

    const { skills } = req.body;
    const jobSkills = skills.map((skill) => ({ skill_id: skill.id, job_id }));
    const createdJobSkills = await knex(table).insert(jobSkills).returning('*');

    res.status(201).json(createdJobSkills);
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
    body('skills').exists().isArray(),
    body('job_id').exists().isInt(),
  ],
  validate,
  handler
];
