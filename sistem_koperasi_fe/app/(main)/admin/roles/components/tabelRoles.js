'use client';

import { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelData = ({ data, loading, onEdit, onDelete, onRefresh, onPrint }) => {
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString || dateTimeString === '1900-01-01 00:00:00') return '-';
    return new Date(dateTimeString).toLocaleString('id-ID');
  };

  const createdBody = (row) => {
    return formatDateTime(row.created_at);
  };

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
const TabelData = ({ data, loading, onEdit, onDelete }) => {

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
      sortField="updated_at" 
      sortOrder={-1}
    >
      <Column field="name" header="Name" />
      <Column field="created_at" header="Created" body={createdBody} />
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