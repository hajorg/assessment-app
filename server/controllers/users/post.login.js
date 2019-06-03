const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const table = 'users';

const handler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [ user ] = await knex(table)
      .select(['id', 'first_name', 'last_name', 'email', 'role', 'password'])
      .where({ email });

    const result = await bcrypt.compare(password, user.password);

    if (!user || !result) return res.status(401).send({ error: 'Invalid username/password combination' });

    delete user.password;

    const token = jwt.sign({ user }, process.env.APP_SECRET, { expiresIn: '2h' });

    res.status(200).json({ ...user, token });
  } catch (error) {
    console.log(error); //eslint-disable-line
    res.status(422).json({ error: 'An error occurred' });
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
    body('email').exists().isEmail(),
    body('password').exists().isLength({ min: 8 }),
  ],
  validate,
  handler
];
