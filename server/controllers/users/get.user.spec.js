const supertest = require('supertest');

const knex = require('../../../db_connection');
const app = require('../../app');

const server = supertest(app);
const url = '/api/v1/users';
const payload = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@doe.com',
  password: 'password',
  location: 'Nigeria',
  role: 'client',
  skills: [ { id: 1 }, { id: 2 } ],
  bio: 'A software developer'
};

describe('Get User /ap1/v1/users', () => {
  let user = {};
  beforeEach(async () => {
    const res = await server
      .post(url)
      .send(payload)
      .expect(201)
      .expect('Content-Type', /json/);
    
    user = res.body;
  });

  afterEach(async() => {
    await knex.truncate('user_skills');
    await knex.truncate('users');
  });
  afterAll(async () => knex.destroy());

  test('Should get an existing user details', async () => {
    const res = await server
      .get(`${url}/${user.id}`)
      .set({ 'x-access-token': user.token })
      .expect(200)
      .expect('Content-Type', /json/);
    
    expect(res.body.email).toBe(user.email);
    expect(res.body.id).toBe(user.id);
  });

  test('should fail when user is not found', async () => {
    user.location = 'Gambia';
    user.bio = 'A software developer';
    const res = await server
      .get(`${url}/10000000`)
      .set({ 'x-access-token': user.token })
      .send(user)
      .expect(404)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('User not found');
  });

  test('should when data is available for update', async () => {
    const res = await server
      .get(`${url}/hello`)
      .set({ 'x-access-token': user.token })
      .expect(422)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('errors');
  });
});
