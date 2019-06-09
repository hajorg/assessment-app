const supertest = require('supertest');

const app = require('../../app');
const knex = require('../../../db_connection');

const server = supertest(app);
const skills = [ { id: 1, name: 'Java' }, { id: 2, name: 'Go' } ];
const clientPayload = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@doe.com',
  password: 'password',
  location: 'Nigeria',
  role: 'client',
  skills,
  bio: 'A software developer'
};
const candidatePayload = Object.assign(
  {}, clientPayload, { role: 'candidate', email: 'test@email.com' }
);
const jobPayload = { title: 'testing job', skills, description: 'Just a description' };
const cannotApplyJobPayload = { title: 'testing job', skills: [ { id: 10 }, { id: 17 } ], description: 'Just a description' };
const url = '/api/v1/applicants';

describe('Post Job Application /api/v1/applicants', () => {
  let client = {};
  let candidate = {};
  let canApplyJob = {};
  let cannotApplyJob = {};
  beforeEach(async () => {
    const res1 = await server
      .post('/api/v1/users')
      .send(clientPayload)
      .expect(201)
      .expect('Content-Type', /json/);

    const res2 = await server
      .post('/api/v1/users')
      .send(candidatePayload)
      .expect(201)
      .expect('Content-Type', /json/);

    const jobRes1 = await server
      .post('/api/v1/jobs')
      .set({ 'x-access-token': res1.body.token })
      .send(jobPayload)
      .expect(201)
      .expect('Content-Type', /json/);

    const jobRes2 = await server
      .post('/api/v1/jobs')
      .set({ 'x-access-token': res1.body.token })
      .send(cannotApplyJobPayload)
      .expect(201)
      .expect('Content-Type', /json/);
    
    client = res1.body;
    candidate = res2.body;
    canApplyJob = jobRes1.body;
    cannotApplyJob = jobRes2.body;
  });


  afterEach(async() => {
    await knex.truncate('job_applications');
    await knex.truncate('user_skills');
    await knex.truncate('job_skills');
    await knex.truncate('jobs');
    await knex.truncate('users');
  });
  afterAll(async () => knex.destroy());

  test('should allow candidate apply for a job', async () => {
    const res = await server
      .post(url)
      .set({ 'x-access-token': candidate.token })
      .send({ job_id: canApplyJob.id })
      .expect(201)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('id');
    expect(res.body.applicant_id).toBe(candidate.id);
    expect(res.body.job_id).toBe(canApplyJob.id);
  });

  test('should not allow candidate apply for a job if they are not qualified', async () => {
    await server
      .post(url)
      .set({ 'x-access-token': candidate.token })
      .send({ job_id: cannotApplyJob.id })
      .expect(400)
      .expect('Content-Type', /json/);
  });

  test('should not allow client apply for a job', async () => {
    await server
      .post(url)
      .send({ job_id: cannotApplyJob.id })
      .set({ 'x-access-token': client.token })
      .expect(403)
      .expect('Content-Type', /json/);
  });

  test('should not allow user create a job with no payload', async () => {
    await server
      .post(url)
      .set({ 'x-access-token': client.token })
      .expect(422)
      .expect('Content-Type', /json/);
  });

  test('should not allow user create a job with invalid token', async () => {
    await server
      .post(url)
      .set({ 'x-access-token': 'client.token' })
      .expect(401)
      .expect('Content-Type', /json/);
  });
});
