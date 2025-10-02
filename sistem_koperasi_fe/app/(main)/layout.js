import Layout from '../../layout/layout';
import { PrimeReactProvider } from 'primereact/api';

export const metadata = {
  title: 'Dashboard Koperasi',
  icons: {
    icon: '/layout/marstech-logo.png',
  },
};

export default function AppLayout({ children }) {
  return (
    <body>
      <PrimeReactProvider>
          <Layout>
            {children}
          </Layout>
      </PrimeReactProvider>
    </body>
  );
}
