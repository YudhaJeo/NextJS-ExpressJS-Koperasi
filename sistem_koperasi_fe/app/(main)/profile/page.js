'use client';

import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { useRef } from 'react';
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

  useEffect(() => {
    const cookieUsername = Cookies.get('username');
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
      Cookies.set('user_id', id, { expires: 7 });\

      setUserData({ id, name, email });
    } catch (error) {
      toast.current.show({
        severity: 'error', 
        summary: 'Gagal', 
        detail: 'Tidak dapat mengambil data profil'
      });
    }
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

  return (
    <div className="grid">
      <Toast ref={toast} />
      <div className="col-12 md:col-8 md:col-offset-2 lg:col-6 lg:col-offset-3">
        <Card 
          title="Profil Pengguna" 
          subTitle="Kelola informasi akun Anda"
          className="shadow-3"
        >
          <div className="p-fluid">
            <div className="field">
              <label htmlFor="name" className="block">Username</label>
              <InputText 
                id="name"
                value={userData.name}
                onChange={(e) => handleInputChange(e, 'name')}
                disabled={!isEditing}
                className={classNames({ 'p-invalid': errors.name })}
              />
              {errors.name && (
                <small className="p-error block">{errors.name}</small>
              )}
            </div>

            <div className="field">
              <label htmlFor="email" className="block">Email</label>
              <InputText 
                id="email"
                value={userData.email}
                onChange={(e) => handleInputChange(e, 'email')}
                disabled={!isEditing}
                className={classNames({ 'p-invalid': errors.email })}
              />
              {errors.email && (
                <small className="p-error block">{errors.email}</small>
              )}
            </div>

            <div className="field">
              <div className="flex justify-content-between">
                {!isEditing ? (
                  <Button 
                    label="Edit Profil" 
                    icon="pi pi-pencil"
                    onClick={() => setIsEditing(true)}
                    className="p-button-outlined"
                  />
                ) : (
                  <>
                    <Button 
                      label="Simpan" 
                      icon="pi pi-check"
                      onClick={handleSubmit}
                      className="p-button-success mr-2"
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
                      className="p-button-outlined p-button-secondary"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
