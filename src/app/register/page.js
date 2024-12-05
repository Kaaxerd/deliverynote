"use client";
import React, { useState } from 'react';
import Header from '../components/Header';
import './register.css';

export default function Register() {
    const [step, setStep] = useState(1);  // 1: Registro, 2: Validación
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        verificationCode: ['', '', '', '', '', ''], // Para el código de validación
    });
    const [token, setToken] = useState('');
    const [storedCode, setStoredCode] = useState('');  // Estado para guardar el código de verificación

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (step === 1) {
            // Registro
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
                    console.log('Registration successful, code:', data.code); // Muestra el código
                    setToken(data.token);
                    setStoredCode(data.code);  // Guarda el código en storedCode
                    setStep(2);  // Cambia al paso de validación
                } else {
                    alert('Registration failed');
                }
            } catch (error) {
                console.error('An error occurred:', error);
                alert('An error occurred. Please try again.');
            }
        } else if (step === 2) {
            // Validación
            try {
                const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/validation', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        verificationCode: formData.verificationCode.join(''),
                    }),
                });
    
                if (response.status === 200) {
                    const data = await response.json();
                    console.log('Validation successful:', data); // Muestra los detalles de la respuesta
                    alert('Verification successful!');
                    setStep(1);  // Cambia al paso de registro
                } else if (response.status === 401) {
                    alert('Unauthorized: Token is missing or invalid.');
                } else if (response.status === 422) {
                    alert('Validation error: The verification code is incorrect.');
                } else {
                    alert('An error occurred. Please try again later.');
                }
            } catch (error) {
                console.error('An error occurred:', error);
                alert('An error occurred. Please try again.');
            }
        }
    };    

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace') {
            const updatedCode = [...formData.verificationCode];
            updatedCode[index] = ''; // Borra el valor actual
            setFormData({
                ...formData,
                verificationCode: updatedCode
            });
    
            // Mover al input anterior si existe
            if (index > 0) {
                const previousInput = document.getElementById(`input-${index - 1}`);
                if (previousInput) previousInput.focus();
            }
        }
    };

    const handleInputChange = (index, value) => {
        if (value.length > 1) return; // Asegurarse de que solo se ingrese un carácter
        const updatedCode = [...formData.verificationCode];
        updatedCode[index] = value;
    
        // Mover al siguiente input si se escribe un número válido
        if (value && index < formData.verificationCode.length - 1) {
            const nextInput = document.getElementById(`input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    
        setFormData({
            ...formData,
            verificationCode: updatedCode
        });
    };

    return (
        <div>
            <Header />
            <h1>{step === 1 ? 'Register' : 'Verify Your Account'}</h1>
            
            <div className="register-container">
                <form onSubmit={handleSubmit}>
                    {step === 1 && (
                        <>
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
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h1>Enter verification code</h1>
                            <p>We have just sent you a verification code to {formData.email}</p>
                            <div className="validation-container">
                                <div className='input-container'>
                                    <div>
                                        {formData.verificationCode.map((value, index) => (
                                            <input
                                                key={index}
                                                id={`input-${index}`} // Asigna un id único a cada input
                                                type="text"
                                                maxLength="1"
                                                style={{ width: '40px', height: '40px', marginRight: '5px', textAlign: 'center' }}
                                                value={value}
                                                onChange={(e) => handleInputChange(index, e.target.value)}  
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                            />
                                        ))}
                                    </div> 
                                    
                                    <button type="submit">Verify</button>
                                </div>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}
