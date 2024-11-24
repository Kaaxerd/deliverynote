"use client";
import Header from "../components/Header";
import Overview from "../components/Overview";

const dashboard = () => {
    return (
        <div className="dashboard-container">
            <Header />
            <div className="content-container">
                <Overview />
                <div className="main-content">
                    <h1>Dashboard</h1>
                    <p>Welcome to the dashboard!</p>
                </div>
            </div>
        </div>
    );
};

export default dashboard;
