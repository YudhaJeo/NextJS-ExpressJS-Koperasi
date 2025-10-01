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

export async function updateAktivasiBank(req, res) {
  try {
    const id = req.params.id;
    const { status } = req.body;

    if (status !== "0" && status !== "1") {
      return res.status(400).json({ error: 'Status harus "0" (nonaktif) atau "1" (aktif)' });
    }

    const existing = await AktivasiBank.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data user tidak ditemukan' });
    }

    await AktivasiBank.updateStatus(id, status);
    res.json({ message: `User ${existing.fullname} berhasil diperbarui`, status });
  } catch (err) {
    console.error('Gagal update aktivasi:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function deleteAktivasiBank(req, res) {
  try {
    const id = req.params.id;

    const existing = await AktivasiBank.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data user tidak ditemukan' });
    }

    await AktivasiBank.remove(id);
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
