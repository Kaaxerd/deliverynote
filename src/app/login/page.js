"use client";
import { useState } from 'react';
import Header from '../components/Header';

import './login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const contentType = response.headers.get('content-type');

            if (response.ok) {
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    console.log('User logged in successfully:', data);

                    // Guarda el token en localStorage si se devuelve uno
                    if (data.token) {
                        localStorage.setItem('jwt', data.token);
                    }
                } else {
                    const textData = await response.text(); // Si no es JSON, obten el texto
                    console.log('User logged in successfully:', textData);
                }

                window.location.href = '/clients';
            } else {
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    console.error('Login failed:', errorData);
                    alert(`Login failed: ${errorData.message || 'Unknown error'}`);
                } else {
                    const errorText = await response.text();
                    console.error('Login failed:', errorText);
                    alert(`Login failed: ${errorText}`);
                }
            }
        } catch (error) {
            console.error(error);
        }

        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <>
            <Header />

            <h1>Login</h1>

            <div className="login-container">
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </>
    );
}
