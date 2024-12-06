"use client"; 
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../dashboard/styles.css';
import './clients.css';

export default function DashboardPage() {
    const [clients, setClients] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newClient, setNewClient] = useState({
        name: '',
        cif: '',
        address: {
            street: '',
            number: '',
            postal: '',
            city: '',
            province: ''
        }
    });

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            console.error('No token found. Please log in.');
            return;
        }

        const fetchClients = async () => {
            try {
                const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }

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
                    'Authorization': 'Bearer TU_TOKEN_AQUI'
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
            setNewClient({
                name: '',
                cif: '',
                address: {
                    street: '',
                    number: '',
                    postal: '',
                    city: '',
                    province: ''
                }
            });
            setIsCreating(false);
        } catch (error) {
            console.error('Error creating client:', error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in newClient.address) {
            // If the change is within address fields
            setNewClient({
                ...newClient,
                address: { ...newClient.address, [name]: value }
            });
        } else {
            // If the change is in top-level fields (name, cif)
            setNewClient({
                ...newClient,
                [name]: value
            });
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
                                    <p>{client.cif}</p>
                                    <p>{client.address.street} {client.address.number}</p>
                                    <p>{client.address.city}, {client.address.province}</p>
                                    <p>{client.address.postal}</p>
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
                                    name="name"
                                    value={newClient.name}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    placeholder="CIF"
                                    name="cif"
                                    value={newClient.cif}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    placeholder="Calle"
                                    name="street"
                                    value={newClient.address.street}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    placeholder="Número"
                                    name="number"
                                    value={newClient.address.number}
                                    onChange={handleChange}
                                />
                                <input
                                    type="number"
                                    placeholder="Código Postal"
                                    name="postal"
                                    value={newClient.address.postal}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    placeholder="Ciudad"
                                    name="city"
                                    value={newClient.address.city}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    placeholder="Provincia"
                                    name="province"
                                    value={newClient.address.province}
                                    onChange={handleChange}
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
