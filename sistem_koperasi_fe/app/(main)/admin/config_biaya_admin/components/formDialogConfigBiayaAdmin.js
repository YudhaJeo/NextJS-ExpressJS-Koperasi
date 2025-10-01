'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';

const FormDialogConfigBiayaAdmin = ({ visible, onHide, onSubmit, form, setForm, errors }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  return (
    <Dialog
      header="Edit Config Biaya Admin"
      visible={visible}
      onHide={onHide}
      style={{ width: '40vw' }}
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
            <label>Kode Perusahaan*</label>
            <InputText
              className={inputClass('kode_perusahaan')}
              value={form.kode_perusahaan}
              onChange={(e) =>
                setForm({ ...form, kode_perusahaan: e.target.value })
              }
              placeholder="Masukkan kode perusahaan"
            />
            {errors.kode_perusahaan && (
              <small className="text-red-500">{errors.kode_perusahaan}</small>
            )}
          </div>

          <div className="mt-3">
            <label>Biaya*</label>
            <InputText
              className={inputClass('biaya')}
              value={form.biaya}
              onChange={(e) =>
                setForm({ ...form, biaya: e.target.value })
              }
              placeholder="Masukkan biaya"
            />
            {errors.biaya && (
              <small className="text-red-500">{errors.biaya}</small>
            )}
          </div>
        </div>

        <div className="text-right pt-3">
          <Button
            type="submit"
            label="Simpan"
            className="p-button-outlined"
            icon="pi pi-save"
          />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialogConfigBiayaAdmin;