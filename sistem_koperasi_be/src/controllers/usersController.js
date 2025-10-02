import * as UsersModel from '../models/usersModel.js';
import bcrypt from 'bcrypt';

export const index = async (req, res) => {
  try {
    const users = await UsersModel.getAllUsers();
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const show = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UsersModel.getUserById(id);
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const store = async (req, res) => {
  try {
    const { name, email, password, phonenumber, kode_perusahaan, mode, status } = req.body;

    const existing = await UsersModel.findByEmail(email);
    if (existing) return res.status(400).json({ error: 'Email sudah terdaftar' });

    const hashedPassword = await bcrypt.hash(password, 10);

    await UsersModel.createUser({
      name,
      email,
      password: hashedPassword,
      phonenumber,
      kode_perusahaan,
      mode: mode || 'light',
      status: status || 1,
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.json({ success: true, message: 'User berhasil dibuat' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phonenumber, kode_perusahaan, mode, status } = req.body;

    const dataUpdate = { name, email, phonenumber, kode_perusahaan, mode, status };

    if (password) {
      dataUpdate.password = await bcrypt.hash(password, 10);
    }

    await UsersModel.updateUser(id, dataUpdate);
    res.json({ success: true, message: 'User berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const destroy = async (req, res) => {
  try {
    const { id } = req.params;
    await UsersModel.deleteUser(id);
    res.json({ success: true, message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};