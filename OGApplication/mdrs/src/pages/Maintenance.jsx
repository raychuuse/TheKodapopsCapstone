import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css'; // Optional theme CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import LoadingSpinner from "../components/LoadingSpinner";
import Table from "../components/Table";
import {useNavigate} from 'react-router-dom';
import {ErrorAlert} from "../components/Alerts";

import {
  getMaintenanceBreakdown
} from "../api/bins";





export default function Maintenance() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    return (
        <main>
            <div className="container-fluid">
                <div className="row">
                    <section className="data-table">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="table-wrapper">
                                    <div className="table-header-wrapper">
                                        <h1 className="table-header">Bins Requiring Attention:</h1>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className="row">
                                <div className="col">
                                    <div className="row">
                                        <MaintenanceBreakdown/>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}

const MaintenanceBreakdown = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        getMaintenanceBreakdown()
            .then((data) => {
                setData(data);
                setError(null);
            })
            .catch(err => {
                setError(err);
            });
    });


    const columns = [
        {headerName: "Bin", field: "id"},
        {headerName: "Issue", field: "issue"}
    ];

    return (
        <div className="col">
            <section className="metric">
                <div className="hero__content">
                    <div className="table-wrapper">
                        <div className="table-header-wrapper">
                            <h4 className="table-header">Bin Issues</h4>
                        </div>
                        <div className="row">
                        {error && <ErrorAlert message={error.message}/>}
                            {data ? <Table columns={columns} data={data}/> : <h2 className = "table-header">No Current Issues</h2>}
                        </div>
                    </div>
                </div>
            </section>
        </div>);
}