const supertest = require('supertest');

const knex = require('../../../db_connection');
const app = require('../../app');

const server = supertest(app);
const url = '/api/v1/login';
const payload = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@doe.com',
  password: 'password',
  location: 'Nigeria',
  role: 'client',
  skills: ['Java', 'Go'],
  bio: 'A software developer'
};

describe('Login User /ap1/v1/users', () => {
  let user = {};
  beforeEach(async () => {
    const res = await server
      .post('/api/v1/users')
      .send(payload)
      .expect(201)
      .expect('Content-Type', /json/);
    
    user = res.body;
    user.password = 'password';
  });

  afterEach(async() => {
    await knex.truncate('skills');
    await knex.truncate('users');
  });
  afterAll(async () => knex.destroy());

  test('Should log in existing user', async () => {
    const res = await server
      .post(url)
      .send(user)
      .expect(200)
      .expect('Content-Type', /json/);
    
    expect(res.body.email).toBe(user.email);
    expect(res.body.id).toBe(user.id);
    expect(res.body.role).toBe(user.role);
    expect(res.body).toHaveProperty('token');
  });

  test('should fail to log in user with non existing user', async () => {
    const res = await server
      .post(url)
      .send({
        email: 'jane@doe.com',
        password: 'password'
      })
      .expect(400)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Invalid username/password combination');
  });


  test('should fail to login user when no data is provided', async () => {
    const res = await server
      .post(url)
      .expect(422)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('errors');
  });
});
