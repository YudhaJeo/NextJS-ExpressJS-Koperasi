import * as LaporanMbanking from '../models/laporanMbankingModel.js';

export async function getAllLaporanMbanking(req, res) {
  try {
    const data = await LaporanMbanking.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal get simpanan:', err);
    res.status(500).json({ error: err.message });
  }
}