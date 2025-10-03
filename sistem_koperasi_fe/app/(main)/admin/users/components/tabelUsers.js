'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const TabelData = ({ data, loading, onEdit, onDelete, onRefresh, onPrint }) => {
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString || dateTimeString === '1900-01-01 00:00:00') return '-';
    return new Date(dateTimeString).toLocaleString('id-ID');
  };

  const statusBodyTemplate = (rowData) => {
    const isActive = rowData.aktivasi === 1 || rowData.status === 1;
    return (
      <Tag
        value={isActive ? "Aktif" : "Tidak Aktif"}
        severity={isActive ? "success" : "danger"}
      />
    );
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
      sortField="updated_at" 
      sortOrder={-1}
    >
      <Column field="name" header="Name" />
      <Column field="email" header="Email" />
      <Column field="role_id" header="Role" />
      <Column field="password" header="Password" />
      <Column field="created_at" header="Created" body={createdBody} />
      <Column field="status" header="Status" body={statusBodyTemplate} />
      <Column field="kode_perusahaan" header="Kode Perusahaan" />
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