const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator/check');

const knex = require('../../../db_connection');
const table = 'users';

const handler = async (req, res) => {
  try {
    const { password, first_name, last_name, email, location, role, bio, skills } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
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


    const token = jwt.sign({ user }, process.env.APP_SECRET, { expiresIn: '2h' });

    res.status(201).json({ ...user, token });
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
    body('first_name').exists().isLength({ min: 3 }).isString(),
    body('last_name').exists().isLength({ min: 3 }).isString(),
    body('email').exists().isEmail(),
    body('password').exists().isLength({ min: 8 }),
    body('location').exists().isString(),
    body('role').exists().isIn(['client', 'candidate']),
    body('bio').isString(),
    body('skills').isArray()
  ],
  validate,
  handler
];
