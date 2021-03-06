const { body, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const Authentication = require('../../middleware/auth');
const table = 'job_applications';

const handler = async (req, res) => {
  try {
    const payload = req.decoded;
    if (payload.user.role !== 'candidate') {
      return res.status(403).json({ error: 'You cannot perform this action:)' });
    }

    const { job_id } = req.body;
    const applied = await knex(table).where({
      applicant_id: payload.user.id,
      job_id
    }).select('*').first();

    if (applied) {
      return res.status(400).json({ error: 'You have already applied for this job:)' });
    }

    const jobSkills = await knex('job_skills').where({ job_id }).returning('*');
    const userSkills = await knex('user_skills').where({
      user_id: payload.user.id
    }).returning('*');
    const foundUserSkills = userSkills.map((skill) => skill.skill_id);
    const foundJobSkills = jobSkills.map((skill) => skill.skill_id);

    let skillCounter = 0;
    for (let i = 0; i < foundJobSkills.length; i++) {
      const valid = foundUserSkills.includes(foundJobSkills[i]);
      if (valid) skillCounter++;
    }

    const qualified = (skillCounter/jobSkills.length) >= 0.5 ? true : false;
    if (!qualified) {
      return res.status(400).json({ error: 'You are not qualified for this position' });
    }
    const [ data ] = await knex(table).insert({
      applicant_id: payload.user.id,
      job_id
    }).returning('*');

    res.status(201).json({ ...data });
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
    body('job_id').exists().isInt()
  ],
  validate,
  handler
];
