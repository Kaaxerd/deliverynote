//
// REGISTRO
//

"use client";
import { useState } from 'react';
import Header from '../components/Header';
import './register.css';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log('Registration data:', data);
    
                if (data.token) {
                    // Guardar información clave en localStorage
                    localStorage.setItem('jwt', data.token);
                    localStorage.setItem('registeredEmail', data.user.email);
                    localStorage.setItem('userStatus', data.user.status); // Guarda el estado del usuario
    
                    // Redirige a la página de validación
                    window.location.href = '/validation';
                } else {
                    console.error('Token not received:', data);
                    alert('Registration successful, but token not received.');
                }
            } else {
                const errorData = await response.json();
                console.error('Registration failed:', errorData);
                alert(`Registration failed: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('An error occurred during registration:', error);
            alert('An error occurred. Please try again.');
        }
    };    

    return (
        <>
            <Header />
            <h1>Register</h1>

            <div className="register-container">
                <form onSubmit={handleSubmit}>
                    {/* <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div> */}
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
            </div>
        </>
    );
}