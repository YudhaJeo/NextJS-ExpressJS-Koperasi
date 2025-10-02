'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function Dashboard() {
  const [cards, setCards] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [userData, setUserData] = useState([]);
  const [simpananData, setSimpananData] = useState([]);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalKredit, setTotalKredit] = useState(0);
  const [mutasiData, setMutasiData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard');
      const data = await res.json();

      // Cards
      setCards(data.cards);

      // Chart
      setChartData(data.chart);
      setChartOptions({
        plugins: { legend: { position: 'bottom' } },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      });

      // Tables
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
    if (!row.Status) return <Tag severity="secondary" value="-" />;
    switch (row.Status) {
      case 'Selesai':
        return <Tag severity="success" value={row.Status} />;
      case 'Proses':
        return <Tag severity="info" value={row.Status} />;
      case 'Batal':
        return <Tag severity="danger" value={row.Status} />;
      default:
        return <Tag severity="secondary" value={row.Status} />;
    }
  };

  return (
    <div className="grid">
      {/* Summary Cards */}
      {cards.map((c, i) => (
        <div key={i} className="col-12 md:col-3">
          <Card className="shadow-2 text-center" style={{ borderTop: `4px solid ${c.color}` }}>
            <div className="flex flex-column align-items-center">
              <i className={`${c.icon} text-4xl mb-2`} style={{ color: c.color }}></i>
              <h2 className="m-0">{c.value}</h2>
              <span className="text-600">{c.title}</span>
            </div>
          </Card>
        </div>
      ))}

      {/* Chart */}
      <div className="col-12">
        <Card title="Statistik Data" className="mb-4">
          {chartData ? (
            <div style={{ height: '300px' }}>
              <Chart type="bar" data={chartData} options={chartOptions} className="w-full h-full" />
            </div>
          ) : (
            <div className="flex justify-content-center p-5">
              <ProgressSpinner />
            </div>
          )}
        </Card>
      </div>

      {/* Tabel User */}
      <div className="col-12">
        <Card title="Data User Terbaru" subTitle="50 data terakhir">
          <DataTable
            value={userData}
            paginator
            rows={10}
            loading={loading}
            responsiveLayout="scroll"
            emptyMessage="Tidak ada data user"
          >
            <Column field="Id" header="ID" />
            <Column field="Nama" header="Nama" />
            <Column field="Username" header="Username" />
            <Column field="Cabang" header="Cabang" />
            <Column field="Status" header="Status" body={statusBody} />
            <Column field="DateTime" header="Tanggal Daftar" />
          </DataTable>
        </Card>
      </div>

      {/* Tabel Simpanan */}
      <div className="col-12">
        <Card title="Data Simpanan Terbaru" subTitle="50 data terakhir">
          <DataTable
            value={simpananData}
            paginator
            rows={10}
            loading={loading}
            responsiveLayout="scroll"
            emptyMessage="Tidak ada data simpanan"
            footer={
              <div className="flex justify-content-between font-bold px-2">
                <span>Total Debit: Rp {Number(totalDebit).toLocaleString('id-ID')}</span>
                <span>Total Kredit: Rp {Number(totalKredit).toLocaleString('id-ID')}</span>
              </div>
            }
          >
            <Column field="Tgl" header="Tanggal" />
            <Column field="Faktur" header="Faktur" />
            <Column field="Nama" header="Nama" />
            <Column field="Rekening" header="Rekening" />
            <Column field="DK" header="D/K" />
            <Column
              field="Nominal"
              header="Nominal"
              body={(row) => `Rp ${Number(row.Nominal).toLocaleString('id-ID')}`}
            />
          </DataTable>
        </Card>
      </div>

      {/* Tabel Mutasi */}
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
            <Column field="Tgl" header="Tanggal" />
            <Column field="Faktur" header="Faktur" />
            <Column field="Nama" header="Nama" />
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