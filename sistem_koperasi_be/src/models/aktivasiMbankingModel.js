import db from '../core/config/knex.js';

export const getAll = () => db('mbanking_username').select();

export const getById = (id) =>
  db('mbanking_username').where({ Id: id }).first();

export const updateStatus = (id, status) =>
  db('mbanking_username').where({ Id: id }).update({ status, updated_at: db.fn.now() });

export const remove = (id) =>
  db('mbanking_username').where({ Id: id }).del();