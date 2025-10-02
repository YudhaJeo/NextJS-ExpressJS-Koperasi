import db from '../core/config/knex.js';

export const getAll = () => db('mutasitabungan').select();

export const getById = (id) =>
  db('mutasitabungan').where({ ID: id }).first();