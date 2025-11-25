'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '../../../components/headerbar';
import TabelConfigBiayaAdmin from './components/tabelConfigBiayaAdmin';
import FormDialog from './components/formDialog';
import ToastNotifier from '../../../components/toastNotifier';
import { ConfirmDialog } from 'primereact/confirmdialog';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);

  // ✅ Perbaikan
  const [form, setForm] = useState({
    id: null,
    kode_perusahaan: '',
    biaya: '',
  });

  const [errors, setErrors] = useState({});

  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================
  // GET DATA
  // ==========================
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

  // ==========================
  // EDIT DATA (SHOW DIALOG)
  // ==========================
  const handleEdit = (row) => {
    setForm({
      id: row.id,
      kode_perusahaan: row.kode_perusahaan,
      biaya: row.biaya,
    });
    setDialogVisible(true);
  };

  // ==========================
  // VALIDATION
  // ==========================
  const validateForm = () => {
    const temp = {};
    if (!form.kode_perusahaan) temp.kode_perusahaan = "Kode perusahaan wajib diisi";
    if (!form.biaya) temp.biaya = "Biaya wajib diisi";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ==========================
  // HANDLE SUBMIT FORM
  // ==========================
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (form.id) {
        // ====================
        // UPDATE DATA
        // ====================
        await axios.put(`${API_URL}/config_biaya_admin/${form.id}`, form);
        toastRef.current?.showToast('00', 'Data berhasil diperbarui');
      } else {
        // ====================
        // CREATE DATA
        // ====================
        await axios.post(`${API_URL}/config_biaya_admin`, form);
        toastRef.current?.showToast('00', 'Data berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);

      // RESET FORM
      setForm({
        id: null,
        kode_perusahaan: '',
        biaya: '',
      });

      setErrors({});
    } catch (err) {
      console.error(err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
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

      <FormDialog
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setForm({
            id: null,
            kode_perusahaan: '',
            biaya: '',
          });
          setErrors({});
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
