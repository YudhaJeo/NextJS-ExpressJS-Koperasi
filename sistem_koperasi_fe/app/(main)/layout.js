// D:\MARSTECH\ExpressJS-NextJs-Koperasi\sistem_koperasi_fe\app\(main)\layout.js
import Layout from '../../layout/layout';
import Providers from '../providers';

export const metadata = {
  title: 'Dashboard Koperasi',
  icons: {
    icon: '/layout/marstech-logo.png',
  },
};

export default function AppLayout({ children }) {
  return (
    <Providers>
      <Layout>{children}</Layout>
    </Providers>
  );
}
