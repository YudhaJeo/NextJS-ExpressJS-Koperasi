'use client';

import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const TabelData = ({ data, loading, onEdit, onDelete, onRefresh, onPrint, onDeactivate }) => {

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
    >
      <Column field="kode_perusahaan" header="Kode Perusahaan" />
      <Column field="kode_unik" header="Kode Unik" />
      <Column field="cif" header="CIF" />
      <Column field="nik" header="Nomer KTP" />
      <Column field="no_hp" header="No Telp" />
      <Column field="fullname" header="Nama" />
      <Column
        field="status"
        header="Status"
        body={(row) => {
          const s = Number(String(row.status).trim());
          if (s === 1) return <Tag value="Aktif" severity="success" />;
          if (s === 2) return <Tag value="Nonaktif" severity="danger" />;
          return <Tag value="Unknown" severity="warning" />;
        }}
      />
      <Column
        header="Aksi"
        body={(row) => (
          <div className="flex gap-2">
            <Button
              label="Nonaktifkan"
              size="small"
              severity="danger"
              onClick={() => onDeactivate(row)}
              tooltip="Nonaktifkan"
            />
            <Button
              label="Delete"
              size="small"
              severity="danger"
              onClick={() => onDelete(row)}
              tooltip="Hapus"
            />
          </div>
        )}
      />
      <Column field="datetime" header="Tanggal" />
    </DataTable>
  );
};

export default TabelData;
