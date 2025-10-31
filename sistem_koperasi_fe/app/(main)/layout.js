"use client";

import dynamic from "next/dynamic";
import { PrimeReactProvider } from "primereact/api";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const Layout = dynamic(() => import("../../layout/layout"), { ssr: false });

export default function AppLayout({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const titles = {
      "/": "Dashboard",
      "/admin": "Admin",
      "/admin/aktivasi_mbanking": "Aktivasi M-Banking",
      "/admin/aktivasi_mpay": "Aktivasi M-Pay",
      "/admin/users": "Pengguna",
      "/admin/roles": "Roles",
      "/admin/perusahaan": "Data Perusahaan",
      "/admin/config_biaya_admin": "Konfigurasi Biaya Admin",
      "/admin/laporan_mpay": "Laporan M-Pay",
      "/admin/laporan_mpay/simpanan": "Laporan M-Pay — Simpanan",
      "/admin/laporan_mbanking": "Laporan M-Banking",
      "/admin/laporan_mbanking/history_transaksi": "Laporan M-Banking — Riwayat Transaksi",
    };

    const currentTitle = titles[pathname] || "Sistem Koperasi";
    document.title = `${currentTitle} | Sistem Koperasi`;
  }, [pathname]);

  return (
    <PrimeReactProvider>
      <Layout>{children}</Layout>
    </PrimeReactProvider>
  );
}
