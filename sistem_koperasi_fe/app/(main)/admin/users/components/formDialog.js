'use client';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const FormDialogUser = ({ 
  visible, 
  onHide, 
  onSubmit, 
  form, 
  setForm, 
  errors, 
  roleOptions = [], 
  perusahaanOptions = [] 
}) => {
  const inputClass = (field) =>
    errors[field] ? 'p-invalid w-full mt-2' : 'w-full mt-2';

  const aktivasiOptions = [
    { label: 'Aktif', value: 1 },
    { label: 'Tidak Aktif', value: 2 },
  ];

  return (
    <Dialog
      header={form.Id ? 'Edit User' : 'Tambah User'}
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
        {/* Name & Email */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Nama</label>
            <InputText
              className={inputClass('name')}
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Masukkan nama"
            />
            {errors.name && <small className="text-red-500">{errors.name}</small>}
          </div>
          <div>
            <label>Email</label>
            <InputText
              className={inputClass('email')}
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Masukkan email"
            />
            {errors.email && <small className="text-red-500">{errors.email}</small>}
          </div>
        </div>

        {/* Password */}
        <div>
          <label>Password</label>
          <InputText
            type="password"
            className={inputClass('password')}
            value={form.password || ''}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Masukkan password"
          />
          {errors.password && <small className="text-red-500">{errors.password}</small>}
        </div>

        {/* Dropdown Aktivasi */}
        <div>
          <label>Aktivasi</label>
          <Dropdown
            className={inputClass('aktivasi')}
            value={form.aktivasi || ''}
            options={aktivasiOptions}
            onChange={(e) => setForm({ ...form, aktivasi: e.value })}
            placeholder="Pilih status"
          />
          {errors.aktivasi && <small className="text-red-500">{errors.aktivasi}</small>}
        </div>

        {/* Dropdown Role */}
        <div>
          <label>Role</label>
          <Dropdown
            className={inputClass('role')}
            value={form.role || ''}
            options={roleOptions.map((r) => ({ label: r.name, value: r.id }))}
            onChange={(e) => setForm({ ...form, role: e.value })}
            placeholder="Pilih role"
          />
          {errors.role && <small className="text-red-500">{errors.role}</small>}
        </div>

        {/* Dropdown Kode Perusahaan */}
        <div>
          <label>Kode Perusahaan</label>
          <Dropdown
            className={inputClass('kode_perusahaan')}
            value={form.kode_perusahaan || ''}
            options={perusahaanOptions.map((p) => ({
              label: `${p.KodePerusahaan} - ${p.NamaPerusahaan}`,
              value: p.KodePerusahaan,
            }))}
            onChange={(e) => setForm({ ...form, kode_perusahaan: e.value })}
            placeholder="Pilih kode perusahaan"
          />
          {errors.kode_perusahaan && (
            <small className="text-red-500">{errors.kode_perusahaan}</small>
          )}
        </div>

        {/* Tombol Simpan */}
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

export default FormDialogUser;