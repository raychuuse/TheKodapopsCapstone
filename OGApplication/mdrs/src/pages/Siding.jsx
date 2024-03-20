import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';


import {
    createSiding,
    deleteSiding,
    getAllSidings,
    getHarvesterBreakdown,
    getLocoBreakdown,
    getSiding,
    getSidingBreakdown,
    updateSiding
} from "../api/sidings";

import {calculateDifference} from "../utils"

import {List, Search} from "../components/Search";
import {ErrorAlert, SuccessAlert} from "../components/Alerts";
import LoadingSpinner from "../components/LoadingSpinner";

import Table from "../components/Table";
import {Input} from "reactstrap";


export default function Siding() {
    const navigate = useNavigate();
    const search = useLocation().search;
    const id = new URLSearchParams(search).get("id");

    const [searchResult, setSearchResult] = useState([]);

    const changeState = (siding) => {
        setSearchResult(siding);
        navigate(`?id=${siding}`);
    };

    return (<main>
        <div className="container-fluid">
            <div className="row">
                <div className="col-sm-3">
                    <div className="container-fluid">
                        <SidingListWithSearch sidingData={changeState}/>
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

{/* Search Bar
    get the list of items from the database
    map that list of items to the list group buttons
    make the id of the button the name from the database
    then the onClick event is what will send that id
    to fetch the details of specific item from the database
    and then populate the datatable
*/
}
const SidingListWithSearch = ({sidingData}) => {
    const navigate = useNavigate();
    const [sidings, setSidings] = useState([]);
    const [allSidings, setAllSidings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [state, setState] = useState('CREATE')
    const [formInput, setFormInput] = useState('');
    const [formTitle, setFormTitle] = useState('Create New Siding');
    const [formButtonText, setFormButtonText] = useState('Create Siding');
    const [formButtonStyle, setFormButtonStyle] = useState('btn-primary')
    const [formSelectedId, setFormSelectedId] = useState(-1);

    useEffect(() => {
        fetchSidings()
    }, []);

    const fetchSidings = () => {
        getAllSidings()
            .then(data => {
                setAllSidings(data)
                setSidings(data)
                setLoading(false)
            })
            .catch(err => {
                setError(err)
                setSidings(null)
                setAllSidings(null)
                setLoading(false)
            });
        setFormInput('');
        setState('CREATE');
    };

    const updateSearch = (siding) => {
        sidingData(siding)
    }

    const updateKeyword = (keyword) => {
        const filtered = allSidings.filter((siding) => siding.name.toLowerCase().includes(keyword.toLowerCase()));
        setKeyword(keyword);
        setSidings(filtered);
    };

    const onEditSiding = (sidingId) => {
        for (const siding of sidings) {
            if (siding.id === sidingId) {
                setState('EDIT');
                setFormTitle("Update Siding's Name");
                setFormInput(siding.name);
                setFormButtonText("Update Siding");
                setFormButtonStyle('btn-primary');
                setFormSelectedId(sidingId);
            }
        }
    }

    const onDeleteSiding = (sidingId) => {
        for (const siding of sidings) {
            if (sidingId === siding.id) {
                setState('DELETE');
                setFormTitle("Delete Siding");
                setFormInput(siding.name);
                setFormButtonText("Confirm Delete");
                setFormButtonStyle('btn-danger');
                setFormSelectedId(sidingId);
            }
        }
    }

    const updateSidingName = (event) => {
        setFormInput(event.target.value);
    };

    const setStateCreate = () => {
        setState('CREATE');
        setFormTitle('Create New Siding');
        setFormButtonText("Create Siding");
        setFormInput('');
        setFormButtonStyle('btn-primary');
    }

    const onFormButtonClick = () => {
        if ((state === 'CREATE' || state === 'EDIT') && formInput === '') {
            setError({message: "Please enter a name to submit"})
            return;
        }
        setError(null);

        if (state === 'CREATE') {
            createSiding(formInput).then(response => {
                fetchSidings();
                setSuccess({message: 'Siding Successfully Created'});
                setInterval(() => setSuccess(null), 2500);
                setStateCreate();
            }).catch(err => {
                console.error(err);
                setError(err);
            });
        } else if (state === 'EDIT') {
            updateSiding(formSelectedId, formInput).then(result => {
                fetchSidings();
                setSuccess({message: 'Siding Successfully Updated'});
                setInterval(() => setSuccess(null), 2500);
                navigate(`?id=${formSelectedId}`);
                setStateCreate();
            }).catch(error => {
                setError(error);
            });
        } else {
            deleteSiding(formSelectedId).then(result => {
                fetchSidings();
                setSuccess({message: 'Siding Successfully Deleted'});
                setInterval(() => setSuccess(null), 2500);
                setStateCreate();
                navigate('/siding')
            }).catch(error => {
                setError(error);
            });
        }
    };

    return (<section className="search">
        <div className="search-wrapper">
            <div className="search-header-wrapper">
                <h2 className="search-header">
                    Sidings
                </h2>
                <hr></hr>
            </div>
            {/* Search Bar Form */}
            <div className="search-bar-wrapper">
                <Search keyword={keyword} onChange={updateKeyword}/>

                {/* Loading component */}
                {loading && <LoadingSpinner/>}

                {/* Error Component */}
                {error && <ErrorAlert message={error.message}/>}

                {success && <SuccessAlert message={success.message}/>}

                {/* sidings List */}
                {!loading && !error && (
                    <List data={sidings} onClick={updateSearch} onEdit={onEditSiding} onDelete={onDeleteSiding}
                          loading={loading}/>)}

            </div>
            <button style={{display: state === 'CREATE' ? 'none' : 'block'}}
                    className={`w-100 btn-md btn btn-primary mt-1`} onClick={setStateCreate}>Create Siding
            </button>
            <hr/>
            <div>
                <h3>{formTitle}</h3>
                <Input type='text' value={formInput} onChange={updateSidingName}
                       classname={'list-group-item'}></Input>
                <button style={{marginTop: '1rem'}} className={`w-100 btn-md btn ${formButtonStyle}`}
                        onClick={onFormButtonClick}>{formButtonText}</button>
            </div>
        </div>
    </section>)
}

//Displays data of a single siding
const SidingDetails = ({id}) => {
    const [sidingData, setSidingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getSiding(id)
            .then(data => {
                setSidingData(data);
                setError(null);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setSidingData(null);
                setLoading(false);
            })
    });

    return (<>
        {loading && <LoadingSpinner/>}
        {error && <ErrorAlert message={error.message}/>}
        {!loading && !error && (<section className="data-table">
            <div className="container-fluid">
                <div className="row">
                    <div className="table-wrapper">
                        <div className="table-header-wrapper">
                            <h1 className="table-header">{sidingData.name}</h1>
                            <div className="table-bin-count-wrapper">
                                <h1 className="bin-count-header">Bins:</h1>
                                {/*<h1 className="bin-count-number">{`${sidingData.data.full.length + sidingData.data.empty.length}`}</h1>*/}
                            </div>
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
    });


    const columns = [
        {headerName: "Bin", field: "binCode"},
        {headerName: "Status", field: "status"},
        {
            headerName: 'Stale For',
            valueGetter: rowParams => calculateDifference(new Date(), new Date(rowParams.data.transactionTime))
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
    });

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
    });


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