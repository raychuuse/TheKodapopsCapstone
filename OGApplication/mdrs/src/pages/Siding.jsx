import React, {useEffect, useState, useCallback, useMemo, useRef} from "react";
import {useLocation, useNavigate} from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';


import {getAllSidings, getSiding, createSiding, updateSiding, deleteSiding} from "../api/sidings";

import {Search, List} from "../components/Search";
import {ErrorAlert, SuccessAlert} from "../components/Alerts";
import LoadingSpinner from "../components/LoadingSpinner";

import {SidingMetrics} from "../components/Metric";
import {SidingBreakdown} from "../components/Breakdown";
import Table from "../components/Table";
import {Button, Input} from "reactstrap";


export default function Siding() {
  const navigate = useNavigate();
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");

  const [searchResult, setSearchResult] = useState([]);

  const changeState = (siding) => {
    setSearchResult(siding);
    navigate(`?id=${siding}`);
  };

  return (
      <main>
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
      </main>
  );
}

//Displays data of a single siding
const SidingDetails = ({id}) => {
  const [sidingData, setSidingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSiding = async () => {
      try {
        const data = await getSiding(id);
        setSidingData(data);
        setError(null);
      } catch (err) {
        // console.log(err, "error found")
        setError(err);
        setSidingData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSiding();
  }, [id]);

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
                      <h1 className="table-header">{sidingData.name}</h1>
                      <div className="table-bin-count-wrapper">
                        <h1 className="bin-count-header">Bins:</h1>
                        <h1 className="bin-count-number">{`${sidingData.data.full.length + sidingData.data.empty.length}`}</h1>
                      </div>
                    </div>
                  </div>
                </div>
                <hr/>
                <div className="row">
                  <h3>Group Totals</h3>
                  <SidingMetrics bins={sidingData.data}/>
                </div>
                <br/>
                <hr/>
                <div className="row">
                  <div className="col">
                    <div className="row">
                      <SidingBins data={sidingData.data.bins} text={"Siding Bins"}/>
                    </div>
                  </div>

                  <div className="col">
                    <div className="row">
                      <SidingBreakdown id={id}/>
                    </div>
                  </div>
                </div>
                <hr/>
              </div>
            </section>
        )}
      </>
  )
}

const SidingBins = ({text, data}) => {
  const columns = [
    {headerName: "Bin ID", field: "binsID"},
    {headerName: "Status", field: "status"},
    {headerName: "Harvester Group", field: "harvesterName"},
    {headerName: "Loco", field: "locoName"},
    // { headerName: "Siding", field: "sidingName" },
  ]
  return (
      <div className="col">
        <section className="metric">
          <div className="hero__content">
            <div className="table-wrapper">
              <div className="table-header-wrapper">
                <h4 className="table-header">{text}</h4>
              </div>
              <div className="row">
                {data ? <Table columns={columns} data={data}/> : null}
              </div>
            </div>
          </div>
        </section>

      </div>
  );
};


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

  const fetchSidings = async () => {
    try {
      const data = await getAllSidings()
      setAllSidings(data)
      setSidings(data)
    } catch (err) {
      setError(err)
      setSidings(null)
      setAllSidings(null)
    } finally {
      setLoading(false)
    }
    setFormInput('');
    setState('CREATE');
  };

  const updateSearch = (siding) => {
    sidingData(siding)
  }

  const updateKeyword = (keyword) => {
    const filtered = allSidings.filter((siding) =>
        siding.name.toLowerCase().includes(keyword.toLowerCase())
    );
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


  return (
      <section className="search">
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

            {success && <SuccessAlert message={success.message} />}

            {/* sidings List */}
            {!loading && !error && (<List data={sidings} onClick={updateSearch} onEdit={onEditSiding} onDelete={onDeleteSiding} loading={loading}/>)}

          </div>
          <button style={{display: state === 'CREATE' ? 'none' : 'block'}} className={`w-100 btn-md btn btn-primary mt-1`} onClick={setStateCreate}>Create Siding</button>
          <hr/>
          <div>
            <h3>{formTitle}</h3>
            <Input type='text' value={formInput} onChange={updateSidingName} classname={'list-group-item'}></Input>
            <button style={{marginTop: '1rem'}} className={`w-100 btn-md btn ${formButtonStyle}`} onClick={onFormButtonClick}>{formButtonText}</button>
          </div>
        </div>
      </section>
  )
}

