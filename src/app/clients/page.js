import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../dashboard/styles.css';

export default function ClientsPage() {
    return (
        <div className='layout'>
            <Header />
            <div className='main'>
                <Sidebar />
                <h1>Welcome to the Clients</h1>
                <p>This is your default dashboard page.</p>
            </div>
        </div>
    );
}