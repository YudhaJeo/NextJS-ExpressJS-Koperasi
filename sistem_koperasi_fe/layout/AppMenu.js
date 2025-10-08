'use client';
import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import Cookies from "js-cookie";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const role_name = Cookies.get("role_name");

  let model = [];

  if (role_name === "admin") {
    model = [
      {
        items: [
          { label: "Dashboard Utama", icon: "pi pi-fw pi-chart-bar", to: "/" },
          { label: "Aktivasi Mpay", icon: "pi pi-fw pi-wallet", to: "/admin/aktivasi_mpay" },
          {
            label: "Laporan Mpay",
            icon: "pi pi-fw pi-list",
            items: [{ label: "Simpanan", icon: "pi pi-fw pi-money-bill", to: "/admin/laporan_mpay/simpanan" }],
          },
          { label: "Aktivasi Mbanking", icon: "pi pi-fw pi-mobile", to: "/admin/aktivasi_mbanking" },
          { label: "Config Biaya Admin", icon: "pi pi-fw pi-credit-card", to: "/admin/config_biaya_admin" },
          {
            label: "Laporan Mbanking",
            icon: "pi pi-fw pi-list",
            items: [{ label: "History Transaksi", icon: "pi pi-fw pi-history", to: "/admin/laporan_mbanking/history_transaksi" }],
          },
          { label: "Perusahaan", icon: "pi pi-fw pi-building-columns", to: "/admin/perusahaan" },
          { label: "Users", icon: "pi pi-fw pi-user", to: "/admin/users" },
          { label: "Roles", icon: "pi pi-fw pi-users", to: "/admin/roles" },
        ],
      },
    ];
  } else if (role_name === "vendor") {
    model = [
      {
        items: [
          { label: "Dashboard Utama", icon: "pi pi-fw pi-chart-bar", to: "/" },
          { label: "Aktivasi Mpay", icon: "pi pi-fw pi-wallet", to: "/admin/aktivasi_mpay" },
          {
            label: "Laporan Mpay",
            icon: "pi pi-fw pi-list",
            items: [{ label: "Simpanan", icon: "pi pi-fw pi-money-bill", to: "/admin/laporan_mpay/simpanan" }],
          },
          { label: "Aktivasi Mbanking", icon: "pi pi-fw pi-mobile", to: "/admin/aktivasi_mbanking" },
          { label: "Config Biaya Admin", icon: "pi pi-fw pi-credit-card", to: "/admin/config_biaya_admin" },
          {
            label: "Laporan Mbanking",
            icon: "pi pi-fw pi-list",
            items: [{ label: "History Transaksi", icon: "pi pi-fw pi-history", to: "/admin/laporan_mbanking/history_transaksi" }],
          },
        ],
      },
    ];
  } else if (role_name === "user") {
    model = [
      {
        items: [
          { label: "Dashboard Utama", icon: "pi pi-fw pi-chart-bar", to: "/" },
          {
            label: "Laporan Mpay",
            icon: "pi pi-fw pi-list",
            items: [{ label: "Simpanan", icon: "pi pi-fw pi-money-bill", to: "/admin/laporan_mpay/simpanan" }],
          },
          {
            label: "Laporan Mbanking",
            icon: "pi pi-fw pi-list",
            items: [{ label: "History Transaksi", icon: "pi pi-fw pi-history", to: "/admin/laporan_mbanking/history_transaksi" }],
          },
        ],
      },
    ];
  }

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) =>
          !item.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={i} />
          ) : (
            <li className="menu-separator" key={`separator-${i}`}></li>
          )
        )}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;