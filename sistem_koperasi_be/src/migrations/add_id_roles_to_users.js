// migration file: add_role_id_to_users.js

export const up = function (knex) {
    return knex.schema.alterTable('users', (table) => {
      table
        .bigInteger('role_id')
        .unsigned()
        .nullable()
        .after('kode_perusahaan');
  
      table
        .foreign('role_id')
        .references('id')
        .inTable('roles')
        .onDelete('SET NULL'); 
    });
  };
  
  export const down = function (knex) {
    return knex.schema.alterTable('users', (table) => {
      table.dropForeign('role_id');
      table.dropColumn('role_id');
    });
  };
  