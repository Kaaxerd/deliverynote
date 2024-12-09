"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/Header'; // Ajusta la ruta si es necesario
import Sidebar from '../../../components/Sidebar'; // Ajusta la ruta si es necesario
import '../../../dashboard/styles.css';
import '../../projects.css';

export default function ProjectPage() {
    const params = useParams(); // Obtiene parámetros dinámicos
    const { client, id } = params; // Extrae `client` e `id` de los parámetros

    const [project, setProject] = useState(null);
    const [clients, setClients] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProject, setEditedProject] = useState({});

    useEffect(() => {
        if (!client || !id) {
            console.error('No client ID or project ID found in URL.');
            return;
        }

        const token = localStorage.getItem('jwt');
        if (!token) {
            console.error('No token found. Please log in.');
            return;
        }

        const fetchProjectData = async () => {
            try {
                const projectResponse = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${client}/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!projectResponse.ok) {
                    const errorMessage = await projectResponse.text();
                    throw new Error(errorMessage);
                }

                const projectData = await projectResponse.json();
                setProject(projectData);
                setEditedProject({ ...projectData });
            } catch (error) {
                console.error('Error fetching project data:', error);
            }
        };

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

        fetchProjectData();
        fetchClients();
    }, [client, id]);

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditedProject({
            ...editedProject,
            [name]: value,
        });
    };

    const handleSaveEdit = async () => {
        const token = localStorage.getItem('jwt');
        try {
            const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${client}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(editedProject),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error updating project:', errorMessage);
                return;
            }

            const updatedProject = await response.json();
            setProject(updatedProject);
            setEditedProject({ ...updatedProject });
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
                    <h1>Detalles del Proyecto</h1>
                    <Link href="/projects">
                        <button>Volver a los proyectos</button>
                    </Link>

                    {project ? (
                        <div className="project-details">
                            {isEditing ? (
                                <div className="edit-form">
                                    <p><strong>Editando:</strong> {project.name}</p>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Nombre del proyecto"
                                        value={editedProject.name}
                                        onChange={handleEditChange}
                                    />
                                    <select
                                        name="clientId"
                                        value={editedProject.clientId}
                                        onChange={handleEditChange}
                                    >
                                        <option value="">Selecciona un cliente</option>
                                        {clients.map((client) => (
                                            <option key={client._id} value={client._id}>
                                                {client.name}
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        name="internalCode"
                                        placeholder="Código Interno"
                                        value={editedProject.internalCode}
                                        onChange={handleEditChange}
                                    />
                                    <button onClick={handleSaveEdit}>Guardar Cambios</button>
                                </div>
                            ) : (
                                <div className="project-info">
                                    <p><strong>Nombre:</strong> {project.name}</p>
                                    <p><strong>Cliente:</strong> {clients.find(c => c._id === project.clientId)?.name || 'N/A'}</p>
                                    <p><strong>Código Interno:</strong> {project.internalCode}</p>
                                    <button onClick={() => setIsEditing(true)}>Editar</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Cargando datos del proyecto...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
