import db from '../core/config/knex.js';

export const getDashboardInfo = async () => {
  try {
    const totalUser = await db('users').count('id as total');
    const totalPerusahaan = await db('perusahaan').count('Id as total');
    const totalSimpanan = await db('mutasitabungan').sum('Jumlah as total');
    const totalAktivasiMbank = await db('mbanking_username').sum('id as total');

    const cards = [
      {
        title: 'Total User',
        value: totalUser[0].total,
        color: '#42A5F5',
        icon: 'pi pi-users'
      },
      {
        title: 'Total Perusahaan',
        value: totalPerusahaan[0].total,
        color: '#66BB6A',
        icon: 'pi pi-building'
      },
      {
        title: 'Total Simpanan',
        value: totalSimpanan[0].total || 0,
        color: '#FFA726',
        icon: 'pi pi-wallet'
      },
      {
        title: 'Total Mutasi',
        value: totalAktivasiMbank[0].total || 0,
        color: '#EF5350',
        icon: 'pi pi-credit-card'
      }
    ];

    const userData = await db('users')
      .select(
        'id',
        'kode_perusahaan',
        'name',
        'status',
        'created_at'
      )
      .orderBy('created_at', 'desc')
      .limit(50);

    const simpananData = await db('mutasitabungan')
      .select('Tgl', 'Faktur', 'Rekening', 'UserName', 'DK', 'Jumlah')
      .orderBy('Tgl', 'desc')
      .limit(50);

    const totalDebit = await db('mutasitabungan').where('DK', 'D').sum('Jumlah as total');
    const totalKredit = await db('mutasitabungan').where('DK', 'K').sum('Jumlah as total');

    const mutasiData = await db('mutasitabungan')
      .select('Tgl', 'Faktur', 'Rekening', 'UserName', 'Jumlah')
      .orderBy('Tgl', 'desc')
      .limit(50);

    const totalMutasi = await db('mutasitabungan').sum('Jumlah as total');

    const chartData = {
      labels: ['Debit', 'Kredit', 'Simpanan', 'Mutasi'],
      datasets: [
        {
          label: 'Statistik',
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350'],
          data: [
            totalDebit[0].total,
            totalKredit[0].total,
            totalSimpanan[0].total || 0,
            totalMutasi[0].total || 0
          ]
        }
      ]
    };

    return {
      cards,
      chart: chartData,
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
