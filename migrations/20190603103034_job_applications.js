
exports.up = async (knex) => {
  await knex.schema.createTable('job_applications', (table) => {
    table.increments().primary();
    table.integer('user_id');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};
  
exports.down = async (knex) => {
  await knex.schema.dropTable('job_applications');
};
  