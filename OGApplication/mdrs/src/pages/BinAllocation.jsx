import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css'; // Optional theme CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import LoadingSpinner from "../components/LoadingSpinner";
import Table from "../components/Table";
import { NoEditItemList } from "../components/ItemList";
import {useLocation, useNavigate} from 'react-router-dom';
import {ErrorAlert} from "../components/Alerts";

import {
  createBin,
  deleteBin,
  getAllBins,
  getSidingBreakdown,
} from "../api/bins";





export default function BinAllocation() {
    const navigate = useNavigate();
    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [searchResult, setSearchResult] = useState([]);

    const changeState = (bin) => {
        setLoading(true);
        setSearchResult(bin);
        navigate(`?id=${bin.id}`);
        setLoading(false);
    };

    return (
        <main>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="container-fluid">
                            <NoEditItemList onItemSelected={changeState} itemName={'Bin'}
                                      getAllItemApi={getAllBins} createItemApi={createBin}
                                      deleteItemApi={deleteBin}/>
                        </div>
                    </div>
                    <div className="col-sm-9">
                        {loading && <LoadingSpinner/>}
                        {error && <ErrorAlert message={error.message}/>}
                        {!loading && !error && (
                            <section className="data-table">
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="table-wrapper">
                                            <div className="table-header-wrapper">
                                                <h1 className="table-header">Bin: {id ? id: "Select Bin"}</h1>
                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div className="row">
                                        <div className="col">
                                            <div className="row">
                                                <BinSidingBreakdown id={id}/>
                                            </div>
                                        </div>
                                    </div>
                                    <hr/>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

const BinSidingBreakdown = ({id}) => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getSidingBreakdown(id)
            .then((data) => {
              setData(data);
              setError(null);
            })
            .catch(err => {
                setError(err);
            });
    });


    const columns = [
        {headerName: "Siding", field: "sidingName"},
        {headerName: "Event", field: "type"}
    ];

    return (
        <div className="col">
            <section className="metric">
                <div className="hero__content">
                    <div className="table-wrapper">
                        <div className="table-header-wrapper">
                            <h4 className="table-header">Bin History</h4>
                        </div>
                        <div className="row">
                            {data ? <Table columns={columns} data={data}/> : null}
                        </div>
                    </div>
                </div>
            </section>
        </div>);
}