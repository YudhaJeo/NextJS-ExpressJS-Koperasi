import * as Perusahaan from '../models/perusahaanModel.js';

export async function getAllPerusahaan(req, res) {
  try {
    const data = await Perusahaan.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal get perusahaan:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createPerusahaan(req, res) {
  try {
    const { KodePerusahaan, NamaPerusahaan } = req.body;

    if (!KodePerusahaan) {
      return res.status(400).json({ error: 'Nama perusahaan wajib diisi' });
    }

    await Perusahaan.create({ KodePerusahaan, NamaPerusahaan });

    res.json({ message: 'Perusahaan berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updatePerusahaan(req, res) {
  try {
    const id = req.params.id;
    const { KodePerusahaan, NamaPerusahaan } = req.body;

    const existing = await Perusahaan.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data perusahaan tidak ditemukan' });
    }

    await Perusahaan.update(id, { KodePerusahaan, NamaPerusahaan });
    res.json({ message: 'Perusahaan berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deletePerusahaan(req, res) {
  try {
    const id = req.params.id;

    const existing = await Perusahaan.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data perusahaan tidak ditemukan' });
    }

    await Perusahaan.remove(id);
    res.json({ message: 'Perusahaan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
