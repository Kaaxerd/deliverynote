import React from 'react';
import styles from '../dashboard/dashboard.css';
import './Overview.css';

const Overview = () => {
    return (
        <div className={styles.overviewContainer}>
            <h3 className='overviewTitle'>Overview</h3>
            <ul className='overviewList'>
                <li className='overviewItem'>
                    <i className='icon-summary'></i>
                    <span>Resumen</span>
                </li>
                <li className='overviewItem'>
                    <i className='icon-clients'></i>
                    <span>Clientes</span>
                </li>
                <li className='overviewItem'>
                    <i className='icon-projects'></i>
                    <span>Proyectos</span>
                </li>
                <li className='overviewItem'>
                    <i className='icon-delivery-notes'></i>
                    <span>Albaranes</span>
                </li>
                <li className='overviewItem'>
                    <i className='icon-suppliers'></i>
                    <span>Proveedores</span>
                </li>
                <li className='overviewItem'>
                    <i className='icon-settings'></i>
                    <span>Ajustes</span>
                </li>
            </ul>
        </div>
    );
};

export default Overview;
