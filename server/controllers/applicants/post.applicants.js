const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const table = 'job_applications';

const handler = async (req, res) => {
  try {
    const payload = jwt.verify(req.body.token, process.env.APP_SECRET);
    console.log(payload); //eslint-disable-line 

    if (payload.user.role !== 'candidate') {
      return res.status(403).json({ error: 'You cannot perform this action:)' });
    }

    const { job_id } = req.body;
    const applied = await knex(table).where({
      applicant_id: payload.user.id,
      job_id
    }).select('*');

    if (applied.length) {
      return res.status(400).json({ error: 'You have already applied for this job:)' });
    }

    const jobSkills = await knex('skills').where({
      job_id,
      candidate_id: null
    }).returning('*');

    const userSkills = await knex('skills').where({
      candidate_id: payload.user.id,
      job_id: null
    }).returning('*');
    const uSkills = userSkills.map((skill) => skill.name);
    const jSkills = jobSkills.map((skill) => skill.name);

    let skillCounter = 0;
    for (let i = 0; i < jSkills.length; i++ ) {
      const valid = uSkills.includes(jSkills[i]);
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
    body('job_id').exists().isInt(),
    body('token').exists().isString(),
  ],
  validate,
  handler
];
