'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

const TabelSimpanan = ({ data, loading, onRefresh, onPrint, totalDebit, totalKredit }) => {
  const paginatorLeft = (
    <div className="flex gap-2">
      <Button
        icon="pi pi-refresh"
        size="small"
        severity="info"
        onClick={onRefresh}
        tooltip="Refresh Data"
        className="p-button-outlined"
      />
    </div>
  );

  const paginatorRight = (
    <div className="flex gap-2">
      <Button
        icon="pi pi-print"
        size="small"
        severity="warning"
        onClick={onPrint}
        tooltip="Cetak Data"
        className="p-button-outlined"
      />
    </div>
  );

  const dateTemplate = (rowData) => {
    if (!rowData.Tgl) return "-";
    const date = new Date(rowData.Tgl);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };


  const rupiahTemplate = (rowData) => {
    if (rowData.Jumlah == null) return '-';
    const formatted = rowData.Jumlah.toLocaleString('id-ID', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `Rp. ${formatted}`;
  };

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontWeight: 'bold' }}>
              <span>
                Total Saldo Debit: {totalDebit.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                })}
              </span>
              <span>
                Total Saldo Kredit: {totalKredit.toLocaleString('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                })}
              </span>
            </div>
          }
          colSpan={8}
        />
      </Row>
    </ColumnGroup>
  );

  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      rowsPerPageOptions={[10, 25, 50, 75, 100, 250, 500, 1000]}
      loading={loading}
      size="small"
      scrollable
      scrollHeight="400px"
      paginatorLeft={paginatorLeft}
      paginatorRight={paginatorRight}
      footerColumnGroup={footerGroup}
      sortField="updated_at" 
      sortOrder={-1}
    >
      <Column field="Tgl" header="Tanggal" body={dateTemplate} />
      <Column field="Faktur" header="Faktur" />
      <Column field="Rekening" header="Rekening" />
      <Column field="UserName" header="Username" />
      <Column field="Nama" header="Nama" />
      <Column field="Alamat" header="Alamat" />
      <Column field="DK" header="Debit/Kredit" />
      <Column field="Nominal" header="Nominal" body={rupiahTemplate} />
    </DataTable>
  );
};

export default TabelSimpanan;
