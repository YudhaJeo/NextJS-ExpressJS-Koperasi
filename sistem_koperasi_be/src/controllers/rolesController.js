import * as Roles from '../models/rolesModel.js';

export async function getAllRoles(req, res) {
  try {
    const data = await Roles.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal get Roles:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createRoles(req, res) {
  try {
    const { name, guard_name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nama Role wajib diisi' });
    }

    await Roles.create({ name, guard_name: guard_name || 'web' });

    res.status(201).json({ message: 'Roles berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateRoles(req, res) {
  try {
    const id = req.params.id;
    const { name, guard_name } = req.body;

    const existing = await Roles.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data Roles tidak ditemukan' });
    }

    await Roles.update(id, { 
      name, 
      guard_name: guard_name || existing.guard_name 
    });
    
    res.json({ message: 'Roles berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteRoles(req, res) {
  try {
    const id = req.params.id;

    const existing = await Roles.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data roles tidak ditemukan' });
    }

    await Roles.remove(id);
    res.json({ message: 'Roles berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}