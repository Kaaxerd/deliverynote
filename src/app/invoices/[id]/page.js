"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../dashboard/styles.css";
import "../invoices.css";

export default function InvoicePage() {
    const params = useParams();
    const { clientId, projectId, id } = params;
    const [invoice, setInvoice] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedInvoice, setEditedInvoice] = useState({});

    useEffect(() => {
        if (!id) {
            console.error("Invoice ID missing in URL.");
            return;
        }
    
        const token = localStorage.getItem("jwt");
        if (!token) {
            console.error("No token found. Please log in.");
            return;
        }
    
        const fetchInvoiceData = async () => {
            try {
                const invoiceResponse = await fetch(
                    `https://bildy-rpmaya.koyeb.app/api/deliverynote/${id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
    
                if (!invoiceResponse.ok) {
                    const errorMessage = await invoiceResponse.text();
                    throw new Error(errorMessage);
                }
    
                const invoiceData = await invoiceResponse.json();
                console.log("Datos del albarán:", invoiceData);
    
                // Asigna clientId y projectId de manera manual si no existen en la respuesta
                setInvoice(invoiceData);
                setEditedInvoice({
                    ...invoiceData,
                    clientId: invoiceData.clientId || invoiceData.client._id,   // Asigna clientId desde client._id si no está en clientId
                    projectId: invoiceData.projectId || invoiceData.projectName, // Asigna projectId si no está en projectId
                });
            } catch (error) {
                console.error("Error fetching invoice data:", error);
            }
        };
    
        fetchInvoiceData();
    }, [id]);
    
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);  // Verifica los valores del formulario
        setEditedInvoice({
            ...editedInvoice,
            [name]: value,
        });
    };    

    const handleSaveEdit = async () => {
        const token = localStorage.getItem("jwt");
    
        // Verificar que clientId y projectId no sean undefined
        if (!editedInvoice.clientId || !editedInvoice.projectId) {
            console.error("clientId or projectId is missing");
            return;
        }
    
        try {
            const response = await fetch(
                `https://bildy-rpmaya.koyeb.app/api/deliverynote/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editedInvoice),
                }
            );
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error("Error updating invoice:", errorMessage);
                return;
            }
    
            const updatedInvoice = await response.json();
            setInvoice(updatedInvoice);
            setEditedInvoice({ ...updatedInvoice });
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };
    
    return (
        <div className="layout">
            <Header />
            <div className="main">
                <Sidebar />
                <div className="content">
                    <h1>Detalles del Albarán</h1>
                    <Link href={`/projects/${clientId}/${projectId}`}>
                        <button>Volver al Proyecto</button>
                    </Link>
                    <Link href={`/invoices`}>
                        <button>Volver a los Albaranes</button>
                    </Link>

                    {invoice ? (
                        <div className="invoice-details">
                            {isEditing ? (
                                <div className="edit-form">
                                    <p><strong>Editando:</strong> {invoice.description}</p>
                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="Descripción"
                                        value={editedInvoice.description}
                                        onChange={handleEditChange}
                                    />
                                    <select
                                        name="format"
                                        value={editedInvoice.format}
                                        onChange={handleEditChange}
                                    >
                                        <option value="material">Material</option>
                                        <option value="hours">Horas</option>
                                    </select>
                                    <input
                                        type="text"
                                        name="material"
                                        placeholder="Material"
                                        value={editedInvoice.material}
                                        onChange={handleEditChange}
                                    />
                                    <input
                                        type="number"
                                        name="hours"
                                        placeholder="Horas"
                                        value={editedInvoice.hours}
                                        onChange={handleEditChange}
                                    />
                                    <input
                                        type="date"
                                        name="workdate"
                                        placeholder="Fecha de trabajo"
                                        value={editedInvoice.workdate}
                                        onChange={handleEditChange}
                                    />
                                    <button onClick={handleSaveEdit}>Guardar Cambios</button>
                                </div>
                            ) : (
                                <div className="invoice-info">
                                    <p><strong>Descripción:</strong> {invoice.description}</p>
                                    <p><strong>Formato:</strong> {invoice.format}</p>
                                    <p><strong>Material:</strong> {invoice.material || "N/A"}</p>
                                    <p><strong>Horas:</strong> {invoice.hours || "N/A"}</p>
                                    <p><strong>Fecha:</strong> {invoice.date}</p>
                                    <p><strong>Cliente:</strong> {invoice.client.name}</p>
                                    <p><strong>Dirección del Cliente:</strong> {invoice.client.address.street}, {invoice.client.address.city}</p>
                                    <p><strong>Proyecto:</strong> {invoice.projectName || "N/A"}</p>
                                    <p><strong>CIF de Empresa:</strong> {invoice.client.cif || "N/A"}</p>
                                    <button onClick={() => setIsEditing(true)}>Editar</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Cargando datos del albarán...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
