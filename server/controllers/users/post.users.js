const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator/check');

const Authentication = require('../../middleware/auth');

const knex = require('../../../db_connection');
const table = 'users';

const handler = async (req, res) => {
  try {
    const { password, first_name, last_name, email, location, role, bio, skills } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [ foundUser ] = await knex(table).select('*').where({ email });
    if (foundUser) {
      return res.status(409).json({ error: 'Sorry, your email is not available' });
    }

    const [user] = await knex(table).insert({
      first_name,
      last_name,
      password: hashedPassword,
      role,
      email,
      location,
      bio
    }).returning(['id', 'first_name', 'last_name', 'email', 'role']);

    const userSkills = skills.map((skill) => ({ name: skill, candidate_id: user.id }));
    if (userSkills.length) await knex('skills').insert(userSkills).returning('*');

    if (!user) {
      return res.status(400).json({ error: 'A problem occurred while creating your account. Please try again' });
    }

    const token = Authentication.generateToken(user);

    res.status(201).json({ ...user, token });
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
    body('first_name', 'First Name is Required').exists().isLength({ min: 3 }).isString(),
    body('last_name', 'Last Name is Required').exists().isLength({ min: 3 }).isString(),
    body('email', 'Email is should be valid').exists().isEmail(),
    body('password', 'At least 8 characters of password is required').exists().isLength({ min: 8 }),
    body('location', 'Location is required').exists().isString(),
    body('role').exists().isIn(['client', 'candidate']),
    body('bio', 'Bio: Give a brief Information about you').isString(),
    body('skills').isArray()
  ],
  validate,
  handler
];
