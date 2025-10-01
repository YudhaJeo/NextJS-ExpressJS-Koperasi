import db from '../core/config/knex.js';

export const getAll = () => db('mbanking_username').select();

export const getById = (id) =>
  db('mbanking_username').where({ Id: id }).first();

export const create = (data) =>
  db('mbanking_username').insert(data);

export const update = (id, data) =>
  db('mbanking_username').where({ Id: id }).update(data);

export const remove = (id) =>
  db('mbanking_username').where({ Id: id }).del();
