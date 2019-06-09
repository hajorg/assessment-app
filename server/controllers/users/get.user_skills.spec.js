const supertest = require('supertest');

const knex = require('../../../db_connection');
const app = require('../../app');

const server = supertest(app);
const url = (id) => `/api/v1/users/${id}/skills`;
const skills = [ { id: 1, name: 'Java' }, { id: 2, name: 'Go' } ];
const payload = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@doe.com',
  password: 'password',
  location: 'Nigeria',
  role: 'client',
  skills,
  bio: 'A software developer'
};

describe('Get User Skills /ap1/v1/users', () => {
  let user = {};
  beforeEach(async () => {
    const res = await server
      .post('/api/v1/users')
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

  test('Should get user\'s skills', async () => {
    const res = await server
      .get(url(user.id))
      .set({ 'x-access-token': user.token })
      .expect(200)
      .expect('Content-Type', /json/);
    
    expect(res.body.length).toBe(skills.length);
    expect(res.body[0].name).toBe(skills[0].name);
    expect(res.body[1].name).toBe(skills[1].name);
  });

  test('should return empty array if skills are not found', async () => {
    const res = await server
      .get(url(10000000))
      .set({ 'x-access-token': user.token })
      .send(user)
      .expect(200)
      .expect('Content-Type', /json/);

    expect(res.body).toEqual([]);
  });

  test('should when data is available for update', async () => {
    const res = await server
      .get(url('invalid'))
      .set({ 'x-access-token': user.token })
      .expect(422)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('errors');
  });
});
