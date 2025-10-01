'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

const FormDialog = ({ visible, onHide, onSubmit, form, setForm, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.Id ? 'Edit Data Perusahaan' : 'Tambah Data Perusahaan'}
      visible={visible}
      onHide={onHide}
      style={{ width: '50vw' }}
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div>
          <div className="mt-3">
            <label>Nama Perusahaan*</label>
            <InputText
              className={inputClass('NamaPerusahaan')}
              value={form.NamaPerusahaan}
              onChange={(e) => setForm({ ...form, NamaPerusahaan: e.target.value })}
              placeholder="Masukkan nama"
            />
            {errors.NamaPerusahaan && <small className="text-red-500">{errors.NamaPerusahaan}</small>}
          </div>

          <div className="mt-3">
            <label>Kode Perusahaan *</label>
            <InputText
              className={inputClass('KodePerusahaan')}
              value={form.KodePerusahaan}
              onChange={(e) => setForm({ ...form, KodePerusahaan: e.target.value })}
              placeholder="Masukkan kode perusahaan"
            />
            {errors.KodePerusahaan && <small className="text-red-500">{errors.KodePerusahaan}</small>}
          </div>

        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" className="p-button-outlined" icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialog;
