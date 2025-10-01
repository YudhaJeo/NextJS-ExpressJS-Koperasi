import React, { useContext, useState, useEffect } from "react";
import AppMenuitem from "./AppMenuitem";
import { LayoutContext } from "./context/layoutcontext";
import { MenuProvider } from "./context/menucontext";
import Cookies from "js-cookie";

const AppMenu = () => {
  const { layoutConfig } = useContext(LayoutContext);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const roleFromCookies = Cookies.get("role");
    setUserRole(roleFromCookies);
  }, []);

  if (!userRole) return null;

  let model = [];

  if (userRole === "Super Admin") {
    model = [
      {
        items: [
          { label: "Dashboard Utama", icon: "pi pi-fw pi-chart-bar", to: "/kasir/dashboard" },
          { label: "Ativasi Mpay", icon: "pi pi-fw pi-circle", to: "/" },
          {
            label: "Laporan Mpay",
            icon: "pi pi-fw pi-list",
            items: [
              { label: "Simpanan", icon: "pi pi-fw pi-circle", to: "/" },
            ],
          },
          { label: "Ativasi Mbanking", icon: "pi pi-fw pi-circle", to: "/" },
          { label: "Config Biaya Admin", icon: "pi pi-fw pi-circle", to: "/" },
          {
            label: "Laporan Mbanking",
            icon: "pi pi-fw pi-list",
            items: [
              { label: "History Transaksi", icon: "pi pi-fw pi-circle", to: "/" },
            ],
          },
          { label: "Perusahaan", icon: "pi pi-fw pi-circle", to: "/" },
          { label: "Users", icon: "pi pi-fw pi-circle", to: "/" },
          { label: "Role", icon: "pi pi-fw pi-circle", to: "/" },
          { label: "Profile", icon: "pi pi-fw pi-circle", to: "/" },
        ],
      },
    ];
  } else if (userRole === "admin") {
    model = [
      {
        items: [
          { label: "Halaman Admin", icon: "pi pi-fw pi-circle", to: "/" },
        ],
      },
    ];
  } else if (userRole === "vendor") {
    model = [
      {
        items: [
          { label: "Halaman Vendor", icon: "pi pi-fw pi-circle", to: "/" },
        ],
      },
    ];
  } 

  return (
    <MenuProvider>
      <ul className="layout-menu">
        {model.map((item, i) =>
          !item.seperator ? (
            <AppMenuitem item={item} root={true} index={i} key={item.label} />
          ) : (
            <li className="menu-separator" key={`separator-${i}`}></li>
          )
        )}
      </ul>
    </MenuProvider>
  );
};

export default AppMenu;