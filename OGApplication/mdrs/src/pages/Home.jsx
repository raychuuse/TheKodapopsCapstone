import React, { useState, useEffect } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

import { DashboardMetrics } from "../components/DashboardMetrics";
import { DashboardLogTables } from "../components/DashboardLogTable";
import { DashboardTables } from "../components/DashboardTable";

import { ErrorAlert } from "../components/Alerts";
import {useAuth} from "../AuthProvider";

export default function Home() {

    /*useEffect(() => {
        const newSocket = new WebSocket('ws://localhost:8080/test')

        newSocket.onopen = () => {
            console.info('Connection');
        };

        newSocket.onmessage = message => {
            console.info('Received', message);
        };

        newSocket.onclose = () => {
            console.info('Closed');
        };

        setInterval(() => {
            newSocket.send('Testing a');
        }, 5000);

        return () => {
            newSocket.close();
        };
    }, []);*/

    return (
        <main>
            <section className="hero">
                <div className="hero__content">
                    <h1 className="hero__title">Dashboard</h1>
                    <p className="hero__subtitle"></p>
                    <br></br>
                    {/* Overview Metrics */}
                    <div className="row">
                        {/**<DashboardMetrics />**/}
                    </div>
                    {/* Overview Tables */}
                    <div className="row">
                        <hr></hr>
                        < DashboardTables />
                    </div>
                    <br></br>
                    <div className="row">
                        <hr></hr>
                        <DashboardLogTables />
                    </div>
                </div>
            </section>
        </main>
    );
}

