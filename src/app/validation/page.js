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
        if (value.length > 1) return; // Solo un carácter por campo
        const updatedCode = [...verificationCode];
        updatedCode[index] = value;
        setVerificationCode(updatedCode);
    };
    
    
    useEffect(() => {
        const sendVerificationCode = async () => {
            try {
                const token = localStorage.getItem('jwt'); // Recupera el token desde localStorage
                const email = localStorage.getItem('registeredEmail'); // Recupera el correo desde localStorage
    
                if (!token || !email) {
                    throw new Error('Token or email not found in localStorage');
                }
    
                const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/validation', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // Usa el token recuperado
                    },
                    body: JSON.stringify({
                        email: email, // Usa el correo recuperado
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to send verification code');
                }
    
                console.log('Verification code sent successfully');
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        sendVerificationCode();
    }, []);

    const verifyCode = async () => {
        const code = verificationCode.join(''); // Combina los caracteres en un string
        try {
            const email = localStorage.getItem('registeredEmail'); // Recupera el correo desde localStorage
    
            if (!email) {
                throw new Error('Email not found in localStorage');
            }
    
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email, // Usa el correo recuperado
                    code: code, // Código ingresado por el usuario
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to verify code');
            }
    
            console.log('Code verified successfully');
            alert('Code verified successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to verify code. Please try again.');
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
                        <input
                            type="text"
                            maxLength="1"
                            style={{ width: '20px', marginRight: '5px', textAlign: 'center' }}
                            value={verificationCode[0]}
                            onChange={(e) => handleInputChange(0, e.target.value)}
                        />
                        <input
                            type="text"
                            maxLength="1"
                            style={{ width: '20px', marginRight: '5px', textAlign: 'center' }}
                            value={verificationCode[1]}
                            onChange={(e) => handleInputChange(1, e.target.value)}
                        />
                        <input
                            type="text"
                            maxLength="1"
                            style={{ width: '20px', marginRight: '5px', textAlign: 'center' }}
                            value={verificationCode[2]}
                            onChange={(e) => handleInputChange(2, e.target.value)}
                        />
                        <input
                            type="text"
                            maxLength="1"
                            style={{ width: '20px', marginRight: '5px', textAlign: 'center' }}
                            value={verificationCode[3]}
                            onChange={(e) => handleInputChange(3, e.target.value)}
                        />
                        <input
                            type="text"
                            maxLength="1"
                            style={{ width: '20px', marginRight: '5px', textAlign: 'center' }}
                            value={verificationCode[4]}
                            onChange={(e) => handleInputChange(4, e.target.value)}
                        />
                        <input
                            type="text"
                            maxLength="1"
                            style={{ width: '20px', marginRight: '5px', textAlign: 'center' }}
                            value={verificationCode[5]}
                            onChange={(e) => handleInputChange(5, e.target.value)}
                        />
                    </div>
                    
                    <button onClick={verifyCode}>Verify</button>
                </div>
            </div>
        </div>
    );
};

export default ValidationPage;