import * as Users from '../models/usersModel.js';
import bcrypt from 'bcrypt';

export async function getAllUsers(req, res) {
  try {
    const data = await Users.getAllUsers();
    res.json({ data });
  } catch (err) {
    console.error('Gagal ambil users:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getUserById(req, res) {
  try {
    const id = req.params.id;
    const user = await Users.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json({ data: user });
  } catch (err) {
    console.error('Gagal ambil user:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createUser(req, res) {
  try {
    const {
      name,
      email,
      password,
      phonenumber,
      kode_perusahaan,
      mode,
      status,
      role_id,  
    } = req.body;

    const existing = await Users.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Users.createUser({
      name,
      email,
      password: hashedPassword,
      phonenumber,
      kode_perusahaan,
      role_id: role_id || null,  
      mode: mode || 'light',
      status: status ?? 1, 
      created_at: new Date(),
      updated_at: new Date(),
    });

    res.json({ message: 'User berhasil dibuat' });
  } catch (err) {
    console.error('Gagal membuat user:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const id = req.params.id;
    const {
      name,
      email,
      password,
      phonenumber,
      kode_perusahaan,
      mode,
      status,
      role_id,
    } = req.body;

    const existing = await Users.getUserById(id);
    if (!existing) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    const dataUpdate = {
      name,
      email,
      phonenumber,
      kode_perusahaan,
      mode,
      status,
      role_id: role_id || null,
    };

    if (password) {
      dataUpdate.password = await bcrypt.hash(password, 10);
    }

    await Users.updateUser(id, dataUpdate);
    res.json({ message: 'User berhasil diperbarui' });
  } catch (err) {
    console.error('Gagal update user:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const id = req.params.id;

    const existing = await Users.getUserById(id);
    if (!existing) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    await Users.deleteUser(id);
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    console.error('Gagal hapus user:', err);
    res.status(500).json({ error: err.message });
  }
}
