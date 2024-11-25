import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import './styles.css';

export default function DashboardPage() {
    return (
        <div className='layout'>
            <Header />
            <div className='main'>
                <Sidebar />
                <h1>Welcome to the Dashboard</h1>
                <p>This is your default dashboard page.</p>
            </div>
        </div>
    );
}