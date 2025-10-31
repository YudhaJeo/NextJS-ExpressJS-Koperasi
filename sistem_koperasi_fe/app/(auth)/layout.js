import { PrimeReactProvider } from 'primereact/api';
import React from 'react';

export const metadata = {
  title: 'Login Koperasi',
  description: 'Login ke dashboard koperasi PT MarsTech Global'
};

export default function SimpleLayout({ children }) {
  return (
    <PrimeReactProvider>
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        {children}
      </main>
    </PrimeReactProvider>
  );
}
