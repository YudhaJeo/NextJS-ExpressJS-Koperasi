import db from '../core/config/knex.js';

export const getAll = () => db('roles').select();

export const getById = (id) =>
  db('roles').where({ Id: id }).first();

export const create = (data) =>
  db('roles').insert(data);

export const update = (id, data) =>
  db('roles').where({ Id: id }).update(data);

export const remove = (id) =>
  db('roles').where({ Id: id }).del();
