import * as AktivasiMpay from '../models/aktivasiMpayModel.js';

export async function getAllAktivasiMpay(req, res) {
  try {
    const data = await AktivasiMpay.getAll();
    res.json({ data });
  } catch (err) {
    console.error('Gagal get mpay:', err);
    res.status(500).json({ error: err.message });
  }
}

export async function createAktivasiMpay(req, res) {
  try {
    const { Nama, KodePerusahaan, KodeUnik, KodeAo, Cabang, Username, Password, Status } = req.body;

    if (!Nama || !KodePerusahaan || !KodeUnik || !KodeAo || !Cabang || !Username || !Password || !Status) {
      return res.status(400).json({ error: 'Semua data wajib diisi' });
    }

    await AktivasiMpay.create({ Nama, KodePerusahaan, KodeUnik, KodeAo, Cabang, Username, Password, Status });

    res.json({ message: 'Aktivasi Mpay berhasil ditambahkan' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateAktivasiMpay(req, res) {
  try {
    const id = req.params.id;
    const { Nama, KodePerusahaan, KodeUnik, KodeAo, Cabang, Username, Status } = req.body;

    const existing = await AktivasiMpay.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data mpay tidak ditemukan' });
    }

    await AktivasiMpay.update(id, { Nama, KodePerusahaan, KodeUnik, KodeAo, Cabang, Username, Password, Status });
    res.json({ message: 'Aktivasi Mpay berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteAktivasiMpay(req, res) {
  try {
    const id = req.params.id;

    const existing = await AktivasiMpay.getById(id);
    if (!existing) {
      return res.status(404).json({ error: 'Data Mpay tidak ditemukan' });
    }

    await AktivasiMpay.remove(id);
    res.json({ message: 'Aktivasi Mpay berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}