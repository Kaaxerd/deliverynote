//
// VALIDACIÓN
//

"use client";
import React from 'react';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import './validation.css';

const ValidationPage = () => {
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);

    const handleInputChange = (index, value) => {
        if (value.length > 1) return; // Asegurarse de que solo se ingrese un carácter
        const updatedCode = [...verificationCode];
        updatedCode[index] = value;
    
        // Mover al siguiente input si se escribe un número válido
        if (value && index < verificationCode.length - 1) {
            const nextInput = document.getElementById(`input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    
        setVerificationCode(updatedCode);
    };
    
    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace') {
            const updatedCode = [...verificationCode];
            updatedCode[index] = ''; // Borra el valor actual
            setVerificationCode(updatedCode);
    
            // Mover al input anterior si existe
            if (index > 0) {
                const previousInput = document.getElementById(`input-${index - 1}`);
                if (previousInput) previousInput.focus();
            }
        }
    };    
    
    useEffect(() => {
        const sendVerificationCode = async () => {
            try {
                const token = localStorage.getItem('jwt');
                const email = localStorage.getItem('registeredEmail');
                const status = localStorage.getItem('userStatus');
    
                if (!token || !email) {
                    alert('Session expired. Please register again.');
                    window.location.href = '/register';
                    return;
                }
    
                if (status !== 'validated') {
                    alert('Your account is not validated yet. Please check your email or contact support.');
                    return;
                }
    
                console.log('JWT Token:', token);
                console.log('Registered Email:', email);
    
                const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/validation', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email }),
                });
    
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error in API response:', errorText);
                    if (response.status === 401) {
                        alert('Authorization failed. Please ensure you are logged in and try again.');
                    } else if (response.status === 400) {
                        alert('Validation failed: Please ensure your email is registered.');
                    } else {
                        alert(`Failed to send verification code: ${errorText}`);
                    }
                    return;
                }
    
                const data = await response.json();
                console.log('Validation data:', data);
    
                if (data.code) {
                    localStorage.setItem('verificationCode', data.code);
                    console.log('Verification code stored:', data.code);
                } else {
                    console.error('No verification code returned by the API.');
                    alert('Failed to retrieve verification code.');
                }
            } catch (error) {
                console.error('Error in sendVerificationCode:', error);
                alert('An unexpected error occurred. Please try again later.');
            }
        };
    
        sendVerificationCode();
    }, []);   

    const verifyCode = async () => {
        const code = verificationCode.join(''); // Combina los caracteres ingresados
        console.log('Entered code:', code);
    
        try {
            const storedCode = localStorage.getItem('verificationCode'); // Recupera el código de localStorage
            console.log('Stored code:', storedCode);
    
            if (!storedCode) {
                alert('No verification code found. Please request a new code.');
                return;
            }
    
            if (code === storedCode) {
                console.log('Code verified successfully!');
                alert('Code verified successfully!');
            } else {
                console.log('Invalid code!');
                alert('Invalid code, please try again.');
            }
        } catch (error) {
            console.error('Error during verification:', error);
            alert('An error occurred during verification.');
        }
    };    
    
    return (
        <div>
            <Header />
            <h1>Enter verification code</h1>
            <p>We have just sent you a verification code to ...</p>
            <div className="validation-container">
                <div className='input-container'>
                    <div>
                        {verificationCode.map((value, index) => (
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
                    
                    <button onClick={verifyCode}>Verify</button>
                </div>
            </div>
        </div>
    );
};

export default ValidationPage;