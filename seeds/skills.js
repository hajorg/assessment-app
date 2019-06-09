const allSkills = ['Java', 'Go', 'Swift', 'Django', 'Python', 'JavaScript', 'PHP', 'Haskell', 'C', 'C++', 'C#',
  'Angular', 'AngularJS', 'Vue', 'React', 'Ruby', 'RoR'
];

const skills = allSkills.map(skill => ({ name: skill }));
exports.seed = async (knex) => {
  // Deletes ALL existing entries
  // await knex('skills').del();
  return await knex('skills').insert(skills);
};
