import * as AktivasiBank from '../models/aktivasiMbankingModel.js';

export async function getAllAktivasiBank(req, res) {
  try {
    const data = await AktivasiBank.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal get aktivasi:', err);
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
