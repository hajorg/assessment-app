const knex = require('../../../db_connection');
const Authentication = require('../../middleware/auth');
const table = 'jobs';
const applicantTable = 'job_applications';

const handler = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.decoded;

    const [ job ] = await knex(table).select('*').where({ id, user_id: payload.user.id });
    if (!job) {
      return res.status(403).json({ error: 'You cannot perform this action:)' });
    }

    const jobApplicants = await knex(applicantTable).select('*').where({ job_id: id });
    res.status(200).json(jobApplicants);
  } catch (error) {
    console.log(error); //eslint-disable-line
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = [
  Authentication.auth,
  handler
];
