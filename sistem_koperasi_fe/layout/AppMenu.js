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
        { label: "Ativasi Mpay", icon: "pi pi-fw pi-circle", to: "/" },
        {
          label: "Laporan Mpay",
          icon: "pi pi-fw pi-list",
          items: [{ label: "Simpanan", icon: "pi pi-fw pi-circle", to: "/" }],
        },
        { label: "Ativasi Mbanking", icon: "pi pi-fw pi-circle", to: "/" },
        { label: "Config Biaya Admin", icon: "pi pi-fw pi-circle", to: "/" },
        {
          label: "Laporan Mbanking",
          icon: "pi pi-fw pi-list",
          items: [{ label: "History Transaksi", icon: "pi pi-fw pi-circle", to: "/" }],
        },
        { label: "Perusahaan", icon: "pi pi-fw pi-circle", to: "/" },
        { label: "Users", icon: "pi pi-fw pi-circle", to: "/" },
        { label: "Role", icon: "pi pi-fw pi-circle", to: "/" },
        { label: "Profile", icon: "pi pi-fw pi-circle", to: "/" },
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