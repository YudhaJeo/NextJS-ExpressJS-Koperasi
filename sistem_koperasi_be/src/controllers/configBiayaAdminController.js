import * as DanaAdmin from '../models/configBiayaAdminModel.js';

export async function getAllConfigBiayaAdmin(req, res) {
  try {
    const data = await DanaAdmin.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal get data config biaya admin:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function updateConfigBiayaAdmin(req, res) {
  try {
    const id = req.params.id;
    const { kode_perusahaan, biaya } = req.body;

    const existing = await DanaAdmin.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data config biaya admin tidak ditemukan' });
    }

    await DanaAdmin.update(id, { kode_perusahaan, biaya });
    res.json({ message: 'Data config biaya admin berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}