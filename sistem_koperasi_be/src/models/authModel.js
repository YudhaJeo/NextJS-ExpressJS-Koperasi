import db from '../core/config/knex.js';

export const findUserByEmail = async (email) => {
  const user = await db('users')
    .where({ email: email })
    .first()
    .select('*');

  return user;
};

export const createUser = async (userData) => {
  const [newUser] = await db('users')
    .insert({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      phonenumber: userData.phonenumber || null,
      status: userData.status || 0,
      kode_perusahaan: userData.kode_perusahaan || null,
      role_id: userData.role_id || null,
      created_at: new Date(),
      updated_at: new Date()
    })
    .returning('*');

  return newUser;
};

export const updateUser = async (userId, userData) => {
  const [updatedUser] = await db('users')
    .where({ id: userId })
    .update({
      ...userData,
      updated_at: new Date()
    })
    .returning('*');

  return updatedUser;
};