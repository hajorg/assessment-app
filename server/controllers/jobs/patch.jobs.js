const { check, body, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const Authentication = require('../../middleware/auth');
const table = 'jobs';
const applicantTable = 'job_applications';

const handler = async (req, res) => {
  try {
    const { id } = req.params;
    const { applicant_id } = req.body;

    const payload = req.decoded;
    const [ job ] = await knex(table).where({ user_id: payload.user.id, id });

    if (!job) {
      return res.status(403).json({ error: 'You cannot perform this action:)' });
    }
    if (payload.user.role !== 'client') {
      return res.status(403).json({ error: 'You cannot perform this action:)' });
    }

    const foundApproved = await knex(applicantTable).select('*').where({ job_id: id, accepted: true }).first();
    if (foundApproved) return res.status(400).json({ error: 'A candidate has already been approved' });

    const [ applicantJob ] = await knex(applicantTable).update({
      accepted: true,
    }).where({ applicant_id, job_id: id }).returning('*');

    res.status(200).json({ ...applicantJob });

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
    body('applicant_id').exists().isInt(),
    check('x-access-token').exists().isLength({ min: 3 }).isString(),
  ],
  validate,
  handler
];
