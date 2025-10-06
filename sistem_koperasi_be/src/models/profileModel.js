import db from '../core/config/knex.js';

export const getById = (id) =>
  db('users').where({ id: id }).first();

export const updateProfile = async (id, data) => {
  const baseData = {
    name: data.name,
    email: data.email,
  };

  return db('users')
    .where({ id: id })
    .update(baseData);
};

export const checkUniqueUser = async (currentUserId, name, email) => {
  const existingUser = await db('users')
    .where(function() {
      this.where('name', name).orWhere('email', email)
    })
    .whereNot('id', currentUserId)
    .first();

  return existingUser;
};
