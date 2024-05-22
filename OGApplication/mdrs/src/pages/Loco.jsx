import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import {List, Search} from "../components/Search";
import {ErrorAlert} from "../components/Alerts";
import LoadingSpinner from "../components/LoadingSpinner";

import {
    createLoco,
    deleteLoco,
    getAllLocos,
    getCurrentLoad,
    getLoco,
    getSidingBreakdown,
    updateLoco
} from "../api/locos";
import Table from "../components/Table";
import ItemList from "../components/ItemList";

export default function Loco() {
    const navigate = useNavigate();
    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");

    const [searchResult, setSearchResult] = useState([]);

    const changeState = (loco) => {
        setSearchResult(loco);
        navigate(`?id=${loco}`);
    };

    return (
        <main>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="container-fluid">
                            <ItemList onItemSelected={changeState} itemName={'Locomotive'} getAllItemApi={getAllLocos}
                                      createItemApi={createLoco} updateItemApi={updateLoco} deleteItemApi={deleteLoco}/>
                        </div>
                    </div>
                    <div className="col-sm-9">
                        {/* Ensuring loco info is rendered if id is provided */}
                        {id ? <LocoDetails id={id}/> : null}
                    </div>
                </div>
            </div>
        </main>
    );
}

//Displays data of a single loco
const LocoDetails = ({id}) => {
    const [locoData, setLocoData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getLoco(id)
            .then(data => {
                setLocoData(data);
                setError(null);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLocoData(null);
                setLoading(false);
            });
    });

    return (
        <>
            {loading && <LoadingSpinner/>}
            {error && <ErrorAlert message={error.message}/>}
            {!loading && !error && (
                <section className="data-table">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="table-wrapper">
                                <div className="table-header-wrapper">
                                    {/*<h1 className="table-header">{locoData.name}</h1>*/}
                                    <div className="table-bin-count-wrapper">
                                        <h1 className="bin-count-header">Locomotive: {id ? id: "Select a Loco"}</h1>
                                        {/*<h1 className="bin-count-number">{`${locoData.data.full.length + locoData.data.empty.length}`}</h1>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <LocoCurrentLoad id={id}/>
                        </div>
                        <hr/>
                        <div className="row">
                            <LocoSidingBreakdown id={id}/>
                        </div>
                        <br/>
                        <hr/>
                    </div>
                    <br/>
                </section>
            )}
        </>
    )
}

/*
[
    {
        "binID": 8,
        "code": "",
        "status": "FULL",
        "locoID": 3,
        "locoName": "Loco 3"
    }
]
 */
const LocoCurrentLoad = ({id}) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getCurrentLoad(id)
            .then(data => {
                setData(data.bins);
                setError(null);
            })
            .catch(err => {
                setError(err);
            });
    }, []);


    const columns = [
        {headerName: "Bin", field: "code"},
        {headerName: 'Full', valueGetter: params => params.data.full ? 'Yes' : 'No'},
        {headerName: 'Burnt', valueGetter: params => params.data.burnt ? 'Yes' : 'No'},
        {headerName: 'Maintenance', valueGetter: params => {
            if (params.data.repair && params.data.missing)
                return 'Needs Repair, Missing';
            else if (params.data.repair)
                return 'Needs Repair';
            else if (params.data.missing)
                return 'Missing';
            return 'None';
        }},
    ];

    return (
        <div className="col">
        {error && <ErrorAlert message={error.message}/>}
        <section className="metric">
            <div className="hero__content">
                <div className="table-wrapper">
                    <div className="table-header-wrapper">
                        <h4 className="table-header">Current Load</h4>
                    </div>
                    <div className="row">
                        {<Table columns={columns} data={data}/>}
                    </div>
                </div>
            </div>
        </section>
    </div>);
}

// Need to sort by siding then type.
/*
[
    {
        "locoID": 3,
        "locoName": "Loco 3",
        "sidingID": 1,
        "sidingName": "Mossman Line1",
        "type": "DROPPED_OFF",
        "count": 4
    }
]
 */
const LocoSidingBreakdown = ({id}) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getSidingBreakdown(id)
            .then(data => {
                setData(data);
                setError(null);
            })
            .catch(err => {
                setError(err);
            });
    });


    const columns = [
        {headerName: "Siding", field: "sidingName"},
        {
            headerName: "Type",
            field: "type",
            valueFormatter: params => {
                if (params.value === 'DROPPED_OFF') {
                    return 'Dropped Off';
                } else {
                    return 'Collected';
                }
            }
        },
        {headerName: 'Bins', field: 'count'}
    ];

    return (<div className="col">
        {error && <ErrorAlert message={error.message}/>}
        <section className="metric">
            <div className="hero__content">
                <div className="table-wrapper">
                    <div className="table-header-wrapper">
                        <h4 className="table-header">Siding Breakdown</h4>
                    </div>
                    <div className="row">
                        {<Table columns={columns} data={data}/>}
                    </div>
                </div>
            </div>
        </section>
    </div>);
}