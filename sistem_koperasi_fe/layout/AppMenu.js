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
          { label: "Dashboard Utama", icon: "pi pi-fw pi-chart-bar", to: "/" },
        ],
      },
    ];
  } else if (userRole === "Admin") {
    model = [
      {
        items: [
          { label: "Dashboard Utama", icon: "pi pi-fw pi-chart-bar", to: "/kasir/dashboard" },
          { label: "Dashboard Utama", icon: "pi pi-fw pi-chart-bar", to: "/" },
        ],
      },
    ];
  } else if (userRole === "Admin") {
    model = [
      {
        items: [
          { label: "Dashboard Utama", icon: "pi pi-fw pi-chart-bar", to: "/kasir/dashboard" },
          { label: "Dashboard Utama", icon: "pi pi-fw pi-chart-bar", to: "/" },
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