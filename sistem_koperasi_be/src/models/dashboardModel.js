import db from '../core/config/knex.js';

export const getDashboardInfo = async () => {
  try {
    const totalUser = await db('users').count('id as total');
    const totalPerusahaan = await db('perusahaan').count('Id as total');

    const totalAktivasiMbank = await db('mbanking_username').count('Id as total');
    const totalAktivasiMpay = await db('register_mpay').count('Id as total');

    const totalDebit = await db('mutasitabungan').where('DK', 'D').sum('Jumlah as total');
    const totalKredit = await db('mutasitabungan').where('DK', 'K').sum('Jumlah as total');
    const totalSimpanan = await db('mutasitabungan').sum('Jumlah as total');
    const totalMutasi = await db('mutasitabungan').sum('Jumlah as total');

    const cards = [
      {
        title: 'Total User',
        value: totalUser[0].total,
        color: '#42A5F5',
        icon: 'pi pi-user'
      },
      {
        title: 'Total Perusahaan',
        value: totalPerusahaan[0].total,
        color: '#66BB6A',
        icon: 'pi pi-building-columns'
      },
      {
        title: 'Total Aktivasi Mbanking',
        value: totalAktivasiMbank[0].total || 0,
        color: '#FFA726',
        icon: 'pi pi-mobile'
      },
      {
        title: 'Total Aktivasi Mpay',
        value: totalAktivasiMpay[0].total || 0,
        color: '#EF5350',
        icon: 'pi pi-wallet'
      }
    ];

    const userData = await db('users')
      .select('id', 'kode_perusahaan', 'name', 'status', 'created_at')
      .orderBy('created_at', 'desc')
      .limit(10);

    const simpananData = await db('mutasitabungan')
      .select('Tgl', 'Faktur', 'Rekening', 'UserName', 'DK', 'Jumlah')
      .orderBy('Tgl', 'desc')
      .limit(10);

    const mutasiData = await db('mutasitabungan')
      .select('Tgl', 'Faktur', 'Rekening', 'UserName', 'Jumlah')
      .orderBy('Tgl', 'desc')
      .limit(10);

    const chartAktivasi = {
      labels: ['User', 'Perusahaan', 'Mbanking', 'Mpay'],
      datasets: [
        {
          label: 'Statistik Aktivasi',
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350'],
          data: [
            totalUser[0].total,
            totalPerusahaan[0].total,
            totalAktivasiMbank[0].total || 0,
            totalAktivasiMpay[0].total || 0
          ]
        }
      ]
    };

    const chartTransaksi = {
      labels: ['Debit', 'Kredit', 'Simpanan', 'Mutasi'],
      datasets: [
        {
          label: 'Statistik Transaksi',
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350'],
          data: [
            totalDebit[0].total || 0,
            totalKredit[0].total || 0,
            totalSimpanan[0].total || 0,
            totalMutasi[0].total || 0
          ]
        }
      ]
    };

    return {
      cards,
      chartAktivasi,
      chartTransaksi,
      tabelUser: userData,
      tabelSimpanan: {
        data: simpananData,
        totalDebit: totalDebit[0].total || 0,
        totalKredit: totalKredit[0].total || 0
      },
      tabelMutasi: {
        data: mutasiData,
        totalMutasi: totalMutasi[0].total || 0
      }
    };
  } catch (error) {
    console.error('Error getDashboardInfo:', error);
    throw error;
  }
};