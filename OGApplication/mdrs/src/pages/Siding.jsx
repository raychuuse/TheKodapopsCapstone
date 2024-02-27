import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';



import { getAllSidings, getSiding} from "../api/sidings";

import { Search, List } from "../components/Search";
import { ErrorAlert } from "../components/Alerts";
import LoadingSpinner from "../components/LoadingSpinner";

import { SidingMetrics } from "../components/Metric";
import { SidingBreakdown } from "../components/Breakdown";
import Table from "../components/Table";


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
              <SidingListWithSearch sidingData={changeState} />
            </div>
          </div>
          <div className="col-sm-9">
            {/* Ensuring siding info is rendered if id is provided */}
            {id ? <SidingDetails id={id} /> : null}
          </div>
        </div>
      </div>
    </main>
  );
}

//Displays data of a single siding
const SidingDetails = ({ id }) => {
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
      {loading && <LoadingSpinner />}
      {error && <ErrorAlert message={error.message} />}
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
            <hr />
            <div className="row">
              <h3>Group Totals</h3>
              <SidingMetrics bins={sidingData.data} />
            </div>
            <br />
            <hr />
            <div className="row">
              <div className="col">
                <div className="row">
                  <SidingBins data={sidingData.data.bins} text={"Siding Bins"} />
                </div>
              </div>

              <div className="col">
                <div className="row">
                  <SidingBreakdown id={id} />
                </div>
              </div>
            </div>
            <hr />
          </div>
        </section>
      )}
    </>
  )
}

const SidingBins = ({ text, data }) => {
  const columns = [
    { headerName: "Bin ID", field: "binsID" },
    { headerName: "Status", field: "status" },
    { headerName: "Harvester Group", field: "harvesterName" },
    { headerName: "Loco", field: "locoName" },
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
              {data ? <Table columns={columns} data={data} /> : null}
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
*/}
const SidingListWithSearch = ({ sidingData }) => {
  const [sidings, setSidings] = useState([]);
  const [allSidings, setAllSidings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');

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

  useEffect(() => { fetchSidings() }, []);

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
          <Search keyword={keyword} onChange={updateKeyword} />

          {/* Loading component */}
          {loading && <LoadingSpinner />}

          {/* Error Component */}
          {error && <ErrorAlert message={error.message} />}

          {/* sidings List */}
          {!loading && !error && ( <List data={sidings} onClick={updateSearch} loading={loading} />)}
         
        </div>
      </div>
    </section>
  )
}

