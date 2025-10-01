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

  const handleDeactivate = async (row) => {
    try {
      await axios.put(`${API_URL}/aktivasi_mbanking/${row.id}`, {
        ...row,
        status: "0", 
      });
      toastRef.current?.showToast('00', `User ${row.fullname} berhasil dinonaktifkan`);
      fetchData();
    } catch (err) {
      console.error('Gagal nonaktifkan data:', err);
      toastRef.current?.showToast('01', 'Gagal menonaktifkan data');
    }
  };

  const handleActivate = async (row) => {
    try {
      await axios.put(`${API_URL}/aktivasi_mbanking/${row.id}`, {
        ...row,
        status: "1", 
      });
      toastRef.current?.showToast('00', `User ${row.fullname} berhasil diaktifkan`);
      fetchData();
    } catch (err) {
      console.error('Gagal nonaktifkan data:', err);
      toastRef.current?.showToast('01', 'Gagal menonaktifkan data');
    }
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
        onDeactivate={handleDeactivate}
        onActivate={handleActivate}
        onRefresh={fetchData}
        onPrint={() => setAdjustDialog(true)}
      />

    </div>
  );
};

export default Page;
