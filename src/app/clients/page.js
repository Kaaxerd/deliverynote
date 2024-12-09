"use client"; 
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../dashboard/styles.css';
import './clients.css';

export default function DashboardPage() {
    const [clients, setClients] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isClientCreated, setIsClientCreated] = useState(false);
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
    const [isDeleting, setIsDeleting] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);

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
                console.log('API Response:', data); // Aquí puedes ver la respuesta completa de la API
                setClients(data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };        

        fetchClients();
    }, []);

    const handleCreateClient = async () => {
        try {
            const token = localStorage.getItem('jwt');
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
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
            setIsClientCreated(true); // Indica que el cliente fue creado correctamente
            setTimeout(() => setIsClientCreated(false), 3000); // Cierra el mensaje de confirmación después de 3 segundos
        } catch (error) {
            console.error('Error creating client:', error.message);
        }
    };

    const handleDeleteClick = (clientId) => {
        console.log('Client ID to delete:', clientId); // Verifica en la consola si se muestra correctamente el ID
        setClientToDelete(clientId);
        setIsDeleting(true); // Mostrar modal de confirmación
    };         
    
    const handleConfirmDelete = async () => {
        if (!clientToDelete) {
            console.error('No client ID to delete');
            return;
        }
    
        try {
            const token = localStorage.getItem('jwt');
            if (!token) {
                console.error('No token found. Please log in.');
                return;
            }
    
            console.log('Deleting client with ID:', clientToDelete); // Verifica si el ID es correcto
    
            const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${clientToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (response.ok) {
                // Eliminar cliente de la lista sin necesidad de recargar la página
                setClients(clients.filter(client => client._id !== clientToDelete));
                setIsDeleting(false); // Cerrar modal
                setClientToDelete(null); // Resetear cliente
            } else {
                const errorMessage = await response.text();
                console.error('Error deleting client:', errorMessage);
            }
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };    
    const handleCancelDelete = () => {
        setIsDeleting(false); // Cerrar el modal si se cancela
        setClientToDelete(null); // Resetear el cliente a eliminar
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name in newClient.address) {
            setNewClient({
                ...newClient,
                address: { ...newClient.address, [name]: value }
            });
        } else {
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

                    {isClientCreated && (
                        <div className="confirmation-modal">
                            <div className="confirmation-message">
                                <p>¡Cliente creado correctamente!</p>
                                <button onClick={() => setIsClientCreated(false)}>Cerrar</button>
                            </div>
                        </div>
                    )}

                    {clients.length > 0 ? (
                        <>
                            <button onClick={() => setIsCreating(true)}>Crear Cliente</button>
                            <div className="client-list">
                                {clients.map((client, index) => {
                                    console.log('Client _id:', client._id); // Verifica que se muestre correctamente
                                    return (
                                        <div className="client-card" key={index}>
                                            <Link href={`/clients/${client._id}`}>
                                                <h3>{client.name}</h3>
                                                <p>{client.cif}</p>
                                                <p>{client.address.street} {client.address.number}</p>
                                                <p>{client.address.city}, {client.address.province}</p>
                                                <p>{client.address.postal}</p>
                                            </Link>
                                            <button onClick={() => handleDeleteClick(client._id)}>Eliminar</button>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
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

                    {isDeleting && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>¿Estás seguro de que deseas eliminar este cliente?</h2>
                                <div className="modal-actions">
                                    <button onClick={handleConfirmDelete}>Sí, Eliminar</button>
                                    <button onClick={handleCancelDelete}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
