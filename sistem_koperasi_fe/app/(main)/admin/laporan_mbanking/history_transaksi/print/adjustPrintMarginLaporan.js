'use client'

import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { Toolbar } from 'primereact/toolbar'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

export default function AdjustPrintMarginLaporan({
  adjustDialog,
  setAdjustDialog,
  data = [],
  setPdfUrl,
  setFileName,
  setJsPdfPreviewOpen,
}) {
  const [loadingExport, setLoadingExport] = useState(false);
  const [dataAdjust, setDataAdjust] = useState({
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 10,
    paperSize: 'A4',
    orientation: 'portrait',
  });

  const paperSizes = [
    { name: 'A4', value: 'A4' },
    { name: 'Letter', value: 'Letter' },
    { name: 'Legal', value: 'Legal' },
  ];
  const orientationOptions = [
    { label: 'Potrait', value: 'portrait' },
    { label: 'Lanskap', value: 'landscape' },
  ];

  const onInputChangeNumber = (e, name) => {
    setDataAdjust((prev) => ({ ...prev, [name]: e.value || 0 }));
  };

  const onInputChange = (e, name) => {
    setDataAdjust((prev) => ({ ...prev, [name]: e.value }));
  };

  const addHeader = (doc, title, marginLeft, marginTop, marginRight) => {
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('Koperasi', pageWidth / 2, marginTop + 5, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Jl. A. Yani No. 84, Pangongangan, Kec. Manguharjo, Kota Madiun, Jawa Timur', pageWidth / 2, marginTop + 12, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    doc.text('Telp: (0351) 876-9090', pageWidth / 2, marginTop + 17, { align: 'center' });

    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(marginLeft, marginTop + 22, pageWidth - marginRight, marginTop + 22);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text(title, pageWidth / 2, marginTop + 29, { align: 'center' });

    const today = new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`Dicetak: ${today}`, marginLeft, marginTop + 37, { align: 'left' });

    return marginTop + 43;
  };

  async function exportPDF(adjustConfig) {
    const doc = new jsPDF({
      orientation: adjustConfig.orientation,
      unit: 'mm',
      format: adjustConfig.paperSize,
    });

    const marginLeft = parseFloat(adjustConfig.marginLeft);
    const marginTop = parseFloat(adjustConfig.marginTop);
    const marginRight = parseFloat(adjustConfig.marginRight);
    const pageWidth = doc.internal.pageSize.width;

    const startY = addHeader(doc, 'Laporan Mbanking', marginLeft, marginTop, marginRight);

    const totalDebit = data
      .filter((item) => item.DK === 'D')
      .reduce((acc, item) => acc + (item.Jumlah || 0), 0);

    const totalKredit = data
      .filter((item) => item.DK === 'K')
      .reduce((acc, item) => acc + (item.Jumlah || 0), 0);

    const dkTemplate = (rowData) => {
      if (rowData.DK === "D") return "Debit";
      if (rowData.DK === "K") return "Kredit";
      return "-";
    };

    autoTable(doc, {
      startY: startY,
      head: [[
        'No',
        'Nama',
        'Tanggal',
        'Faktur',
        'Rekening',
        'Debit/Kredit',
        'Jumlah',
      ]],
      body: data.map((item, idx) => [
        idx + 1,
        item.UserName,
        item.Tgl ? new Date(item.Tgl).toLocaleDateString('id-ID') : '',
        item.Faktur,
        item.Rekening,
        dkTemplate(item),
        item.Jumlah
          ? `Rp ${item.Jumlah.toLocaleString('id-ID')}`
          : '-',
      ]),
      margin: { left: marginLeft, right: marginRight },
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 249, 250] },
    });

    const finalY = doc.lastAutoTable.finalY || startY;

    const rightX = pageWidth - marginRight;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');

    doc.text(
      `Total Saldo Debit : Rp ${totalDebit.toLocaleString('id-ID')}`,
      rightX,
      finalY + 10,
      { align: 'right' }
    );

    doc.text(
      `Total Saldo Kredit: Rp ${totalKredit.toLocaleString('id-ID')}`,
      rightX,
      finalY + 16,
      { align: 'right' }
    );

    return doc.output('datauristring');
  }

  const exportExcel = () => {
    const exportData = data.map((item, idx) => ({
      No: idx + 1,
      Nama: item.UserName,
      Tanggal: item.Tgl ? new Date(item.Tgl).toLocaleDateString('id-ID') : '',
      Faktur: item.Faktur,
      Rekening: item.Rekening,
      'Debit/Kredit':
        item.DK === 'D' ? 'Debit' : item.DK === 'K' ? 'Kredit' : '-',
      Jumlah: item.Jumlah ? `Rp ${item.Jumlah.toLocaleString('id-ID')}` : '-',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Mbanking');

    const colWidths = Object.keys(exportData[0] || {}).map((key) => ({
      wch: Math.max(key.length + 2, 15),
    }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'Laporan Mbanking.xlsx');
  };

  const handleExportPdf = async () => {
    try {
      setLoadingExport(true);
      const pdfDataUrl = await exportPDF(dataAdjust);
      setPdfUrl(pdfDataUrl);
      setFileName('Laporan Mbanking');
      setAdjustDialog(false);
      setJsPdfPreviewOpen(true);
    } finally {
      setLoadingExport(false);
    }
  };

  const footer = () => (
    <div className="flex flex-row gap-2">
      <Button
        label="Export Excel"
        icon="pi pi-file-excel"
        severity="success"
        className="p-button-outlined"
        onClick={exportExcel}
      />
      <Button
        label="Export PDF"
        icon="pi pi-file-pdf"
        severity="danger"
        className="p-button-outlined"
        onClick={handleExportPdf}
        loading={loadingExport}
      />
    </div>
  );

  return (
    <Dialog
      visible={adjustDialog}
      onHide={() => setAdjustDialog(false)}
      header="Pengaturan Cetak"
      style={{ width: '50vw' }}
    >
      <div className="grid p-fluid">
        <div className="col-12 md:col-6">
          <div className="grid formgrid">
            <h5 className="col-12 mb-2">Pengaturan Margin (mm)</h5>
            {['Top', 'Bottom', 'Right', 'Left'].map((label) => (
              <div className="col-6 field" key={label}>
                <label>Margin {label}</label>
                <InputNumber
                  value={dataAdjust[`margin${label}`]}
                  onChange={(e) => onInputChangeNumber(e, `margin${label}`)}
                  min={0}
                  suffix=" mm"
                  showButtons
                  className="w-full"
                  inputStyle={{ padding: '0.3rem' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 md:col-6">
          <div className="grid formgrid">
            <h5 className="col-12 mb-2">Pengaturan Kertas</h5>
            <div className="col-12 field">
              <label>Ukuran Kertas</label>
              <Dropdown
                value={dataAdjust.paperSize}
                options={paperSizes}
                onChange={(e) => onInputChange(e, 'paperSize')}
                optionLabel="name"
                className="w-full"
              />
            </div>
            <div className="col-12 field">
              <label>Orientasi</label>
              <Dropdown
                value={dataAdjust.orientation}
                options={orientationOptions}
                onChange={(e) => onInputChange(e, 'orientation')}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <Toolbar className="py-2 justify-content-end" end={footer} />
    </Dialog>
  );
}