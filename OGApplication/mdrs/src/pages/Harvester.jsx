import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css'; // Optional theme CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// Import apis for http requests and data loading
import {
    createHarvester,
    deleteHarvester,
    getAllHarvesters,
    getHarvester,
    getSidingBreakdown,
    updateHarvester
} from "../api/harvesters";

import {List, Search} from "../components/Search";
import {ErrorAlert} from "../components/Alerts";
import LoadingSpinner from "../components/LoadingSpinner";
import Table from "../components/Table";
import ItemList from "../components/ItemList";

export default function Harvester() {
    const navigate = useNavigate();
    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");

    const [searchResult, setSearchResult] = useState([]);

    const changeState = (harvester) => {
        setSearchResult(harvester);
        navigate(`?id=${harvester.id}`);
    };

    return (
        <main>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="container-fluid">
                            <ItemList onItemSelected={changeState} itemName={'Harvester'}
                                      getAllItemApi={getAllHarvesters} createItemApi={createHarvester}
                                      updateItemApi={updateHarvester} deleteItemApi={deleteHarvester}/>
                        </div>
                    </div>
                    <div className="col-sm-9">
                        {/* Ensuring harvester info is rendered if id is provided */}
                        {id ? <HarvesterDetails id={id}/> : null}
                    </div>
                </div>
            </div>
        </main>
    );
}

const HarvesterDetails = ({id}) => {
    const [error, setError] = useState(null);
    const [harrData, setHarrData] = useState([]);

    useEffect(() => {
        getAllHarvesters(id)
            .then(data => {
                setHarrData(data);
                setError(null);
            })
            .catch(err => {
                setError(err);
                setHarrData(null);
            });
    });

    return (
        <>
            {error && <ErrorAlert message={error.message}/>}
            <section className="data-table">
                <div className="container-fluid">
                    <div className="row">
                        <div className="table-wrapper">
                            <div className="table-header-wrapper">
                                <h1 className="bin-count-header"> Harvester: {id && harrData ? harrData.find(i => i.harvesterID == id)?.harvesterName: "Select a Harvester"}</h1>
                                {/*<h1 className="bin-count-number">{`${harvesterData.data.full.length + harvesterData.data.empty.length}`}</h1>*/}
                            </div>
                        </div>
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col">
                            <div className="row">
                                <HarvesterSidingBreakdown id={id}/>
                            </div>
                        </div>
                    </div>
                    <hr/>
                </div>
            </section>
        </>
    )
}

/*
[
    {
        "harvesterID": 2,
        "harvesterName": "Harvester2",
        "sidingID": 9,
        "sidingName": "Mossman Line9",
        "binsFilled": 10
    }
]
 */
const HarvesterSidingBreakdown = ({id}) => {
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
    }, [id]);


    const columns = [
        {headerName: "Siding", field: "sidingName"},
        {headerName: "Bins Filled", field: "binsFilled"},
    ];

    return (
        <div className="col">
            <section className="metric">
                <div className="hero__content">
                    <div className="table-wrapper">
                        <div className="table-header-wrapper">
                            <h4 className="table-header">Siding Breakdown</h4>
                        </div>
                        <div className="row">
                            {data ? <Table columns={columns} data={data}/> : null}
                        </div>
                    </div>
                </div>
            </section>
        </div>);
}