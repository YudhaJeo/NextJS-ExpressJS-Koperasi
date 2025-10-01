import Layout from '../../layout/layout';
import Providers from '../providers';

export const metadata = {
  title: 'Dashboard Koperasi',
  icons: {
    icon: '/layout/image/marstech-logo.png',
  },
};

export default function AppLayout({ children }) {
  return (
    <Providers>
      <Layout>{children}</Layout>
    </Providers>
  );
}
