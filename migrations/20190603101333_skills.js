
exports.up = async (knex) => {
  await knex.schema.createTable('skills', (table) => {
    table.increments().primary();
    table.string('name');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('skills');
};