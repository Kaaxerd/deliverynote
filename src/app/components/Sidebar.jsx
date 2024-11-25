import React from "react";
import Link from "next/link";
import "./Sidebar.css";

const Sidebar = () => {
    return (
        <nav className="sidebar">
            <ul>
                <li>
                    <Link href="/dashboard">Resumen</Link>
                </li>
                <li>
                    <Link href="/clients">Clientes</Link>
                </li>
                <li>
                    <Link href="/projects">Proyectos</Link>
                </li>
                <li>
                    <Link href="/invoices">Albaranes</Link>
                </li>
                <li>
                    <Link href="/suppliers">Proveedores</Link>
                </li>
                <li>
                    <Link href="/settings">Ajustes</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;
