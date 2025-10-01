import db from '../core/config/knex.js';

export const getAll = () => db('mbanking_username').select();

export const getById = (id) =>
  db('mbanking_username').where({ Id: id }).first();

export const remove = (id) =>
  db('mbanking_username').where({ Id: id }).del();
