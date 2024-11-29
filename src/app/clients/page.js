import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../dashboard/styles.css';

export default function DashboardPage() {
    return (
        <div className='layout'>
            <Header />
            <div className='main'>
                <Sidebar />

                <div className='content'>
                    <h1>Clientes</h1>
                    <p>This is your default dashboard page.</p>
                    <p>Ay mi madre el bichoooooooo</p>
                </div>
                
            </div>
        </div>
    );
}