import db from '../core/config/knex.js';

export const getAll = () => db('roles').select();

export const getById = (id) =>
  db('roles').where({ id }).first();

export const create = (data) =>
  db('roles').insert({
    ...data,
    created_at: new Date(),
    updated_at: new Date(),
  });
  
export const update = (id, data) =>
  db('roles')
    .where({ id })
    .update({
      ...data,
      updated_at: new Date(),
    });

export const remove = (id) =>
  db('roles').where({ id }).del();