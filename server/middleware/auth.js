const jwt = require('jsonwebtoken');

/**
 * Class to implement authentication middlewares
 */
class Authenticate {
  /**
   * Method to authenticate a user before proceeding
   * to protected routes
   * @param {Object} req - The request Object
   * @param {Object} res - The response Object
   * @param {Function} next - Function call to move to the next middleware
   * or endpoint controller
   * @return {void} - Returns void
   */
  static auth(req, res, next) {
    const token = req.headers['x-access-token'];
    try {
      if (!token) {
        return res.status(401).send({ error: 'Authentication is required. No token provided.' });
      }

      const payload = jwt.verify(token, process.env.APP_SECRET);
      req.decoded = payload;
      next();
    } catch (error) {
      return res.status(401).send({ error: 'Authentication is required. Please provide a valid token.' });
    }
  }

  /**
   * Method to genrate token
   * @param {Object} user - User's object
   * @return {String} - Returns jwt token for further authentication
   */
  static generateToken(user) {
    const token = jwt.sign({ user }, process.env.APP_SECRET, { expiresIn: '24h' });
    return token;
  }
}

module.exports = Authenticate;
