'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelSimpanan from './components/tabelSimpanan';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog } from 'primereact/confirmdialog';
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
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
      const res = await axios.get(`${API_URL}/simpanan`);
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const totalSetoran = data
    .filter((item) => item.DK === 'D')
    .reduce((acc, item) => acc + (item.Jumlah || 0), 0);

  const totalPenarikan = data
    .filter((item) => item.DK === 'K')
    .reduce((acc, item) => acc + (item.Jumlah || 0), 0);

  const totalMutasi = data.reduce((acc, item) => acc + (item.Jumlah || 0), 0);

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Laporan Simpanan</h3>

      <HeaderBar
        title=""
        placeholder="Cari nama, rekening, atau faktur"
        onSearch={(keyword) => {
          if (!keyword) return fetchData();
          const filtered = data.filter((item) =>
            item.Nama?.toLowerCase().includes(keyword.toLowerCase()) ||
            item.Rekening?.toLowerCase().includes(keyword.toLowerCase()) ||
            item.Faktur?.toLowerCase().includes(keyword.toLowerCase())
          );
          setData(filtered);
        }}
      />

      <div className="flex justify-between mb-3">
        <span>Total Setoran: {totalSetoran.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
        <span>Total Penarikan: {totalPenarikan.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
        <span>Total Mutasi: {totalMutasi.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
      </div>

      <TabelSimpanan
        data={data}
        loading={loading}
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