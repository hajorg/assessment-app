const knex = require('../../../db_connection');
const Authentication = require('../../middleware/auth');
const table = 'jobs';

const handler = async (req, res) => {
  try {
    const jobs = await knex(table)
      .orderBy('jobs.id', 'desc')
      .select(['jobs.id as job_id', 'jobs.title', 'jobs.description', 'jobs.updated_at', 'skills.name'])
      .leftJoin('job_skills as js', 'js.job_id', 'jobs.id')
      .leftJoin('skills', 'skills.id', 'js.skill_id');
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
