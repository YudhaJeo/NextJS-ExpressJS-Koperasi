'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const TabelConfigBiayaAdmin = ({ data, loading, onEdit }) => {

  return (
    <DataTable
      value={data}
      paginator
      rows={10}
      rowsPerPageOptions={[10, 25, 50, 100]}
      loading={loading}
      size="small"
      scrollable
      scrollHeight="400px"
    >
      <Column field="kode_perusahaan" header="Kode Perusahaan" />
      <Column field="biaya" header="Biaya" />
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
          </div>
        )}
      />
    </DataTable>
  );
};

export default TabelConfigBiayaAdmin;