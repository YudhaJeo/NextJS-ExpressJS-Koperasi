'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelData from './components/tabelData';
import FormDialog from './components/formDialog';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import FilterTanggal from '@/app/components/filterTanggal';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState({ 
    Nama: '', 
    KodeAo: '', 
    Cabang: '', 
    Username: '', 
    Status: 1 
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({});
  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/aktivasi_mpay`);
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
    if (!form.Nama.trim()) newErrors.Nama = 'Nama wajib diisi';
    if (!form.KodeAo.trim()) newErrors.KodeAo = 'Kode AO wajib diisi';
    if (!form.Cabang.trim()) newErrors.Cabang = 'Cabang wajib diisi';
    if (!form.Username.trim()) newErrors.Username = 'Username wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.Id;
    const url = isEdit
      ? `${API_URL}/aktivasi_mpay/${form.Id}`
      : `${API_URL}/aktivasi_mpay`;

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
      setForm({ 
        Nama: '', 
        KodeAo: '', 
        Cabang: '', 
        Username: '', 
        Status: 1 
      });
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row) => {
    setForm(row);
    setDialogVisible(true);
  };

  const handleDelete = (row) => {
    confirmDialog({
      message: `Yakin hapus '${row.Nama}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/aktivasi_mpay/${row.Id}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);

    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.TANGGALMASUK);
      const from = startDate ? new Date(startDate.setHours(0, 0, 0, 0)) : null;
      const to = endDate ? new Date(endDate.setHours(23, 59, 59, 999)) : null;
      return (!from || visitDate >= from) && (!to || visitDate <= to);
    });

    setData(filtered);
  };

  const resetFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setData(originalData);
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Aktivasi M-Pay</h3>

      <div className="flex items-center justify-content-between">
        <FilterTanggal
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          handleDateFilter={handleDateFilter}
          resetFilter={resetFilter}
        />
        <HeaderBar
          title=""
          placeholder="Cari nama atau username"
          onSearch={(keyword) => {
            if (!keyword) return fetchData();
            const filtered = data.filter((item) =>
              item.Nama.toLowerCase().includes(keyword.toLowerCase()) ||
              item.Username.toLowerCase().includes(keyword.toLowerCase())
            );
            setData(filtered);
          }}
          onAddClick={() => {
            setForm({ 
              Nama: '', 
              KodeAo: '', 
              Cabang: '', 
              Username: '', 
              Status: 1 
            });
            setDialogVisible(true);
          }}
        />
      </div>

      <TabelData
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchData}
        onPrint={() => setAdjustDialog(true)}
      />

      <FormDialog
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setForm({ 
            Nama: '', 
            KodeAo: '', 
            Cabang: '', 
            Username: '', 
            Status: 1 
          });
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