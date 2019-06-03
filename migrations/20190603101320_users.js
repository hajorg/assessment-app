
exports.up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments().primary();
    table.string('first_name');
    table.string('last_name');
    table.string('client');
    table.string('email');
    table.string('password');
    table.string('location');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('users');
};
