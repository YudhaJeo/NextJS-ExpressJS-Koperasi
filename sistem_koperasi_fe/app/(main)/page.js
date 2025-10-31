'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const [chartAktivasi, setChartAktivasi] = useState(null);
  const [chartTransaksi, setChartTransaksi] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [userData, setUserData] = useState([]);
  const [simpananData, setSimpananData] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalKredit, setTotalKredit] = useState(0);
  const [mutasiData, setMutasiData] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return '-';
    return date.toISOString().split('T')[0];
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/dashboard`);
      const data = await res.json();

      setCards(data.cards);
      setChartAktivasi(data.chartAktivasi);
      setChartTransaksi(data.chartTransaksi);
      setChartOptions({
        plugins: { legend: { position: 'bottom' } },
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      });

      setUserData(data.tabelUser || []);
      setSimpananData(data.tabelSimpanan.data || []);
      setTotalDebit(data.tabelSimpanan.totalDebit || 0);
      setTotalKredit(data.tabelSimpanan.totalKredit || 0);
      setMutasiData(data.tabelMutasi.data || []);
    } catch (err) {
      console.error('Gagal fetch data dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statusBody = (row) => {
    if (row.status === null || row.status === undefined || row.status === '') {
      return <Tag severity="secondary" value="Tidak Ada Status" />;
    }

    if (typeof row.status === 'number') {
      switch (row.status) {
        case 1:
          return <Tag severity="success" value="Aktif" />;
        case 2:
          return <Tag severity="danger" value="Tidak Aktif" />;
        case 0:
        default:
          return <Tag severity="secondary" value="Tidak Ada Status" />;
      }
    }

    switch (row.status) {
      case 'Selesai':
        return <Tag severity="success" value={row.status} />;
      case 'Proses':
        return <Tag severity="info" value={row.status} />;
      case 'Batal':
        return <Tag severity="danger" value={row.status} />;
      default:
        return <Tag severity="secondary" value={row.status} />;
    }
  };

  return (
    <div className="grid">
      {/* === Bagian Card Atas (ditambahkan tombol View) === */}
      {cards.map((c, i) => (
        <div key={i} className="col-12 md:col-3">
          <Card className="shadow-2 text-center" style={{ borderTop: `4px solid ${c.color}` }}>
            <div className="flex flex-column align-items-center">
              <i className={`${c.icon} text-4xl mb-2`} style={{ color: c.color }}></i>
              <h2 className="m-0">{c.value}</h2>
              <span className="text-600">{c.title}</span>

              {/* Tombol View */}
              <Button
                label="View"
                icon="pi pi-arrow-right"
                className="p-button-sm mt-3"
                style={{
                  backgroundColor: c.color,
                  borderColor: c.color,
                }}
                onClick={() => {
                  const title = c.title.toLowerCase();
                  if (title.includes('user')) router.push('/admin/users');
                  else if (title.includes('perusahaan')) router.push('/admin/perusahaan');
                  else if (title.includes('mbanking')) router.push('/admin/aktivasi_mbanking');
                  else if (title.includes('mpay')) router.push('/admin/aktivasi_mpay');
                  else console.warn('Belum ada rute untuk:', c.title);
                }}
              />
            </div>
          </Card>
        </div>
      ))}

      {/* === Statistik Aktivasi === */}
      <div className="col-12 md:col-6">
        <Card title="Statistik Aktivasi" className="mb-4">
          {chartAktivasi ? (
            <div style={{ height: '300px' }}>
              <Chart type="bar" data={chartAktivasi} options={chartOptions} className="w-full h-full" />
            </div>
          ) : (
            <div className="flex justify-content-center p-5">
              <ProgressSpinner />
            </div>
          )}
        </Card>
      </div>

      {/* === Statistik Transaksi === */}
      <div className="col-12 md:col-6">
        <Card title="Statistik Transaksi" className="mb-4">
          {chartTransaksi ? (
            <div style={{ height: '300px' }}>
              <Chart type="bar" data={chartTransaksi} options={chartOptions} className="w-full h-full" />
            </div>
          ) : (
            <div className="flex justify-content-center p-5">
              <ProgressSpinner />
            </div>
          )}
        </Card>
      </div>

      {/* === Data User Terbaru === */}
      <div className="col-12">
        <Card title="Data User Terbaru" subTitle="10 data terakhir">
          <DataTable
            value={userData}
            paginator
            rows={10}
            loading={loading}
            responsiveLayout="scroll"
            emptyMessage="Tidak ada data user"
          >
            <Column field="id" header="No" />
            <Column field="name" header="Nama" />
            <Column field="kode_perusahaan" header="Cabang" />
            <Column field="status" header="Status" body={statusBody} />
            <Column field="created_at" header="Tanggal Daftar" body={(row) => formatDate(row.created_at)} />
          </DataTable>
        </Card>
      </div>

      {/* === Data Simpanan Terbaru === */}
      <div className="col-12">
        <Card title="Data Simpanan Terbaru" subTitle="10 data terakhir">
          <DataTable
            value={simpananData}
            paginator
            rows={10}
            loading={loading}
            responsiveLayout="scroll"
            emptyMessage="Tidak ada data simpanan"
          >
            <Column field="Tgl" header="Tanggal" body={(row) => formatDate(row.Tgl)} />
            <Column field="Faktur" header="Faktur" />
            <Column field="UserName" header="Nama" />
            <Column field="Rekening" header="Rekening" />
            <Column
              field="DK"
              header="Debit/Kredit"
              body={(row) => (row.DK === 'D' ? 'Debit' : row.DK === 'K' ? 'Kredit' : row.DK)}
            />
            <Column
              field="Jumlah"
              header="Nominal"
              body={(row) => `Rp ${Number(row.Jumlah).toLocaleString('id-ID')}`}
            />
          </DataTable>
        </Card>
      </div>

      {/* === Data Mutasi Terakhir === */}
      <div className="col-12">
        <Card title="Data Mutasi Terakhir" subTitle="10 data terakhir">
          <DataTable
            value={mutasiData}
            paginator
            rows={10}
            loading={loading}
            responsiveLayout="scroll"
            emptyMessage="Tidak ada data mutasi"
          >
            <Column field="Tgl" header="Tanggal" body={(row) => formatDate(row.Tgl)} />
            <Column field="Faktur" header="Faktur" />
            <Column field="UserName" header="Nama" />
            <Column field="Rekening" header="Rekening" />
            <Column
              field="Jumlah"
              header="Jumlah"
              body={(row) => `Rp ${Number(row.Jumlah).toLocaleString('id-ID')}`}
            />
          </DataTable>
          <div className="mt-3 text-right">
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              className="p-button-outlined p-button-info"
              onClick={fetchDashboardData}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
