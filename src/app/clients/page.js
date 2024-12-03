"use client";
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../dashboard/styles.css';
import './clients.css';

export default function DashboardPage() {
    const [clients, setClients] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client');
                const data = await response.json();
                setClients(data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, []);

    const handleCreateClient = async () => {
        try {
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer TU_TOKEN_AQUI' // Reemplaza TU_TOKEN_AQUI por el token proporcionado
                },
                body: JSON.stringify(newClient),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error creating client:', errorMessage);
                return;
            }
    
            const createdClient = await response.json();
            setClients([...clients, createdClient]);
            setNewClient({ name: '', email: '', phone: '' });
            setIsCreating(false);
        } catch (error) {
            console.error('Error creating client:', error.message);
        }
    };       

    return (
        <div className='layout'>
            <Header />
            <div className='main'>
                <Sidebar />
                <div className='content'>
                    <h1>Clientes</h1>
                    {clients.length > 0 ? (
                        <div className="client-list">
                            {clients.map((client, index) => (
                                <div className="client-card" key={index}>
                                    <h3>{client.name}</h3>
                                    <p>{client.email}</p>
                                    <p>{client.phone}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-clients">
                            <p>No hay clientes disponibles.</p>
                            <button onClick={() => setIsCreating(true)}>Crear Cliente</button>
                        </div>
                    )}

                    {isCreating && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Crear Cliente</h2>
                                <input
                                    type="text"
                                    placeholder="Nombre"
                                    value={newClient.name}
                                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={newClient.email}
                                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                />
                                <input
                                    type="tel"
                                    placeholder="Teléfono"
                                    value={newClient.phone}
                                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                />
                                <div className="modal-actions">
                                    <button onClick={handleCreateClient}>Guardar</button>
                                    <button onClick={() => setIsCreating(false)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}