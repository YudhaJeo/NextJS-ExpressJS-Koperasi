'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '@/app/components/headerbar';
import TabelSimpanan from './components/tabelLaporanMbanking';
import ToastNotifier from '@/app/components/toastNotifier';
import { ConfirmDialog } from 'primereact/confirmdialog';
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const toastRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/laporan_mbanking`);
      setData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const totalDebit = data
    .filter((item) => item.DK === 'D')
    .reduce((acc, item) => acc + (item.Debet || 0), 0);

  const totalKredit = data
    .filter((item) => item.DK === 'K')
    .reduce((acc, item) => acc + (item.Kredit || 0), 0);

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">History Transaksi</h3>

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

      <TabelSimpanan
        data={data}
        loading={loading}
        onRefresh={fetchData}
        onPrint={() => setAdjustDialog(true)}
        totalDebit={totalDebit}
        totalKredit={totalKredit}
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

export default Page;
