"use client";

import dynamic from "next/dynamic";
import { PrimeReactProvider } from "primereact/api";

const Layout = dynamic(() => import("../../layout/layout"), { ssr: false });

export default function AppLayout({ children }) {
  return (
    <PrimeReactProvider>
      <Layout>{children}</Layout>
    </PrimeReactProvider>
  );
}
