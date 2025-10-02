import { LayoutProvider } from '../layout/context/layoutcontext';
import 'primereact/resources/primereact.min.css';
import { PrimeReactProvider } from 'primereact/api';
import AppConfig from '../layout/AppConfig';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link 
          id="theme-css" 
          href={`/themes/lara-light-indigo/theme.css`} 
          rel="stylesheet"
        />  
      </head>
      <body>
        <PrimeReactProvider>
          <LayoutProvider>
            {children}
            <AppConfig />
          </LayoutProvider>
        </PrimeReactProvider>
      </body>
    </html>
  );
}
