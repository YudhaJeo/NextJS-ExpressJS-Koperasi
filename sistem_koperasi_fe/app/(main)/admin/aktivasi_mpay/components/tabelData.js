'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';

const TabelData = ({ data, loading, onEdit, onDelete, onRefresh }) => {
  const formatDate = (dateString) => {
    if (!dateString || dateString === '1900-01-01') return '-';
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString || dateTimeString === '1900-01-01 00:00:00') return '-';
    return new Date(dateTimeString).toLocaleString('id-ID');
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag 
        value={rowData.Status === 1 ? 'Aktif' : 'Tidak Aktif'} 
        severity={rowData.Status === 1 ? 'success' : 'danger'} 
      />
    );
  };

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
      <Column field="Id" header="ID" />
      <Column 
        field="Tanggal" 
        header="Tanggal" 
        body={(rowData) => formatDate(rowData.Tanggal)}
      
      />
      <Column field="KodePerusahaan" header="Kode Perusahaan" />
      <Column field="KodeUnik" header="Kode Unik" />
      <Column field="Nama" header="Nama" />
      <Column field="KodeAo" header="Kode AO" />
      <Column field="Cabang" header="Cabang" />
      <Column field="Username" header="Username" />
      <Column 
        field="Password" 
        header="Password"
        className="max-w-10rem overflow-hidden text-overflow-ellipsis"
        />
      <Column 
        field="created_at" 
        header="Date Time" 
        body={(rowData) => formatDateTime(rowData.DateTime)}
      
      />
      <Column 
        field="Status" 
        header="Status" 
        body={statusBodyTemplate}
      
      />
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