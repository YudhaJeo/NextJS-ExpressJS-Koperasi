import db from '../core/config/knex.js';

export const getAll = () => db('mbanking_danaadmin').select();

export const getById = (id) =>
  db('mbanking_danaadmin').where({ id }).first();

export const update = (id, data) =>
  db('mbanking_danaadmin').where({ id }).update(data);