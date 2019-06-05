const jwt = require('jsonwebtoken');

const knex = require('../../../db_connection');
const table = 'jobs';


const handler = async (req, res) => {
  try {
    jwt.verify(req.headers['x-access-token'], process.env.APP_SECRET);

    const jobs = await knex(table).select('*').leftJoin('skills', 'jobs.id', 'skills.job_id');
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
    res.status(422).json({ error: 'An error occurred' });
  }
};

module.exports = [
  handler
];
