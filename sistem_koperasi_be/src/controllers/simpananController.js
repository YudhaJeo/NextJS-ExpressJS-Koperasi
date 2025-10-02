import * as Simpanan from '../models/simpananModel.js';

export async function getAllSimpanan(req, res) {
  try {
    const data = await Simpanan.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal get simpanan:', err);
    res.status(500).json({ error: err.message });
  }
}