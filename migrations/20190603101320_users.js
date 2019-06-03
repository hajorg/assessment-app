
exports.up = async (knex) => {
  await knex.schema.createTable('users', (table) => {
    table.increments().primary();
    table.string('first_name');
    table.string('last_name');
    table.string('role');
    table.text('bio');
    table.string('image_url');
    table.string('email').unique();
    table.string('password');
    table.string('location');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('users');
};
