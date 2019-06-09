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
const candidatePayload2 = Object.assign(
  {}, clientPayload, { role: 'candidate', email: 'test2@email.com' }
);
const jobPayload = { title: 'testing job', skills, description: 'Just a description' };
const cannotApplyJobPayload = { title: 'testing job', skills: [ { id: 10 }, { id: 17 } ], description: 'Just a description' };
const url = (id) => `/api/v1/jobs/${id}/applicants`;

describe('Get Job Applications /api/v1/jobs/:id/applicants', () => {
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

    const res3 = await server
      .post('/api/v1/users')
      .send(candidatePayload2)
      .expect(201)
      .expect('Content-Type', /json/);

    client = res1.body;
    candidate = res2.body;

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

    canApplyJob = jobRes1.body;
    cannotApplyJob = jobRes2.body;

    await server
      .post('/api/v1/applicants')
      .set({ 'x-access-token': res2.body.token })
      .send({ job_id: canApplyJob.id })
      .expect(201)
      .expect('Content-Type', /json/);

    await server
      .post('/api/v1/applicants')
      .set({ 'x-access-token': res3.body.token })
      .send({ job_id: canApplyJob.id })
      .expect(201)
      .expect('Content-Type', /json/);
  });


  afterEach(async() => {
    await knex.truncate('job_applications');
    await knex.truncate('user_skills');
    await knex.truncate('job_skills');
    await knex.truncate('jobs');
    await knex.truncate('users');
  });
  afterAll(async () => knex.destroy());

  test('should job applicants', async () => {
    const res = await server
      .get(url(canApplyJob.id))
      .set({ 'x-access-token': client.token })
      .expect(200)
      .expect('Content-Type', /json/);

    expect.arrayContaining(res.body);
    expect(res.body.length).toBe(2);
  });

  test('should return an empty array if no application is available for the job', async () => {
    const res = await server
      .get(url(cannotApplyJob.id))
      .set({ 'x-access-token': client.token })
      .expect(200)
      .expect('Content-Type', /json/);
    expect.arrayContaining(res.body);
    expect(res.body.length).toBe(0);
  });

  test('should not return job applicants to a candidate', async () => {
    await server
      .get(url(canApplyJob.id))
      .set({ 'x-access-token': candidate.token })
      .expect(403)
      .expect('Content-Type', /json/);
  });

  test('should not allow unauthenticated users', async () => {
    await server
      .get(url(canApplyJob.id))
      .set({ 'x-access-token': 'client.token' })
      .expect(401)
      .expect('Content-Type', /json/);
  });
});
