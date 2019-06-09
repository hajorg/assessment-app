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
const url = '/api/v1/jobs';

const jobPaylod = {
  title: 'A job title',
  skills,
  description: 'Just for Java and Go devs'
};

const jobPaylod2 = {
  title: 'A job title 2',
  skills: [ { id: 12, name: 'Angular' }, { id: 15, name: 'React' } ],
  description: 'Just for Front end devs'
};

describe('Get jobs /api/v1/jobs', () => {
  let client = {};
  let job1 = {};
  let job2 = {};
  beforeEach(async () => {
    const res = await server
      .post('/api/v1/users')
      .send(clientPayload)
      .expect(201)
      .expect('Content-Type', /json/);
    client = res.body;

    const res2 = await server
      .post(url)
      .set({ 'x-access-token': client.token })
      .send(jobPaylod)
      .expect(201)
      .expect('Content-Type', /json/);

    const res3 = await server
      .post(url)
      .set({ 'x-access-token': client.token })
      .send(jobPaylod2)
      .expect(201)
      .expect('Content-Type', /json/);
  
    job1 = res2.body;
    job2 = res3.body;
  });


  afterEach(async() => {
    await knex.truncate('user_skills');
    await knex.truncate('job_skills');
    await knex.truncate('jobs');
    await knex.truncate('users');
  });
  afterAll(async () => knex.destroy());

  test('should allow user get jobs', async () => {
    const res = await server
      .get(url)
      .set({ 'x-access-token': client.token })
      .expect(200)
      .expect('Content-Type', /json/);

    expect.arrayContaining(res.body);
    expect(res.body[0].title).toBe(job2.title);
    expect(res.body[0].description).toBe(job2.description);
    expect(res.body[1].title).toBe(job1.title);
    expect.arrayContaining(res.body[1].skills);
    expect(res.body[1].description).toBe(job1.description);
  });

  test('should not allow unauthentictaed users get jobs', async () => {
    await server
      .get(url)
      .expect(401)
      .expect('Content-Type', /json/);
  });
});
