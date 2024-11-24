//
// DASHBOARD / PANEL DE CONTROL
//

"use client";
import ClientList from "../components/ClientList";
import Header from "../components/Header";
import Overview from "../components/Overview";

const dashboard = () => {
    return (
        <div className="dashboard-container">
            <Header />
            <div className="content-container">
                <Overview />
                <div className="main-content">
                    <ClientList />
                </div>
            </div>
        </div>
    );
};

export default dashboard;
