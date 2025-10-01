'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelData from './components/tabelData';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/aktivasi_mbanking`);
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Yakin hapus '${row.fullname}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/aktivasi_mbanking/${row.id}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  const handleToggleStatus = (row) => {
    const isActive = String(row.status).trim() === "1";
    const newStatus = isActive ? "0" : "1";
    const actionText = isActive ? "menonaktifkan" : "mengaktifkan";

    confirmDialog({
      message: `Yakin ingin ${actionText} user '${row.fullname}'?`,
      header: 'Konfirmasi Status',
      icon: 'pi pi-question-circle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.put(`${API_URL}/aktivasi_mbanking/${row.id}`, {
            ...row,
            status: newStatus,
          });
          toastRef.current?.showToast(
            '00',
            `User ${row.fullname} berhasil ${actionText}`
          );
          fetchData();
        } catch (err) {
          console.error(`Gagal ${actionText} data:`, err);
          toastRef.current?.showToast(
            '01',
            `Gagal ${actionText} user ${row.fullname}`
          );
        }
      },
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Aktivasi Mbanking</h3>

      <HeaderBar
        title=""
        placeholder="Cari nama atau kode"
        onSearch={(keyword) => {
          if (!keyword) return fetchData();
          const filtered = data.filter((item) =>
            item.kode_perusahaan.toLowerCase().includes(keyword.toLowerCase()) ||
            item.fullname.toLowerCase().includes(keyword.toLowerCase())
          );
          setData(filtered);
        }}
      />

      <TabelData
        data={data}
        loading={loading}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        onRefresh={fetchData}
      />
    </div>
  );
};

export default Page;