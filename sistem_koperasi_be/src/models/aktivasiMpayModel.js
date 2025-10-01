import db from '../core/config/knex.js';

export const getAll = () => db('register_mpay').select();

export const create = (data) =>
  db('register_mpay').insert({
    ...data,
    created_at: db.fn.now(),
    updated_at: db.fn.now(),
  });

export const getById = (id) =>
  db('register_mpay').where({ Id: id }).first();

export const update = (id, data) =>
  db('register_mpay')
    .where({ Id: id })
    .update({
      ...data,
      updated_at: db.fn.now(),
    });

export const remove = (id) =>
  db('register_mpay').where({ Id: id }).del();
