const supertest = require('supertest');

const app = require('../../app');
const knex = require('../../../db_connection');

const server = supertest(app);
const skills = ['Java', 'Go'];
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
const candidatePayload = Object.assign({}, clientPayload, { role: 'candidate', email: 'test@email.com' });
const url = '/api/v1/jobs';

describe('Post job /api/v1/jobs', () => {
  let client = {};
  let candidate = {};
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
    
    client = res1.body;
    candidate = res2.body;
  });


  afterEach(async() => {
    await knex.truncate('skills');
    await knex.truncate('jobs');
    await knex.truncate('users');
  });
  afterAll(async () => knex.destroy());

  test('should allow client create a job', async () => {
    const payload = { title: 'testing job', skills: ['Java', 'Go'], description: 'Just a description' };
    const res = await server
      .post(url)
      .set({ 'x-access-token': client.token })
      .send(payload)
      .expect(201)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe(payload.title);
    expect(res.body.description).toBe(payload.description);
  });

  test('should not allow candidate create a job', async () => {
    const payload = { title: 'testing job', skills: ['Java', 'React'], description: 'Just a description' };
    await server
      .post(url)
      .set({ 'x-access-token': candidate.token })
      .send(payload)
      .expect(403)
      .expect('Content-Type', /json/);
  });

  test('should not allow user create a job with invalid details', async () => {
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
