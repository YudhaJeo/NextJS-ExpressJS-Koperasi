'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '../../../components/headerbar';
import TabelData from './components/tabelUsers';
import FormDialogUser from './components/formDialog';
import ToastNotifier from '../../../components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import AdjustPrintMarginUsers from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UsersPage = () => {
  const [data, setData] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [perusahaan, setPerusahaan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    role_id: '',
    kode_perusahaan: '',
    status: 1
  });
  const [errors, setErrors] = useState({});
  const toastRef = useRef(null);
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("../../../components/PDFViewer"), { ssr: false });

  useEffect(() => {
    fetchData();
    fetchRoles();
    fetchPerusahaan();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users`);
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get(`${API_URL}/roles`);
      const options = res.data.data.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setRoleOptions(options);
    } catch (err) {
      console.error('Gagal ambil role:', err);
    }
  };

  const fetchPerusahaan = async () => {
    try {
      const res = await axios.get(`${API_URL}/perusahaan`);
      setPerusahaan(res.data.data);
    } catch (err) {
      console.error('Gagal ambil perusahaan:', err);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Nama wajib diisi';
    if (!form.email.trim()) newErrors.email = 'Email wajib diisi';
    if (!form.password && !form.id) newErrors.password = 'Password wajib diisi';
    if (!form.role_id) newErrors.role_id = 'Role wajib dipilih';
    if (!form.kode_perusahaan) newErrors.kode_perusahaan = 'Kode perusahaan wajib dipilih';
    if (!form.status) newErrors.status = 'Status status wajib dipilih';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.id;
    const url = isEdit
      ? `${API_URL}/users/${form.id}`
      : `${API_URL}/users`;

    try {
      if (isEdit) {
        await axios.put(url, form);
        toastRef.current?.showToast('00', 'User berhasil diperbarui');
      } else {
        await axios.post(url, form);
        toastRef.current?.showToast('00', 'User berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);
      setForm({
        id: '',
        name: '',
        email: '',
        password: '',
        role_id: '',
        kode_perusahaan: '',
        status: 1
      });
    } catch (err) {
      console.error('Gagal simpan data:', err);
      toastRef.current?.showToast('01', 'Gagal menyimpan data');
    }
  };

  const handleEdit = (row) => {
    setForm({
      id: row.id,
      name: row.name,
      email: row.email,
      password: '',
      role_id: row.role_id ?? '', 
      kode_perusahaan: row.kode_perusahaan ?? '',
      status: row.status === 1 ? 1 : 2 // Pastikan status sesuai dengan dropdown di formDialog
    });
    setDialogVisible(true);
  };
  

  const handleDelete = (row) => {
    confirmDialog({
      message: `Yakin hapus user '${row.name}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/users/${row.id}`);
          fetchData();
          toastRef.current?.showToast('00', 'User berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Master Data Users</h3>

      <HeaderBar
        title=""
        placeholder="Cari user"
        onSearch={(keyword) => {
          if (!keyword) return fetchData();
          const filtered = data.filter((item) =>
            item.name.toLowerCase().includes(keyword.toLowerCase())
          );
          setData(filtered);
        }}
        onAddClick={() => {
          setForm({
            id: '',
            name: '',
            email: '',
            password: '',
            role_id: '',
            kode_perusahaan: '',
            status: 1
          });
          setDialogVisible(true);
        }}
      />

      <TabelData
        data={data}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={fetchData}
        onPrint={() => setAdjustDialog(true)}
      />

      <FormDialogUser
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setForm({
            id: '',
            name: '',
            email: '',
            password: '',
            role_id: '',
            kode_perusahaan: '',
            status: 1
          });
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
        roleOptions={roleOptions}
        perusahaanOptions={perusahaan}
      />

      <AdjustPrintMarginUsers
        adjustDialog={adjustDialog}
        setAdjustDialog={setAdjustDialog}
        selectedRow={null}
        data={data}
        setPdfUrl={setPdfUrl}
        setFileName={setFileName}
        setJsPdfPreviewOpen={setJsPdfPreviewOpen}
      />

      <Dialog
        visible={jsPdfPreviewOpen}
        onHide={() => setJsPdfPreviewOpen(false)}
        modal
        style={{ width: "90vw", height: "90vh" }}
        header={`Preview PDF - ${fileName}`}
      >
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            style={{ width: "100%", height: "80vh", border: "none" }}
          />
        ) : (
          <p>PDF belum tersedia</p>
        )}
      </Dialog>
    </div>
  );
};

export default UsersPage;