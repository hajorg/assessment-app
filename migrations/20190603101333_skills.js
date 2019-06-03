
exports.up = async (knex) => {
  await knex.schema.createTable('skills', (table) => {
    table.increments().primary();
    table.string('name');
    table.integer('job_id');
    table.integer('candidate_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('skills');
};