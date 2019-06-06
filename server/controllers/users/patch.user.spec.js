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
  skills: ['Java', 'Go'],
  bio: 'A software developer'
};

describe('Update User /ap1/v1/users', () => {
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
    await knex.truncate('skills');
    await knex.truncate('users');
  });
  afterAll(async () => knex.destroy());

  test('Should update existing user details', async () => {
    const updatedUser = Object.assign({}, user);
    updatedUser.location = 'Gambia';
    updatedUser.bio = 'A software developer';
    const res = await server
      .patch(`${url}/${updatedUser.id}`)
      .set({ 'x-access-token': updatedUser.token })
      .send(updatedUser)
      .expect(200)
      .expect('Content-Type', /json/);
    
    expect(res.body.email).toBe(updatedUser.email);
    expect(res.body.id).toBe(updatedUser.id);
    expect(res.body.location).toBe(updatedUser.location);
  });

  test('should fail when user is not found', async () => {
    user.location = 'Gambia';
    user.bio = 'A software developer';
    const res = await server
      .patch(`${url}/10000000`)
      .set({ 'x-access-token': user.token })
      .send(user)
      .expect(403)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('You are not allowed to perform the action');
  });


  test('should error when data is not available for update', async () => {
    const res = await server
      .patch(`${url}/10000000`)
      .set({ 'x-access-token': user.token })
      .expect(422)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('errors');
  });
});
