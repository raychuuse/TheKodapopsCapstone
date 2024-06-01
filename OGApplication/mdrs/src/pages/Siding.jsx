import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';


import {
    createSiding,
    deleteSiding,
    getAllSidings,
    getHarvesterBreakdown,
    getLocoBreakdown,
    getSidingBreakdown,
    updateSiding
} from "../api/sidings";

import {calculateDifference} from "../utils"

import {List, Search} from "../components/Search";
import {ErrorAlert, SuccessAlert} from "../components/Alerts";
import LoadingSpinner from "../components/LoadingSpinner";

import Table from "../components/Table";
import {Input} from "reactstrap";
import ItemList from "../components/ItemList";


export default function Siding() {
    const navigate = useNavigate();
    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");

    const changeState = (siding) => {
        navigate(`?id=${siding}`);
    };

    return (<main>
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-3">
                    <div className="container-fluid">
                        <ItemList onItemSelected={changeState} itemName={'Siding'} getAllItemApi={getAllSidings}
                                  createItemApi={createSiding} updateItemApi={updateSiding}
                                  deleteItemApi={deleteSiding}/>
                    </div>
                </div>
                <div className="col-sm-9">
                    {/* Ensuring siding info is rendered if id is provided */}
                    {id ? <SidingDetails id={id}/> : null}
                </div>
            </div>
        </div>
    </main>);
}

//Displays data of a single siding
const SidingDetails = ({id}) => {
    const [error, setError] = useState(null);
    const [sidingData, setSidingData] = useState([]);


    useEffect(() => {
        getAllSidings(id)
            .then(data => {
                setSidingData(data);
                setError(null);
            })
            .catch(err => {
                setError(err);
                setSidingData(null);
            });
    });

    return (<>
        {error && <ErrorAlert message={error.message}/>}
        {!error && (<section className="data-table">
            <div className="container-fluid">
                <div className="row">
                    <div className="table-wrapper">
                        <div className="table-header-wrapper">
                            <h1 className="bin-count-header">Siding: {id && sidingData ? sidingData.find(i => i.sidingID == id)?.sidingName: "Select a Siding"}</h1>
                            {/*<h1 className="bin-count-number">{`${sidingData.data.full.length + sidingData.data.empty.length}`}</h1>*/}
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <h3>Group Totals</h3>
                    {/*<SidingMetrics bins={sidingData.data}/>*/}
                    <SidingBreakdown id={id}/>
                </div>
                <br/>
                <hr/>
                <div className="row">
                    <div className="col">
                        <div className="row">
                            <SidingHarvesterBreakdown id={id}></SidingHarvesterBreakdown>
                        </div>
                    </div>

                    <div className="col">
                        <div className="row">
                            <SidingLocoBreakdown id={id}/>
                        </div>
                    </div>
                </div>
                <hr/>
            </div>
        </section>)}
    </>)
}

/*
[
    {
        "binID": 1,
        "binCode": "1234",
        "status": "EMPTY" || "FULL",
        "sidingID": 1,
        "sidingName": "Mossman Line1",
        "transactionTime": "2023-05-29T05:46:45.000Z",
        "type": "DROPPED_OFF"
    }
]
 */
const SidingBreakdown = ({id}) => {
    const [data, setData] = useState([]);
    const [fullBins, setFullBins] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getSidingBreakdown(id)
            .then(data => {
                setData(data);
                setFullBins(data.reduce((sum, bin) => sum + (bin.status === 'FULL' ? 1 : 0), 0));
                setError(null);
            })
            .catch(err => {
                setError(err);
            });
    }, [id]);


    const columns = [
        {headerName: "Bin", field: "binID"},
        {headerName: "Status", field: "status"},
        {
            headerName: 'Stale For',
            valueGetter: rowParams => calculateDifference(new Date(), new Date(rowParams.data.time))
        }
    ];

    return (<div className="col">
        <section className="metric">
            <div className="hero__content">
                <div className="row">
                    <div className="col">
                        <h1 className="hero__title">Full Bins</h1>
                        <p className="hero__subtitle">{fullBins}</p>
                    </div>
                    <div className="col">
                        <h1 className="hero__title">Empty Bins</h1>
                        <p className="hero__subtitle">{data.length - fullBins}</p>
                    </div>
                </div>

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
};

// Displays data about harvesters that have used this siding and how many bins they've filled here.
/* Data format:
[
  {
    sidingID,
    sidingName,
    harvesterID,
    harvesterName,
    filledBins
  }
]
 */
const SidingHarvesterBreakdown = ({id}) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const columns = [{
        headerName: 'Siding', field: 'sidingName'
    }, {
        headerName: 'Harvester', field: 'harvesterName'
    }, {
        headerName: 'Filled Bins', field: 'filledBins'
    }];

    useEffect(() => {
        getHarvesterBreakdown(id)
            .then(data => {
                setData(data);
                setError(undefined);
            })
            .catch(err => {
                setError(err);
            })
    }, [id]);

    return (<div className="col">
        <section className="metric">
            <div className="hero__content">
                <div className="table-wrapper">
                    <div className="table-header-wrapper">
                        <h4 className="table-header">Harvester Breakdown</h4>
                    </div>
                    <div className="row">
                        {data && columns ? <Table columns={columns} data={data}/> : null}
                    </div>
                </div>
            </div>
        </section>

    </div>);
}

/*
[
    {
        "sidingID": 3,
        "sidingName": "Mossman Line3",
        "locoID": 1,
        "locoName": "Loco 1",
        "pickedUpBins": 2
    }
]
 */
const SidingLocoBreakdown = ({id}) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getLocoBreakdown(id)
            .then(data => {
                setData(data);
                setError(null);
            })
            .catch(err => {
                setError(err);
            });
    }, [id]);


    const columns = [
        {headerName: "Loco", field: "locoName"},
        {headerName: "Collected Bins", field: "pickedUpBins"}
    ];

    return (<div className="col">
        <section className="metric">
            <div className="hero__content">
                <div className="table-wrapper">
                    <div className="table-header-wrapper">
                        <h4 className="table-header">Loco Breakdown</h4>
                    </div>
                    <div className="row">
                        {data ? <Table columns={columns} data={data}/> : null}
                    </div>
                </div>
            </div>
        </section>

    </div>);
}