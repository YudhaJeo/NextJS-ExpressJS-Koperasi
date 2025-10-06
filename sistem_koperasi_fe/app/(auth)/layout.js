import { PrimeReactProvider } from 'primereact/api';
import React from 'react';

export const metadata = {
    title: 'Login Koperasi',
    description:
        'Login ke dashboard koperasi PT MarsTech Global'
};

export default function SimpleLayout({ children }) {
    return (
        <body>
          <PrimeReactProvider>
                {children}
          </PrimeReactProvider>
        </body>
      );
    }