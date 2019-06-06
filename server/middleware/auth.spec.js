require('dotenv').config();
const jwt = require('jsonwebtoken');

const Authentication = require('./auth');

describe('Authentication', () => {
  let token;
  beforeEach(() => {
    token = jwt.sign({ id: 1 }, process.env.APP_SECRET, { expiresIn: '1h' });
  });

  test('Should generate token', () => {
    const user = { id: 1, email: 'test@test.com', role: 'client' };
    const spy = jest.spyOn(jwt, 'sign').mockImplementation(() => token);
    const newToken = Authentication.generateToken(user);
    expect(spy).toHaveBeenCalled();
    expect(newToken).toBe(token);
  });

  test('Should decode token', () => {
    const mockRequest = (token) => {
      return {
        headers: { 'x-access-token': token }
      };
    };
    const mockResponse = () => {
      const res = {};
      res.status = jest.fn(() => res);
      res.send = jest.fn(() => res);
      return res;
    };
    const next = jest.fn();
    const req = mockRequest(token);
    const res = mockResponse();
    Authentication.auth(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('Should fail to decode invalid token', () => {
    const mockRequest = (token) => {
      return {
        headers: { 'x-access-token': token }
      };
    };
    const mockResponse = () => {
      const res = {};
      res.status = jest.fn(() => res);
      res.send = jest.fn(() => res);
      return res;
    };
    const next = jest.fn();
    const req = mockRequest('token');
    const res = mockResponse();
    Authentication.auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: 'Authentication is required. Please provide a valid token.' });
  });

  test('Should fail to decode when no token is provided', () => {
    const mockRequest = (token) => {
      return {
        headers: { 'x-access-token': token }
      };
    };
    const mockResponse = () => {
      const res = {};
      res.status = jest.fn(() => res);
      res.send = jest.fn(() => res);
      return res;
    };
    const next = jest.fn();
    const req = mockRequest('');
    const res = mockResponse();
    Authentication.auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: 'Authentication is required. No token provided.' });
  });
});
