'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

const FormDialog = ({ visible, onHide, onSubmit, form, setForm, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header={form.Id ? 'Edit Data Roles' : 'Tambah Data Roles'}
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
            <label>Nama Role</label>
            <InputText
              className={inputClass('name')}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Masukkan Nama Role"
            />
            {errors.name && <small className="text-red-500">{errors.name}</small>}
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