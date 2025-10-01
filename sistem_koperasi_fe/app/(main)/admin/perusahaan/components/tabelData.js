'use client';

import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelData = ({ data, loading, onEdit, onDelete, onRefresh, onPrint }) => {

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
      <Column field="Id" header="ID" />
      <Column field="KodePerusahaan" header="Kode Perusahaan" />
      <Column field="NamaPerusahaan" header="Nama Perusahaan" />
      <Column
        header="Aksi"
        body={(row) => (
          <div className="flex gap-2">
            <Button
              icon="pi pi-pencil"
              size="small"
              severity="warning"
              onClick={() => onEdit(row)}
              tooltip="Edit"
            />
            <Button
              icon="pi pi-trash"
              size="small"
              severity="danger"
              onClick={() => onDelete(row)}
              tooltip="Hapus"
            />
          </div>
        )}
      
      />
    </DataTable>
  );
};

export default TabelData;