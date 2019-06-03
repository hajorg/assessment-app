
exports.up = async (knex) => {
  await knex.schema.createTable('user_skills', (table) => {
    table.increments().primary();
    table.integer('skill_id');
    table.integer('user_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('user_skills');
};
  