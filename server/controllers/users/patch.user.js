const { check, body, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const Authentication = require('../../middleware/auth');
const table = 'users';

const handler = async (req, res) => {
  try {
    const payload = req.decoded;
    const { first_name, last_name, email, location } = req.body;
    const { id } = req.params;
    const [ foundUser ] = await knex(table).select('*').where({ id });
    if (!foundUser || foundUser.id !== payload.user.id) {
      return res.status(403).json({ error: 'You are not allowed to perform the action' });
    }

    const [user] = await knex(table).update({
      first_name,
      last_name,
      email,
      location
    }).where({ id: foundUser.id }).returning(['id', 'first_name', 'last_name', 'email', 'role', 'location', 'bio']);

    res.status(200).json({ ...user });
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
  Authentication.auth,
  [
    check('id').exists().isInt(),
    body('first_name', 'First name is required').exists().isLength({ min: 3 }).isString(),
    body('last_name', 'Last name is required').exists().isLength({ min: 3 }).isString(),
    body('email', 'Email is required').exists().isEmail(),
    body('location', 'Location isn required').exists().isString(),
    body('bio', 'Bio is required').exists().isString(),
  ],
  validate,
  handler
];
