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
    getMaintenanceBreakdown, resolveBin,
} from '../api/bins';
import { Button } from 'reactstrap';





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

    /*
    .then((body) => body.json())
        .then((data) =>{
            console.info(data);
            // Data formatting
            return data.map((obj) => ({
                id: obj.binID,
                sidingName: obj.sidingName,
                issue: getFlag(obj.missing, obj.repair),
            }))
        })
     */
    useEffect(() => {
        getMaintenanceBreakdown()
            .then((data) => {
                setData(data.map(b => {
                    return {
                        id: b.binID,
                        sidingName: b.sidingName,
                        issue: getFlag(b.missing, b.repair),
                    }
                }));
                setError(null);
            })
            .catch(err => {
                setError(err);
            });
    }, []);


    const getFlag = (missing, repair) => {
        if (missing) {
            return "Missing";
        }
        if (repair)
        {
            return "Needs Repairs";
        }
    }

    const onResolvePressed = (params) => {
        console.info(params);
        resolveBin(params.data.id)
            .then(response => {
                const index = data.findIndex(d => d.id === params.data.id);
                if (index >= 0) {
                    data.splice(index, 1);
                    setData([...data]);
                    setError(null);
                    console.info('hello');
                } else {
                    setError({message: 'Failed to resolve issue. Please try again.'});
                }
            })
            .catch(err => {
                console.error(err);
                setError({message: 'Failed to resolve issue. Please try again.'});
            });
    };

    const columns = [
        {headerName: "Bin", field: "id"},
        {headerName: "Siding Location (Or Last Location)", field: "sidingName"},
        {headerName: "Issue", field: "issue"},
        {
            headerName: 'Resolve',
            cellRenderer: params => {
               return <><Button color={'success'} style={{width: '100%'}} onClick={() => onResolvePressed(params)}>Resolve Issue</Button></>
            }
        }
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