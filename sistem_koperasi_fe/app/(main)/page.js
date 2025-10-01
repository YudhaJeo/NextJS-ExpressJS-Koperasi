'use client';

import { Card } from 'primereact/card';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';

export default function Dashboard() {
  // dummy data chart
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei'],
    datasets: [
      {
        label: 'Transaksi',
        data: [10, 20, 15, 30, 25],
        backgroundColor: '#42A5F5',
      },
    ],
  };

  const barOptions = {
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true },
    },
  };

  // dummy data table
  const transaksi = [
    { id: 1, nama: 'Budi', jumlah: 50000, status: 'Selesai' },
    { id: 2, nama: 'Ani', jumlah: 75000, status: 'Proses' },
    { id: 3, nama: 'Rudi', jumlah: 100000, status: 'Batal' },
  ];

  const statusBody = (row) => {
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
      <div className="col-12">
        <Card title="Statistik Transaksi" className="mb-4">
          <Chart type="bar" data={barData} options={barOptions} className="w-full" />
        </Card>
      </div>

      <div className="col-12">
        <Card title="Data Transaksi Terakhir">
          <DataTable value={transaksi} paginator rows={5} responsiveLayout="scroll">
            <Column field="id" header="ID" />
            <Column field="nama" header="Nama" />
            <Column
              field="jumlah"
              header="Jumlah"
              body={(row) => `Rp ${row.jumlah.toLocaleString('id-ID')}`}
            />
            <Column header="Status" body={statusBody} />
          </DataTable>
        </Card>
      </div>
    </div>
  );
}
