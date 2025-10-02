'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import HeaderBar from '../../../../components/headerbar';
import TabelSimpanan from './components/tabelSimpanan';
import ToastNotifier from '../../../../components/toastNotifier';
import { ConfirmDialog } from 'primereact/confirmdialog';
import AdjustPrintMarginLaporan from "./print/adjustPrintMarginLaporan";
import { Dialog } from "primereact/dialog";
import dynamic from "next/dynamic";
import FilterTanggal from '../../../../components/filterTanggal';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Page = () => {
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adjustDialog, setAdjustDialog] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [jsPdfPreviewOpen, setJsPdfPreviewOpen] = useState(false);
  const toastRef = useRef(null);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/simpanan`);
      setData(res.data.data);
      setOriginalData(res.data.data);
    } catch (err) {
      console.error('Gagal ambil data:', err);
      toastRef.current?.showToast('01', 'Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilter = () => {
    if (!startDate && !endDate) return setData(originalData);

    const filtered = originalData.filter((item) => {
      const visitDate = new Date(item.DateTime);
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

  const totalSetoran = data
    .filter((item) => item.Faktur?.startsWith("MT"))
    .reduce((acc, item) => acc + (item.Jumlah || 0), 0);

  const totalPenarikan = data
    .filter((item) => item.Faktur?.startsWith("MP"))
    .reduce((acc, item) => acc + (item.Jumlah || 0), 0);

  const totalMutasi = data.reduce((acc, item) => acc + (item.Jumlah || 0), 0);

  return (
    <div className="card">
      <ToastNotifier ref={toastRef} />
      <ConfirmDialog />

      <h3 className="text-xl font-semibold mb-3">Laporan Simpanan</h3>

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
    </div>

      <div className="flex justify-between mb-2">
      <span className="font-semibold">
        Total Setoran:{" "}
        {totalSetoran.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })}
      </span>

      <span className="font-semibold">
        Total Penarikan:{" "}
        {totalPenarikan.toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
        })}
      </span>
    </div>

      <TabelSimpanan
        data={data}
        loading={loading}
        onRefresh={fetchData}
        onPrint={() => setAdjustDialog(true)}
        totalMutasi={totalMutasi}
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