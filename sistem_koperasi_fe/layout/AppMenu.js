import React, { useContext } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);

  const model = [
    {
      items: [
        { label: "Dashboard Utama", icon: "pi pi-fw pi-chart-bar", to: "/" },
        { label: "Ativasi Mpay", icon: "pi pi-fw pi-circle", to: "/admin/aktivasi_mpay" },
        {
          label: "Laporan Mpay",
          icon: "pi pi-fw pi-list",
          items: [{ label: "Simpanan", icon: "pi pi-fw pi-circle", to: "/admin/laporan_mpay/simpanan" }],
        },
        { label: "Ativasi Mbanking", icon: "pi pi-fw pi-circle", to: "/admin/aktivasi_mbanking" },
        { label: "Config Biaya Admin", icon: "pi pi-fw pi-circle", to: "/admin/config_biaya_admin" },
        {
          label: "Laporan Mbanking",
          icon: "pi pi-fw pi-list",
          items: [{ label: "History Transaksi", icon: "pi pi-fw pi-circle", to: "/admin/laporan_mbanking/history_transaksi" }],
        },
        { label: "Perusahaan", icon: "pi pi-fw pi-circle", to: "/admin/perusahaan" },
        { label: "Users", icon: "pi pi-fw pi-circle", to: "/admin/users" },
        { label: "Roles", icon: "pi pi-fw pi-circle", to: "/admin/roles" },
        { label: "Profile", icon: "pi pi-fw pi-circle", to: "/admin/profile" },
      ],
    },
  ];

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