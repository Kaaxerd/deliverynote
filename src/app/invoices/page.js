"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../dashboard/styles.css";
import "./invoices.css";

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]); // Agregar proyectos
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isInvoiceCreated, setIsInvoiceCreated] = useState(false);
    const [newinvoice, setNewinvoice] = useState({
        clientId: "",
        projectId: "",
        format: "",
        material: "",
        hours: 8,
        description: "",
        workdate: "",
    });
    const [invoiceToDelete, setInvoiceToDelete] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwt");
        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }
    
        const fetchInvoices = async () => {
            try {
                const response = await fetch(
                    "https://bildy-rpmaya.koyeb.app/api/deliverynote",  // Ruta para listar albaranes
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
    
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }
    
                const data = await response.json();
                setInvoices(data);
            } catch (error) {
                console.error("Error fetching delivery notes:", error);
            }
        };

        const fetchClients = async () => {
            try {
                const response = await fetch(
                    "https://bildy-rpmaya.koyeb.app/api/client",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                setClients(data);
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };

        const fetchProjects = async () => {
            try {
                const response = await fetch(
                    "https://bildy-rpmaya.koyeb.app/api/project",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
        
                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }
        
                const data = await response.json();
                setProjects(data);
                console.log("Proyectos recibidos:", data);  // Verifica que los proyectos estén correctos
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        
        fetchInvoices();
        fetchClients();
        fetchProjects();
    }, []);

    const handleCreateInvoice = async () => {
        console.log("Nuevo albarán:", newinvoice);  // Verifica el projectId
        const token = localStorage.getItem("jwt");
        try {
            const response = await fetch(
                "https://bildy-rpmaya.koyeb.app/api/deliverynote",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(newinvoice),
                }
            );
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("Error creating delivery note:", errorMessage);
                return;
            }
    
            const createdinvoice = await response.json();
            setInvoices((prevInvoices) => [...prevInvoices, createdinvoice]);
            setNewinvoice({
                clientId: "",
                projectId: "",
                format: "",
                material: "",
                hours: 8,
                description: "",
                workdate: "",
            });
            setIsCreating(false);
        } catch (error) {
            console.error("Error creating delivery note:", error);
        }
    };    

    const handleDeleteClick = (invoiceId) => {
        setInvoiceToDelete(invoiceId);
        setIsDeleting(true);
    };

    const handleConfirmDelete = async () => {
        const token = localStorage.getItem("jwt");
        try {
            const response = await fetch(
                `https://bildy-rpmaya.koyeb.app/api/deliverynote/${invoiceToDelete}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("Error deleting invoice:", errorMessage);
                return;
            }

            setInvoices(invoices.filter((invoice) => invoice._id !== invoiceToDelete));
            setIsDeleting(false);
            setInvoiceToDelete(null);
        } catch (error) {
            console.error("Error deleting invoice:", error);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleting(false);
        setInvoiceToDelete(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewinvoice({
            ...newinvoice,
            [name]: value,
        });
    };

    return (
        <div className="layout">
            <Header />
            <div className="main">
                <Sidebar />
                <div className="content">
                    <h1>Albaranes</h1>

                    {isInvoiceCreated && (
                        <div className="confirmation-modal">
                            <div className="confirmation-message">
                                <p>¡Albarán creado correctamente!</p>
                                <button onClick={() => setIsInvoiceCreated(false)}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    )}

                    {invoices.length > 0 ? (
                        <>
                            <button onClick={() => setIsCreating(true)}>Crear Albarán</button>
                            <div className="invoice-list">
                                {invoices.map((invoice) => {
                                    console.log("Proyecto albarán:", invoice.projectId);  // Verifica el projectId
                                    const project = projects.find(
                                        (project) => project._id === invoice.projectId
                                    );
                                    const projectName = project ? project.name : "Desconocido";

                                    return (
                                        <div className="invoice-card" key={invoice._id}>
                                            <Link href={`/invoices/${invoice._id}`}>
                                                <h3>Albarán {invoice._id}</h3>
                                                <p><strong>Cliente:</strong> {clients.find(client => client._id === invoice.clientId)?.name || "Desconocido"}</p>
                                                <p><strong>Proyecto:</strong> {projectName}</p>
                                                <p><strong>Formato:</strong> {invoice.format}</p>
                                                {invoice.format === "material" && <p><strong>Material:</strong> {invoice.material}</p>}
                                                {invoice.format === "hours" && <p><strong>Horas:</strong> {invoice.hours}</p>}
                                                <p><strong>Descripción:</strong> {invoice.description}</p>
                                                <p><strong>Fecha:</strong> {new Date(invoice.workdate).toLocaleDateString()}</p>
                                            </Link>

                                            <button onClick={() => handleDeleteClick(invoice._id)}>Eliminar</button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="no-invoices">
                            <p>No hay albaranes disponibles.</p>
                            <button onClick={() => setIsCreating(true)}>Crear Albarán</button>
                        </div>
                    )}

                    {/* Formulario para crear albarán */}
                    {isCreating && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Crear Albarán</h2>

                                {/* Cliente */}
                                <select
                                    name="clientId"
                                    value={newinvoice.clientId}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecciona un cliente</option>
                                    {clients.map((client) => (
                                        <option key={client._id} value={client._id}>
                                            {client.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Proyecto */}
                                <select
                                    name="projectId"
                                    value={newinvoice.projectId}
                                    onChange={handleChange}
                                >
                                    <option value="">Selecciona un proyecto</option>
                                    {projects.map((project) => (
                                        <option key={project._id} value={project._id}>
                                            {project.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Formato */}
                                <select
                                    name="format"
                                    value={newinvoice.format}
                                    onChange={handleChange}
                                >
                                    <option value="material">Material</option>
                                    <option value="hours">Horas</option>
                                </select>

                                {/* Material (visible solo si el formato es "material") */}
                                {newinvoice.format === "material" && (
                                    <input
                                        type="text"
                                        name="material"
                                        placeholder="Tipo de material"
                                        value={newinvoice.material}
                                        onChange={handleChange}
                                    />
                                )}

                                {/* Horas (visible solo si el formato es "hours") */}
                                {newinvoice.format === "hours" && (
                                    <input
                                        type="number"
                                        name="hours"
                                        placeholder="Horas trabajadas"
                                        value={newinvoice.hours}
                                        onChange={handleChange}
                                    />
                                )}

                                {/* Descripción */}
                                <textarea
                                    name="description"
                                    placeholder="Descripción"
                                    value={newinvoice.description}
                                    onChange={handleChange}
                                />

                                {/* Fecha de trabajo */}
                                <input
                                    type="date"
                                    name="workdate"
                                    value={newinvoice.workdate}
                                    onChange={handleChange}
                                />

                                <div className="modal-actions">
                                    <button onClick={handleCreateInvoice}>Guardar</button>
                                    <button onClick={() => setIsCreating(false)}>Cancelar</button>
                                </div>
                            </div>
                                                    </div>
                    )}
                    {/* Confirmación de eliminación */}
                    {isDeleting && (
                        <div className="modal-content">
                            <p>¿Estás seguro de que deseas eliminar este albarán?</p>
                            <button onClick={handleConfirmDelete}>Sí</button>
                            <button onClick={handleCancelDelete}>Cancelar</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
