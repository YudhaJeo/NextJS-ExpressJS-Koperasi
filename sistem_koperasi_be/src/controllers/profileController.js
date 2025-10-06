import * as ProfileModel from '../models/profileModel.js';
import validator from 'validator';

export async function getUser(req, res) {
  try {
    const id = req.user.id;
    const data = await ProfileModel.getById(id);
    res.json({ data: { id: data.id, name: data.name, email: data.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengambil data profil' });
  }
}

export async function updateUser(req, res) {
  try {
    const { id: id, name, email } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'ID user wajib diisi' });
    }

    // Validasi input
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Username wajib diisi' });
    }

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email tidak valid' });
    }

    // Cek keunikan name dan email
    const existingUser = await ProfileModel.checkUniqueUser(id, name, email);
    if (existingUser) {
      return res.status(400).json({ error: 'Username atau email sudah digunakan' });
    }

    const data = { name, email };

    await ProfileModel.updateProfile(id, data);
    res.json({ message: 'Profil berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memperbarui profil' });
  }
}
