import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Search, List } from "../components/Search";
import { ErrorAlert } from "../components/Alerts";
import LoadingSpinner from "../components/LoadingSpinner";

import { getAllLocos, getLoco } from "../api/locos";
import { LocoBins } from "../components/LocoTable";
import { LocoMetrics } from "../components/Metric";

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
              <LocoListWithSearch locoData={changeState} />
            </div>
          </div>
          <div className="col-sm-9">
            {/* Ensuring loco info is rendered if id is provided */}
            {id ? <LocoDetails id={id} /> : null}
          </div>
        </div>
      </div>
    </main>
  );
}

//Displays data of a single loco
const LocoDetails = ({ id }) => {
  const [locoData, setLocoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoco = async () => {
      try {
        const data = await getLoco(id);
        setLocoData(data);
        setError(null);
      } catch (err) {
        setError(err);
        setLocoData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLoco();
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
                  <h1 className="table-header">{locoData.name}</h1>
                  <div className="table-bin-count-wrapper">
                    <h1 className="bin-count-header">Bins:</h1>
                    <h1 className="bin-count-number">{`${locoData.data.full.length + locoData.data.empty.length}`}</h1>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <h3>Group Totals</h3>
              <LocoMetrics bins={locoData.data} />
            </div>
            <hr />
            <div className="row">
              <LocoBins data={locoData.data.bins} text={"Loco Bins"} />
            </div>
            <br />
            <hr />
          </div>
          <br />
        </section>
      )}
    </>
  )
}

{/* Search Bar
    get the list of items from the database  
    map that list of items to the list group buttons 
    make the id of the button the name from the database
    then the onClick event is what will send that id 
    to fetch the details of specific item from the database
    and then populate the datatable 
*/}
const LocoListWithSearch = ({ locoData }) => {
  const [locos, setLocos] = useState([]);
  const [allLocos, setAllLocos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState('');

  const fetchLocos = async () => {
    try {
      const data = await getAllLocos();
      setAllLocos(data);
      setLocos(data);
    } catch (err) {
      setError(err);
      setLocos(null);
      setAllLocos(null)
    } finally {
      setLoading(false);
    }
  };

  const updateSearch = (loco) => {
    locoData(loco);
  };

  const updateKeyword = (keyword) => {
    const filtered = allLocos.filter((loco) =>
      loco.name.toLowerCase().includes(keyword.toLowerCase())
    );
    setKeyword(keyword);
    setLocos(filtered);
  };

  useEffect(() => {
    fetchLocos();
  }, []);


  return (
    <section className="search">
      <div className="search-wrapper">
        <div className="search-header-wrapper">
          <h2 className="search-header">Locos</h2>
          <hr></hr>
        </div>
        {/* Search Bar Form */}
        <div className="search-bar-wrapper">
          <Search keyword={keyword} onChange={updateKeyword} />

          {/* Loading component */}
          {loading && <LoadingSpinner />}

          {/* Error Component */}
          {error && <ErrorAlert message={error.message} />}

          {/* Locos List */}
          {!loading && !error && (<List data={locos} onClick={updateSearch} loading={loading} />)}
        </div>
      </div>
    </section>
  );
};
