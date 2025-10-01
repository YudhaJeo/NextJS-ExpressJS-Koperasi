'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelData from './components/tabelData';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [form, setForm] = useState({ 
    kode_perusahaan: "",
    no_hp: "",
    kode_unik: "", 
    cif: "", 
    nik: "", 
    fullname: "", 
    datetime: "", 
    status: "", 
  });
  const [errors, setErrors] = useState({});
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const PDFViewer = dynamic(() => import("@/app/components/PDFViewer"), { ssr: false });

  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/aktivasibank`);
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
    if (!form.kode_perusahaan.trim()) newErrors.kode_perusahaan = 'Kode Perusahaan wajib diisi';
    if (!form.no_hp.trim()) newErrors.no_hp = 'Kode Unik wajib diisi';
    if (!form.kode_unik.trim()) newErrors.kode_unik = 'CIF wajib diisi';
    if (!form.cif.trim()) newErrors.cif = 'NIK wajib diisi';
    if (!form.nik.trim()) newErrors.nik = 'Nama wajib diisi';
    if (!form.fullname.trim()) newErrors.fullname = 'No Telp wajib diisi';
    if (!form.datetime.trim()) newErrors.datetime = 'Tanggal wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const isEdit = !!form.Id;
    const url = isEdit
      ? `${API_URL}/aktivasibank/${form.id}`
      : `${API_URL}/aktivasibank`;

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
        kode_perusahaan: "",
        no_hp: "",
        kode_unik: "", 
        cif: "", 
        nik: "", 
        fullname: "", 
        datetime: "", 
        status: "",  
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
      message: `Yakin hapus '${row.fullname}'?`,
      header: 'Konfirmasi Hapus',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya',
      rejectLabel: 'Batal',
      accept: async () => {
        try {
          await axios.delete(`${API_URL}/aktivasibank/${row.id}`);
          fetchData();
          toastRef.current?.showToast('00', 'Data berhasil dihapus');
        } catch (err) {
          console.error('Gagal hapus data:', err);
          toastRef.current?.showToast('01', 'Gagal menghapus data');
        }
      },
    });
  };

  // ✅ Tambahkan fungsi nonaktifkan
  const handleDeactivate = async (row) => {
    try {
      await axios.put(`${API_URL}/aktivasibank/${row.id}`, {
        ...row,
        status: "2", // ubah ke nonaktif
      });
      toastRef.current?.showToast('00', `User ${row.fullname} berhasil dinonaktifkan`);
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeactivate={handleDeactivate}   // ✅ kirim ke TabelData
        onRefresh={fetchData}
        onPrint={() => setAdjustDialog(true)}
      />

      <AdjustPrintMarginLaporan
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
      </Dialog>
    </div>
  );
};

export default Page;
