"use client"; // Asegura que el archivo se ejecute solo en el cliente

import React, { useState, useEffect } from 'react';
import Header from '../components/Header'; // Asumiendo que tienes un componente Header
import { useRouter } from 'next/navigation'; // Usamos el router para redirigir
import './register.css';

export default function Register() {
    const [step, setStep] = useState(1); // 1: Registro, 2: Validación
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        verificationCode: ['', '', '', '', '', ''], // Para el código de validación
    });
    const [message, setMessage] = useState('');
    const [isRegistered, setIsRegistered] = useState(false); // Estado para controlar si el usuario ya está registrado
    const [isValidated, setIsValidated] = useState(false); // Estado para controlar la validación del usuario
    const router = useRouter();

    useEffect(() => {
        // Verifica el estado actual cada vez que se actualice
        console.log('Current Step:', step);
        console.log('Form Data:', formData);
        console.log('Is Registered:', isRegistered);
        console.log('Message:', message);
    }, [step, formData, isRegistered, message]);

    // Maneja los cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleInputChange = (index, value) => {
        if (value.length > 1 || isNaN(value)) return; // Asegurarse de que solo se ingrese un número

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Si estamos en el paso de registro
        if (step === 1) {
            // Verificar que las contraseñas coincidan
            if (formData.password !== formData.confirmPassword) {
                setMessage("Las contraseñas no coinciden");
                return;
            }

            try {
                // Hacer la solicitud de registro
                const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: formData.email,
                        password: formData.password,
                    }),
                });

                // Si la respuesta es exitosa
                if (response.ok) {
                    const data = await response.json(); // Obtener la respuesta JSON

                    // Si la API devuelve un token, guardarlo en localStorage
                    if (data.token) {
                        localStorage.setItem("jwt", data.token); // Guardamos el token en localStorage
                        setMessage("Registro exitoso. Ahora valida tu cuenta.");

                        // Llamamos a la función para avanzar al siguiente paso
                        setStep(2); // Cambiar al paso de validación
                    } else {
                        setMessage("No se recibió el token, intenta de nuevo.");
                    }
                } else {
                    const data = await response.json();
                    setMessage(data.message || "Hubo un error al registrar.");
                }
            } catch (error) {
                setMessage("Hubo un error en el registro.");
            }
        }

        // Si estamos en el paso de validación
        if (step === 2) {
            const validationCode = formData.verificationCode.join(""); // Convertir el array en una cadena

            // Verificar que el código no esté vacío y tenga la longitud correcta
            if (validationCode.length !== 6 || /\D/.test(validationCode)) { // Verificar que solo contenga números
                setMessage("Por favor, ingresa el código de validación completo y válido.");
                return;
            }

            try {
                // Hacer la solicitud de validación con el método PUT
                const response = await fetch("https://bildy-rpmaya.koyeb.app/api/user/validation", {
                    method: "PUT", // Cambiar el método a PUT
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("jwt")}`, // Enviar el token si está en localStorage
                    },
                    body: JSON.stringify({
                        code: validationCode, // Enviar el código de validación como cadena de números
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.acknowledged) {
                        setMessage("Código de validación exitoso. Tu cuenta ha sido activada.");
                        setIsValidated(true); // Ahora actualizamos el estado para indicar que la cuenta está validada
                        setStep(3);
                    } else {
                        setMessage("El código de validación es incorrecto, por favor verifica.");
                    }
                } else {
                    const data = await response.json();
                    setMessage(data.message || "Hubo un error con la validación.");
                }
            } catch (error) {
                setMessage("Hubo un error al validar.");
                console.error("Error de validación:", error);
            }
        }
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
                                    required
                                />
                            </div>
                            <div>
                                <label>Password:</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label>Confirm Password:</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
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
                        </>
                    )}
                </form>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
}