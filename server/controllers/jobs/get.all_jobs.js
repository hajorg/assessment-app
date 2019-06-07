const knex = require('../../../db_connection');
const Authentication = require('../../middleware/auth');
const table = 'jobs';


const handler = async (req, res) => {
  try {
    const jobs = await knex(table).select('*').orderByRaw('job_id Desc').leftJoin('skills', 'jobs.id', 'skills.job_id');
    const results = [];
    const resObj = {};

    // Associate skills to jobs
    for (let i = 0; i < jobs.length; i++) {
      if (!resObj[jobs[i].job_id]) {
        resObj[jobs[i].job_id] = true;
        results.push({ job_id: jobs[i].job_id, ...jobs[i], skills: [jobs[i].name] });
      } else {
        for (let j = 0; j < results.length; j++) {
          if (results[j].job_id === jobs[i].job_id) {
            results[j].skills.push(jobs[i].name);
          }
        }
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.log(error); //eslint-disable-line
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = [
  Authentication.auth,
  handler
];
