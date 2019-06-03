
exports.up = async (knex) => {
  await knex.schema.createTable('job_skills', (table) => {
    table.increments().primary();
    table.integer('skill_id');
    table.integer('job_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('job_skills');
};
