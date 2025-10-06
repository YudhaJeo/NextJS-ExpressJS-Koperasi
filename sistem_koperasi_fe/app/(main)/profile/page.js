'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { classNames } from 'primereact/utils';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import axios from '../../../utils/axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const [userData, setUserData] = useState({
    id: '',
    name: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const cookieUsername = Cookies.get('name');
    const cookieEmail = Cookies.get('email');

    if (cookieUsername && cookieEmail) {
      setUserData({
        name: cookieUsername,
        email: cookieEmail
      });
    } else {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      const { id, name, email } = response.data.data;
      
      Cookies.set('name', name, { expires: 7 });
      Cookies.set('email', email, { expires: 7 });
      Cookies.set('user_id', id, { expires: 7 });

      setUserData({ id, name, email });
    } catch (error) {
      toast.current.show({
        severity: 'error', 
        summary: 'Gagal', 
        detail: 'Tidak dapat mengambil data profil'
      });
    }
  };

  const handleLogout = () => {
    confirmDialog({
      message: 'Apakah Anda yakin ingin keluar dari akun?',
      header: 'Konfirmasi Logout',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Ya, Logout',
      rejectLabel: 'Batal',
      acceptClassName: 'p-button-danger',
      accept: async () => {
        toast.current.show({
          severity: 'info',
          summary: 'Logout',
          detail: 'Anda telah logout, silakan login kembali.'
        });
        
        Cookies.remove('accessToken');
        Cookies.remove('id');
        Cookies.remove('email');
        Cookies.remove('name');
        Cookies.remove('role_name');
        
        setTimeout(() => router.push('/login'), 1000);
      },
    });
  };

  const handleInputChange = (e, field) => {
    setUserData({
      ...userData,
      [field]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!userData.name || userData.name.trim() === '') {
      newErrors.name = 'Username wajib diisi';
    }

    if (!userData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      await axios.put(`${API_URL}/profile`, {
        id: Cookies.get('id'),
        name: userData.name,
        email: userData.email
      });

      Cookies.set('name', userData.name, { expires: 7 });
      Cookies.set('email', userData.email, { expires: 7 });

      toast.current.show({
        severity: 'success', 
        summary: 'Berhasil', 
        detail: 'Profil berhasil diperbarui'
      });

      setIsEditing(false);
    } catch (error) {
      toast.current.show({
        severity: 'error', 
        summary: 'Gagal', 
        detail: error.response?.data?.error || 'Gagal memperbarui profil'
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return name.substring(0, 2);
  };

  const cardHeader = (
    <div className="flex flex-column align-items-center pt-4 pb-2">
      <Avatar 
        label={getInitials(userData.name)} 
        size="xlarge" 
        shape="circle"
        style={{ 
          width: '100px',
          height: '100px',
        }}
        className="shadow-4 mb-3"
      />
      <h2 className="m-0 text-900">{userData.name || 'Pengguna'}</h2>
      <span className="text-600 text-sm mt-1">{userData.email || 'email@example.com'}</span>
    </div>
  );

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      
      <div className="surface-ground px-4 py-5 md:px-6 lg:px-8" style={{ minHeight: '100vh' }}>
        <div className="grid">
          <div className="col-12 md:col-8 md:col-offset-2 lg:col-6 lg:col-offset-3">
            <Card 
              header={cardHeader}
              className="shadow-4 border-round-xl"
            >
              <Divider className="my-3" />
              
              <div className="p-fluid px-3 pb-3">
                <div className="field mb-4">
                  <label htmlFor="name" className="block text-900 font-medium mb-2">
                    <i className="pi pi-user mr-2"></i>Username
                  </label>
                  <InputText 
                    id="name"
                    value={userData.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                    disabled={!isEditing}
                    className={classNames('p-inputtext-lg', { 'p-invalid': errors.name })}
                    placeholder="Masukkan username"
                  />
                  {errors.name && (
                    <small className="p-error block mt-1">
                      <i className="pi pi-times-circle mr-1"></i>
                      {errors.name}
                    </small>
                  )}
                </div>

                <div className="field mb-4">
                  <label htmlFor="email" className="block text-900 font-medium mb-2">
                    <i className="pi pi-envelope mr-2"></i>Email
                  </label>
                  <InputText 
                    id="email"
                    value={userData.email}
                    onChange={(e) => handleInputChange(e, 'email')}
                    disabled={!isEditing}
                    className={classNames('p-inputtext-lg', { 'p-invalid': errors.email })}
                    placeholder="Masukkan email"
                  />
                  {errors.email && (
                    <small className="p-error block mt-1">
                      <i className="pi pi-times-circle mr-1"></i>
                      {errors.email}
                    </small>
                  )}
                </div>

                <Divider className="my-4" />

                <div className="flex flex-column gap-2">
                  {!isEditing ? (
                    <>
                      <Button 
                        label="Edit Profil" 
                        icon="pi pi-pencil"
                        onClick={() => setIsEditing(true)}
                        className="p-button-outlined p-button-lg"
                      />
                      <Button 
                        label="Logout" 
                        icon="pi pi-sign-out" 
                        className="p-button-danger p-button-lg p-button-outlined" 
                        onClick={handleLogout} 
                      />
                    </>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        label="Simpan" 
                        icon="pi pi-check"
                        onClick={handleSubmit}
                        className="p-button-success p-button-lg flex-1"
                      />
                      <Button 
                        label="Batal" 
                        icon="pi pi-times"
                        onClick={() => {
                          setIsEditing(false);
                          
                          const cookieUsername = Cookies.get('name');
                          const cookieEmail = Cookies.get('email');
                          const cookieId = Cookies.get('user_id');
                          setUserData({
                            id: cookieId || '',
                            name: cookieUsername || '',
                            email: cookieEmail || ''
                          });
                          
                          setErrors({});
                        }}
                        className="p-button-outlined p-button-secondary p-button-lg flex-1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}