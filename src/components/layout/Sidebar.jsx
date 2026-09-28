import {
    LayoutDashboard,
    Users,
    FileText,
    Activity,
    Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const menuItems = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        label: "Patients",
        icon: Users,
        path: "/patients",
    },
    {
        label: "Documents",
        icon: FileText,
        path: "/documents",
    },
    {
        label: "Analytics",
        icon: Activity,
        path: "/analytics",
    },
];

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="logo">
                <div className="logo-icon">M</div>

                <span>MedTrace</span>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(({ label, icon: Icon, path }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? "active" : ""}`
                        }
                    >
                        <Icon size={19} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="doctor-avatar">DR</div>

                <div>
                    <strong>Dr. User</strong>
                    <span>Healthcare Provider</span>
                </div>
            </div>
        </aside>
    );
}