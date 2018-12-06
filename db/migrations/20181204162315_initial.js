exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('companies', (table) => {
      table.increments('id').primary();
      table.string('company_name');
      table.string('url');
      table.integer('company_size');
      table.integer('job_openings');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('jobs', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.string('location');
      table.string('perks');
      table.string('tech_stack');
      table.string('company_name');
      table.integer('company_id').unsigned()
      table.foreign('company_id')
        .references('companies.id');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('jobs'),
    knex.schema.dropTable('companies'),
  ]);
};
