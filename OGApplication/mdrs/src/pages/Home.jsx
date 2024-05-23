import React, { useState, useEffect } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';

import { DashboardLogTables } from "../components/DashboardLogTable";
import { DashboardTables } from "../components/DashboardTable";

import { ErrorAlert } from "../components/Alerts";
import {useAuth} from "../AuthProvider";

export default function Home() {

    return (
        <main>
            <section className="hero">
                <div className="hero__content">
                    <h1 className="hero__title">Dashboard</h1>
                    <p className="hero__subtitle"></p>
                    <br></br>
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

