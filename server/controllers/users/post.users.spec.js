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

describe('Create User /ap1/v1/users', () => {
  afterEach(async() => {
    await knex.truncate('user_skills');
    await knex.truncate('users');
  });
  afterAll(() => knex.destroy());

  test('Should create user', async () => {
    const res = await server
      .post(url)
      .send(payload)
      .expect(201)
      .expect('Content-Type', /json/);
    
    expect(res.body.first_name).toBe(payload.first_name);
    expect(res.body.email).toBe(payload.email);
    expect(res.body.role).toBe(payload.role);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('id');
  });

  test('should fail to create user with existing email', async () => {
    const exisitingData = Object.assign({}, payload);
    delete exisitingData.skills;
    await knex('users').insert(exisitingData);

    const res = await server
      .post(url)
      .send(payload)
      .expect(409)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Sorry, your email is not available');
  });


  test('should fail to create user', async () => {
    const res = await server
      .post(url)
      .expect(422)
      .expect('Content-Type', /json/);

    expect(res.body).toHaveProperty('errors');
    expect(res.body.errors).toEqual([
      { location: 'body',
        param: 'first_name',
        msg: 'First Name is Required' },
      { location: 'body',
        param: 'first_name',
        msg: 'First Name is Required' },
      { location: 'body',
        param: 'first_name',
        msg: 'First Name is Required' },
      { location: 'body',
        param: 'last_name',
        msg: 'Last Name is Required' },
      { location: 'body',
        param: 'last_name',
        msg: 'Last Name is Required' },
      { location: 'body',
        param: 'last_name',
        msg: 'Last Name is Required' },
      { location: 'body',
        param: 'email',
        msg: 'Email should be a valid email' },
      { location: 'body',
        param: 'email',
        msg: 'Email should be a valid email' },
      { location: 'body',
        param: 'password',
        msg: 'At least 8 characters of password is required' },
      { location: 'body',
        param: 'password',
        msg: 'At least 8 characters of password is required' },
      { location: 'body',
        param: 'location',
        msg: 'Location is required' },
      { location: 'body',
        param: 'location',
        msg: 'Location is required' },
      { location: 'body', param: 'role', msg: 'Invalid value' },
      { location: 'body', param: 'role', msg: 'Invalid value' },
      { location: 'body',
        param: 'bio',
        msg: 'Bio: Give a brief Information about you' },
      { location: 'body', param: 'skills', msg: 'Invalid value' } ]);
  });
});
