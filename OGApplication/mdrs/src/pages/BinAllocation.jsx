import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css'; // Optional theme CSS
import 'bootstrap/dist/css/bootstrap.min.css';

import LoadingSpinner from "../components/LoadingSpinner";
import Table from "../components/Table";
import ItemList  from "../components/ItemList";
import {useLocation, useNavigate} from 'react-router-dom';
import {ErrorAlert} from "../components/Alerts";

import {
    createBin,
    deleteBin, editBin,
    getAllBins, getBin,
    getSidingBreakdown, moveBin,
} from "../api/bins";
import {FormGroup, Input, Label} from "reactstrap";
import {getById} from "../api/users";
import {getAllSidings} from "../api/sidings";





export default function BinAllocation() {
    const navigate = useNavigate();
    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");

    const [searchResult, setSearchResult] = useState([]);

    const changeState = (bin) => {
        setSearchResult(bin);
        navigate(`?id=${bin.id}`);
    };

    return (
        <main>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-3">
                        <div className="container-fluid">
                            <ItemList onItemSelected={changeState} itemName={'Bin'}
                                      getAllItemApi={getAllBins} createItemApi={createBin} updateItemApi={editBin}
                                      deleteItemApi={deleteBin}/>
                        </div>
                    </div>
                    <div className="col-sm-9">
                        {id != null ? <BinPage id={id} /> : null}
                    </div>
                </div>
            </div>
        </main>
    );
}

const BinPage = ({id}) => {
    const [error, setError] = useState(null);
    const [sidings, setSidings] = useState([]);
    const [selectedSiding, setSelectedSiding] = useState();
    const [bin, setBin] = useState();

    useEffect(() => {
        console.info('jjj');
        getBin(id)
            .then(response => {
                setBin(response);
                getSidings();
                setSelectedSiding(response.sidingID != null ? response.sidingID : 0);
            })
            .catch(err => {
                setError(err);
            });
    }, [id]);

    const getSidings = () => {
        getAllSidings()
            .then(response => {
                setSidings(response);
            })
            .catch(err => {
                setError(err);
            });
    };

    const onSidingChanged = (newSiding) => {
        if (bin == null || sidings == null) return;
        moveBin(id, newSiding);
        setSelectedSiding(newSiding);
    };


    return (
        <div>
            {error && <ErrorAlert message={error.message} />}
            <section className="data-table">
                <div className="container-fluid">
                    <div className="row">
                        <div className="table-wrapper">
                            <div className="table-header-wrapper">
                                <h1 className="table-header">Bin: {bin != null ? bin.code : "Select Bin"}</h1>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col">
                            <FormGroup>
                                <Label for="siding">Move bin to Siding</Label>
                                <Input
                                    type="select"
                                    id="siding"
                                    value={selectedSiding}
                                    onChange={(e) => onSidingChanged(e.target.value)}
                                >
                                    <option value="0">Not At Siding</option>
                                    {sidings.map(s => (
                                        <option key={s.sidingID} value={s.sidingID}>
                                            {s.sidingName}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="row">
                                <BinSidingBreakdown id={id} />
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            </section>
        </div>
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
    }, [id]);


    const columns = [
        {headerName: "Siding", field: "sidingName"},
        {headerName: "Event", field: "type"}
    ];

    return (
        <div className="col">
            {error && <ErrorAlert message={error.message}/>}
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