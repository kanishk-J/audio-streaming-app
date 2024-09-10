exports.seed = function(knex) {
    // Deletes ALL existing entries
    return knex('music_files').del()
      .then(function () {
        // Creates the table if it doesn't exist
        return knex.schema.createTableIfNotExists('music_files', function(table) {
          table.increments('id').primary();
          table.string('title').notNullable();
          table.string('artist');
          table.string('album');
          table.integer('year');
          table.string('genre');
          table.string('path').notNullable();
          table.timestamp('modified_at').defaultTo(knex.fn.now());
          table.timestamps(true, true);
  
          // Add unique index on title and album
          table.unique(['title', 'album']);
        });
      });
};