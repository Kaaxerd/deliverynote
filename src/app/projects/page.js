"use client"; 
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../dashboard/styles.css';
import './projects.css';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isProjectCreated, setIsProjectCreated] = useState(false);
    const [newProject, setNewProject] = useState({
        name: '',
        clientId: '',
        internalCode: ''
    });
    const [projectToDelete, setProjectToDelete] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (!token) {
            console.error('No token found. Please log in.');
            return;
        }

        const fetchProjects = async () => {
            try {
                const response = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
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
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
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

        fetchProjects();
        fetchClients();
    }, []);

    const handleCreateProject = async () => {
        const token = localStorage.getItem('jwt');
        try {
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/project', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(newProject),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error creating project:', errorMessage);
                return;
            }

            const createdProject = await response.json();
            setProjects([...projects, createdProject]);
            setNewProject({
                name: '',
                clientId: '',
                internalCode: ''
            });
            setIsCreating(false);
            setIsProjectCreated(true);
            setTimeout(() => setIsProjectCreated(false), 3000);
        } catch (error) {
            console.error('Error creating project:', error);
        }
    };

    const handleDeleteClick = (projectId) => {
        setProjectToDelete(projectId);
        setIsDeleting(true);
    };

    const handleConfirmDelete = async () => {
        const token = localStorage.getItem('jwt');
        try {
            const response = await fetch(`https://bildy-rpmaya.koyeb.app/api/project/${projectToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                console.error('Error deleting project:', errorMessage);
                return;
            }

            setProjects(projects.filter((project) => project._id !== projectToDelete));
            setIsDeleting(false);
            setProjectToDelete(null);
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const handleCancelDelete = () => {
        setIsDeleting(false);
        setProjectToDelete(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProject({
            ...newProject,
            [name]: value
        });
    };

    return (
        <div className="layout">
            <Header />
            <div className="main">
                <Sidebar />
                <div className="content">
                    <h1>Proyectos</h1>

                    {isProjectCreated && (
                        <div className="confirmation-modal">
                            <div className="confirmation-message">
                                <p>¡Proyecto creado correctamente!</p>
                                <button onClick={() => setIsProjectCreated(false)}>Cerrar</button>
                            </div>
                        </div>
                    )}

                    {projects.length > 0 ? (
                        <div className="project-list">
                            <button onClick={() => setIsCreating(true)}>Crear Proyecto</button>
                            {projects.map((project, index) => (
                                <div className="project-card" key={index}>
                                    <Link href={`/projects/${project._id}`}>
                                        <h3>{project.name}</h3>
                                        <p><strong>Código Interno:</strong> {project.internalCode}</p>
                                    </Link>
                                    <button onClick={() => handleDeleteClick(project._id)}>Eliminar</button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-projects">
                            <p>No hay proyectos disponibles.</p>
                            <button onClick={() => setIsCreating(true)}>Crear Proyecto</button>
                        </div>
                    )}

                    {isCreating && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>Crear Proyecto</h2>
                                <input
                                    type="text"
                                    placeholder="Nombre del Proyecto"
                                    name="name"
                                    value={newProject.name}
                                    onChange={handleChange}
                                />
                                <select
                                    name="clientId"
                                    value={newProject.clientId}
                                    onChange={handleChange}
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
                                    placeholder="Código Interno"
                                    name="internalCode"
                                    value={newProject.internalCode}
                                    onChange={handleChange}
                                />
                                <div className="modal-actions">
                                    <button onClick={handleCreateProject}>Guardar</button>
                                    <button onClick={() => setIsCreating(false)}>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isDeleting && (
                        <div className="modal">
                            <div className="modal-content">
                                <h2>¿Estás seguro de que deseas eliminar este proyecto?</h2>
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
