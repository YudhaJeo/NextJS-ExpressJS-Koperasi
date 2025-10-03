import db from '../core/config/knex.js';

export const getAllUsers = () => {
  return db('users')
    .leftJoin('roles', 'users.role_id', 'roles.id')
    .select(
      'users.*',           
      'roles.name as role_name'
    );
};

export const getUserById = (id) => {
  return db('users')
    .leftJoin('roles', 'users.role_id', 'roles.id')
    .select(
      'users.*',
      'roles.name as role_name'
    )
    .where('users.id', id)
    .first();
};

export const createUser = (data) => {
  return db('users').insert(data);
};

export const updateUser = (id, data) => {
  return db('users')
    .where({ id })
    .update({
      ...data,
      updated_at: db.fn.now()
    });
};

export const deleteUser = (id) => {
  return db('users').where({ id }).del();
};

export const findByEmail = (email) => {
  return db('users').where({ email }).first();
};
