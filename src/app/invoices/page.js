import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../dashboard/styles.css';

export default function DeliveryNotePage() {
    return (
        <div className='layout'>
            <Header />
            <div className='main'>
                <Sidebar />
                <h1>Welcome to the Invoices</h1>
                <p>This is your default dashboard page.</p>
            </div>
        </div>
    );
}