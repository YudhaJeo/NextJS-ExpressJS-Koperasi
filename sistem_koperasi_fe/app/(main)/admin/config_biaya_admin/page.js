'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '../../../components/headerbar';
import TabelConfigBiayaAdmin from './components/tabelConfigBiayaAdmin';
import ToastNotifier from '../../../components/toastNotifier';
import { ConfirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [setDialogVisible] = useState(false);
  const [setForm] = useState({ kode_perusahaan: '', biaya: '' });

  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/config_biaya_admin`);
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setForm(row);
    setDialogVisible(true);
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Dana Admin</h3>

      <HeaderBar
        title=""
        placeholder="Cari kode atau biaya"
        onSearch={(keyword) => {
          if (!keyword) return fetchData();
          const filtered = data.filter((item) =>
            item.kode_perusahaan.toLowerCase().includes(keyword.toLowerCase()) ||
            item.biaya.toLowerCase().includes(keyword.toLowerCase())
          );
          setData(filtered);
        }}
      />

      <TabelConfigBiayaAdmin
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onRefresh={fetchData}
        onPrint={() => setAdjustDialog(true)}
      />
    </div>
  );
};

export default Page;