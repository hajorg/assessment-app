const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const Authentication = require('../../middleware/auth');
const table = 'users';

const handler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [ user ] = await knex(table)
      .select(['id', 'first_name', 'last_name', 'email', 'role', 'password'])
      .where({ email });

    let result = false;
    if (user) result = await bcrypt.compare(password, user.password);

    if (!user || !result) return res.status(400).send({ error: 'Invalid username/password combination' });

    delete user.password;
    const token = Authentication.generateToken(user);

    res.status(200).json({ ...user, token });
  } catch (error) {
    console.log(error); //eslint-disable-line
    res.status(500).json({ error: 'An error occurred' });
  }
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  next();
};

module.exports = [
  [
    body('email', 'Email is required').exists().isEmail(),
    body('password', 'Password is required').exists().isLength({ min: 1 }),
  ],
  validate,
  handler
];
