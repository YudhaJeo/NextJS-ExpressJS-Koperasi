'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';

const TabelSimpanan = ({ data, loading, onRefresh, onPrint, totalMutasi }) => {
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
    if (isNaN(date)) return "-";
    return date.toISOString().split("T")[0];
  };

  const rupiahTemplate = (rowData) => {
    if (rowData.Jumlah == null) return "-";
    const formatted = Number(rowData.Jumlah).toLocaleString("id-ID");
    return `Rp ${formatted}`;
  };

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="" colSpan={4} /> { }
        <Column footer="Total Mutasi" style={{ fontWeight: "bold", textAlign: "right" }} />
        <Column
          footer={`Rp ${totalMutasi.toLocaleString("id-ID")}`}
          style={{ fontWeight: "bold", textAlign: "left" }}
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
      <Column field="Jumlah" header="Mutasi" body={rupiahTemplate} />
    </DataTable>
  );
};

export default TabelSimpanan;
