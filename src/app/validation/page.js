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
                const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/validation', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: localStorage.getItem('registeredEmail'),
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
            const response = await fetch('https://bildy-rpmaya.koyeb.app/api/user/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: localStorage.getItem('registeredEmail'),
                    code: code,
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
            {verificationCode.map((value, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength="1"
                    style={{ width: '20px', marginRight: '5px', textAlign: 'center' }}
                    value={value}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                />
            ))}

            <button onClick={verifyCode}>Verify</button>
        </div>
    );
};

export default ValidationPage;