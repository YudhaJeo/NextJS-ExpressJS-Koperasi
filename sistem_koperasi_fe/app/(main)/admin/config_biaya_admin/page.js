'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelConfigBiayaAdmin from './components/tabelConfigBiayaAdmin';
import FormDialogConfigBiayaAdmin from './components/formDialogConfigBiayaAdmin';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState({ kode_perusahaan: '', biaya: '' });
  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};
    if (!form.kode_perusahaan.trim()) newErrors.kode_perusahaan = 'Kode perusahaan wajib diisi';
    if (!form.biaya.trim()) newErrors.biaya = 'Biaya wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.id;
    const url = isEdit
      ? `${API_URL}/config_biaya_admin/${form.id}`
      : `${API_URL}/config_biaya_admin`;

    try {
      if (isEdit) {
        await axios.put(url, form);
        toastRef.current?.showToast('00', 'Data berhasil diperbarui');
      } else {
        await axios.post(url, form);
        toastRef.current?.showToast('00', 'Data berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);
      setForm({ kode_perusahaan: '', biaya: '' });
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
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

      <FormDialogConfigBiayaAdmin
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setForm({ kode_perusahaan: '', biaya: '' });
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
      />
    </div>
  );
};

export default Page;