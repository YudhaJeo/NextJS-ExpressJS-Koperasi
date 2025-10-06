import Link from "next/link";
import { classNames } from "primereact/utils";
import React, {
    forwardRef,
    useContext,
    useImperativeHandle,
    useRef,
    useEffect,
    useState,
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import Cookies from "js-cookie";
import { Avatar } from "primereact/avatar";

const AppTopbar = forwardRef((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } =
        useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
    }));

    const [username, setUsername] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        const name = Cookies.get("username");
        if (name) setUsername(name);

        const roleData = Cookies.get("role_name");
        if (roleData) setRole(roleData);
    }, []);

    const firstLetter = username ? username.charAt(0).toUpperCase() : "?";

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/marstech-logo.png`} alt="logo" />
                <span>Dashboard Koperasi</span>
            </Link>

            <button
                ref={menubuttonRef}
                type="button"
                className="p-link layout-menu-button layout-topbar-button"
                onClick={onMenuToggle}
            >
                <i className="pi pi-bars" />
            </button>

            <button
                ref={topbarmenubuttonRef}
                type="button"
                className="p-link layout-topbar-menu-button layout-topbar-button"
                onClick={showProfileSidebar}
            >
                <i className="pi pi-ellipsis-v" />
            </button>

            <div
                ref={topbarmenuRef}
                className={classNames("layout-topbar-menu flex items-center gap-3", {
                    "layout-topbar-menu-mobile-active": layoutState.profileSidebarVisible,
                })}
            >
                <div className="flex flex-wrap gap-3">
                    <div className="text-right align-items-center pt-2">
                        <div>
                            <span className="text-base md:text-lg font-semibold">{username}</span>
                        </div>
                        <div>
                            {role && (
                                <span className="text-sm text-gray-400">{role}</span>
                            )}
                        </div>
                    </div>
                    <Link href="/profile">
                        <Avatar
                            label={firstLetter}
                            size="xlarge"
                            shape="circle"
                        />
                    </Link>
                </div>

            </div>
        </div>
    );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;
