'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const FormDialog = ({ visible, onHide, onSubmit, form, setForm, errors, perusahaanOptions }) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  const statusOptions = [
    { label: 'Aktif', value: 1 },
    { label: 'Tidak Aktif', value: 0 }
  ];

  return (
    <Dialog
      header={form.Id ? 'Edit Aktivasi M-Pay' : 'Tambah Aktivasi M-Pay'}
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
        <div className="grid grid-cols-2 gap-4">
          <div className="mt-2">
            <label>Nama *</label>
            <InputText
              className={inputClass('Nama')}
              value={form.Nama}
              onChange={(e) => setForm({ ...form, Nama: e.target.value })}
              placeholder="Masukkan nama"
            />
            {errors.Nama && <small className="text-red-500">{errors.Nama}</small>}
          </div>

          <div className="mt-2">
            <label>Kode Perusahaan *</label>
            <Dropdown
              className={inputClass('KodePerusahaan')}
              value={form.KodePerusahaan}
              options={perusahaanOptions}
              onChange={(e) => 
                setForm({ ...form, KodePerusahaan: e.target.value })
              }
              placeholder="Pilih kode perusahaan"
              showClear
              filter
            />
            {errors.KodePerusahaan && <small className="text-red-500">{errors.KodePerusahaan}</small>}
          </div>

          <div className="mt-2">
            <label>Kode Unik *</label>
            <InputText
              className={inputClass('KodeUnik')}
              value={form.KodeUnik}
              onChange={(e) => setForm({ ...form, KodeUnik: e.target.value })}
              placeholder="Masukkan kode unik"
            />
            {errors.KodeUnik && <small className="text-red-500">{errors.KodeUnik}</small>}
          </div>

          <div className="mt-2">
            <label>Kode AO *</label>
            <InputText
              className={inputClass('KodeAo')}
              value={form.KodeAo}
              onChange={(e) => setForm({ ...form, KodeAo: e.target.value })}
              placeholder="Masukkan kode AO"
            />
            {errors.KodeAo && <small className="text-red-500">{errors.KodeAo}</small>}
          </div>

          <div className="mt-2">
            <label>Cabang *</label>
            <InputText
              className={inputClass('Cabang')}
              value={form.Cabang}
              onChange={(e) => setForm({ ...form, Cabang: e.target.value })}
              placeholder="Masukkan cabang"
            />
            {errors.Cabang && <small className="text-red-500">{errors.Cabang}</small>}
          </div>

          <div className="mt-2">
            <label>Username *</label>
            <InputText
              className={inputClass('Username')}
              value={form.Username}
              onChange={(e) => setForm({ ...form, Username: e.target.value })}
              placeholder="Masukkan username"
            />
            {errors.Username && <small className="text-red-500">{errors.Username}</small>}
          </div>
          
          <div className="mt-2">
            <label>Password *</label>
            <InputText
              className={inputClass('Password')}
              value={form.Password}
              onChange={(e) => setForm({ ...form, Password: e.target.value })}
              placeholder="Masukkan username"
            />
            {errors.Password && <small className="text-red-500">{errors.Password}</small>}
          </div>

          <div className="mt-2">
            <label>Status</label>
            <Dropdown
              className="w-full mt-2"
              value={form.Status}
              options={statusOptions}
              onChange={(e) => setForm({ ...form, Status: e.value })}
              placeholder="Pilih status"
            />
          </div>
        </div>

        <div className="text-right pt-3">
          <Button type="submit" label="Simpan" className="p-button-outlined"  icon="pi pi-save" />
        </div>
      </form>
    </Dialog>
  );
};

export default FormDialog;
