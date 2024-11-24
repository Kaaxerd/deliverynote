import React from 'react';
import styles from '../dashboard/dashboard.css';
import './Overview.css';

const Overview = () => {
    return (
        <div className={styles.overviewContainer}>
            <h1 className='overviewTitle'>Overview</h1>
            <p className='overviewText'>This is the overview component.</p>
        </div>
    );
};

export default Overview;
