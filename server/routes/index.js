const express = require('express');

const router = express.Router();

router.route('/login').post(require('../controllers/users/post.login'));
router.route('/users').post(require('../controllers/users/post.users'));
router.route('/users/:id')
  .get(require('../controllers/users/get.user'))
  .patch(require('../controllers/users/patch.user'));
router.route('/users/:id/skills').get(require('../controllers/users/get.user_skills'));

router.route('/jobs')
  .post(require('../controllers/jobs/post.jobs'))
  .get(require('../controllers/jobs/get.all_jobs'));
router.route('/jobs/:id')
  .patch(require('../controllers/jobs/patch.jobs'))
  .get(require('../controllers/jobs/get.jobs'));

router.route('/jobs/:id/applicants')
  .get(require('../controllers/jobs/get.job_applicants'));

router.route('/applicants').post(require('../controllers/applicants/post.applicants'));

router.route('/skills')
  .post(require('../controllers/skills/post.skills'))
  .get(require('../controllers/skills/get.skills'));

module.exports = router;
