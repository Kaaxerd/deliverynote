"use client"; 
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header'; // Adaptado para importar desde la carpeta correcta
import Sidebar from '../../components/Sidebar'; // Adaptado para importar desde la carpeta correcta
import '../../dashboard/styles.css'; // Rutas adaptadas según la estructura
import '../clients.css'; // Mantén la ruta actual si está en el mismo directorio

export default function ClientPage({ params }) {
    const [client, setClient] = useState(null);
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedClient, setEditedClient] = useState({});
    const [id, setId] = useState(null); // Nueva variable para manejar el ID del cliente

    // Usamos React.use() para obtener los parámetros de la ruta de manera adecuada
    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            console.error('No token found. Please log in.');
            return;
        }

        // Establecemos el ID una vez que se resuelva el Promise de params
        if (params && params.id) {
            setId(params.id);
        }
    }, [params]);

    useEffect(() => {
        if (!id) return; // Si no tenemos el ID, no hacemos la solicitud

        const fetchClientData = async () => {
            try {
                const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(errorMessage);
                }

                const data = await response.json();
                setClient(data);
                setEditedClient({ ...data }); // Inicializa el estado de edición con los datos actuales del cliente

                // Obtener proyectos asociados
                const projectResponse = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                    },
                });

                if (!projectResponse.ok) {
                    const errorMessage = await projectResponse.text();
                    throw new Error(errorMessage);
                }

                const projectData = await projectResponse.json();
                setProjects(projectData);

            } catch (error) {
                console.error('Error fetching client or projects:', error);
            }
        };

        fetchClientData();
    }, [id]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedClient({
            ...editedClient,
            [name]: value,
        });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/client/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
                },
                body: JSON.stringify(editedClient),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error updating client:', errorMessage);
                return;
            }

            const updatedClient = await response.json();
            setClient(updatedClient);
            setEditedClient({ ...updatedClient });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };

    return (
        <div className="layout">
            <Header />
            <div className="main">
                <Sidebar />
                <div className="content">
                    <h1>Detalles del Cliente</h1>

                    <Link href="/clients">
                        <button>Volver a los clientes</button>
                    </Link>

                    {client && (
                        <div className="client-details">
                            {isEditing ? (
                                <div className="edit-form">
                                    <input
                                        type="text"
                                        name="name"
                                        value={editedClient.name}
                                        onChange={handleEditChange}
                                    />
                                    <input
                                        type="text"
                                        name="cif"
                                        value={editedClient.cif}
                                        onChange={handleEditChange}
                                    />
                                    <input
                                        type="text"
                                        name="street"
                                        value={editedClient.address.street}
                                        onChange={handleEditChange}
                                    />
                                    <input
                                        type="text"
                                        name="postal"
                                        value={editedClient.address.postal}
                                        onChange={handleEditChange}
                                    />
                                    <input
                                        type="text"
                                        name="city"
                                        value={editedClient.address.city}
                                        onChange={handleEditChange}
                                    />
                                    <input
                                        type="text"
                                        name="province"
                                        value={editedClient.address.province}
                                        onChange={handleEditChange}
                                    />
                                    <button onClick={handleSaveEdit}>Guardar Cambios</button>
                                </div>
                            ) : (
                                <div className="client-info">
                                    <p><strong>Nombre:</strong> {client.name}</p>
                                    <p><strong>CIF:</strong> {client.cif}</p>
                                    <p><strong>Domicilio fiscal:</strong> {client.address.street}, {client.address.number}</p>
                                    <p><strong>Código Postal:</strong> {client.address.postal}</p>
                                    <p><strong>Ciudad:</strong> {client.address.city}</p>
                                    <p><strong>Provincia:</strong> {client.address.province}</p>
                                    <button onClick={() => setIsEditing(true)}>Editar</button>
                                </div>
                            )}

                            <h2>Proyectos Asociados</h2>
                            {projects.length > 0 ? (
                                <ul>
                                    {projects.map((project) => (
                                        <li key={project._id}>
                                            <Link href={`/projects/${project._id}`}>
                                                {project.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay proyectos asociados a este cliente.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
