import * as AktivasiBank from '../models/aktivasibankModel.js';

export async function getAllAktivasiBank(req, res) {
  try {
    const data = await AktivasiBank.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal get aktivasi:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createAktivasiBank(req, res) {
  try {
    const { kode_perusahaan, no_hp, kode_unik, cif, nik, fullname, datetime, status} = req.body;

    if (! kode_perusahaan, no_hp, kode_unik, cif, nik, fullname, datetime, status) {
      return res.status(400).json({ error: 'Field wajib diisi' });
    }

    await AktivasiBank.create({  kode_perusahaan, no_hp, kode_unik, cif, nik, fullname, datetime, status });

    res.json({ message: 'Aktivasi Bank berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateAktivasiBank(req, res) {
  try {
    const id = req.params.id;
    const {  kode_perusahaan, no_hp, kode_unik, cif, nik, fullname, datetime, status } = req.body;

    const existing = await AktivasiBank.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data Aktivasi tidak ditemukan' });
    }

    await AktivasiBank.update(id, {  kode_perusahaan, no_hp, kode_unik, cif, nik, fullname, datetime, status });
    res.json({ message: 'Aktivasi berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteAktivasiBank(req, res) {
  try {
    const id = req.params.id;

    const existing = await AktivasiBank.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data perusahaan tidak ditemukan' });
    }

    await AktivasiBank.remove(id);
    res.json({ message: 'Perusahaan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
