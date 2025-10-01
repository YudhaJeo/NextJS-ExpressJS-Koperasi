import db from '../core/config/knex.js';

export const getAll = () => db('perusahaan').select();

export const getById = (id) =>
  db('perusahaan').where({ Id: id }).first();

export const create = (data) =>
  db('perusahaan').insert(data);

export const update = (id, data) =>
  db('perusahaan').where({ Id: id }).update(data);

export const remove = (id) =>
  db('perusahaan').where({ Id: id }).del();
