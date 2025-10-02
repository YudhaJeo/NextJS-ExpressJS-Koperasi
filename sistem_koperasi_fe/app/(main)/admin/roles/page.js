'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '../../../components/headerbar';
import TabelData from './components/tabelRoles';
import FormDialog from './components/formDialog';
import ToastNotifier from '../../../components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const RolesPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState({ 
    id: '', 
    name: '', 
    guard_name: 'web' 
  });
  const [errors, setErrors] = useState({});
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("../../../components/PDFViewer"), { ssr: false });

  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/roles`);
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
    if (!form.name.trim()) newErrors.name = 'Nama Role wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.id;
    const url = isEdit
      ? `${API_URL}/roles/${form.id}`
      : `${API_URL}/roles`;

    try {
      if (isEdit) {
        await axios.put(url, form);
        toastRef.current?.showToast('00', 'Role berhasil diperbarui');
      } else {
        await axios.post(url, form);
        toastRef.current?.showToast('00', 'Role berhasil ditambahkan');
      }

      fetchData();
      setDialogVisible(false);
      setForm({ name: ''});
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
      message: `Yakin hapus role '${row.name}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/roles/${row.id}`);
          fetchData();
          toastRef.current?.showToast('00', 'Role berhasil dihapus');
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

      <h3 className="text-xl font-semibold mb-3">Master Data Roles</h3>

      <HeaderBar
        title=""
        placeholder="Cari nama role"
        onSearch={(keyword) => {
          if (!keyword) return fetchData();
          const filtered = data.filter((item) =>
            item.name.toLowerCase().includes(keyword.toLowerCase())
          );
          setData(filtered);
        }}
        onAddClick={() => {
          setForm({ id: '', name: '', guard_name: 'web' });
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

      <FormDialog
        visible={dialogVisible}
        onHide={() => {
          setDialogVisible(false);
          setForm({ id: '', name: '', guard_name: 'web' });
        }}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        errors={errors}
      />

      {/* <AdjustPrintMarginLaporan
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
        header="Preview PDF"
      >
        <PDFViewer pdfUrl={pdfUrl} fileName={fileName} paperSize="A4" />
      </Dialog> */}
    </div>
  );
};

export default RolesPage;