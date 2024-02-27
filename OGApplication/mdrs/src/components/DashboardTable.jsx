import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";

import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css'; // Optional theme CSS

import 'bootstrap/dist/css/bootstrap.min.css';

import { ErrorAlert } from "./Alerts";
import LoadingSpinner from "./LoadingSpinner";

import { getDashboard } from "../api/dashboard";

import { useLocation, useNavigate } from 'react-router-dom';


//rough formatting for table
// export const DashboardTables = () => {
//     const [locos, setLocos] = useState([]);
//     const [sidings, setSidings] = useState([]);
//     const [harvesters, setHarvesters] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);


//     const fetchDashboard = async () => {
//         try {
//             const data = await getDashboard()
//             console.log(data.locos)
//             setLocos(data.locos)
//             setSidings(data.sidings)
//             setHarvesters(data.harvesters)

//         } catch (err) {
//             setError(err)
//             setLocos(null)
//             setSidings(null)
//             setHarvesters(null)
//         } finally {
//             setLoading(false)
//         }
//     };


//     useEffect(() => { fetchDashboard() }, []);

//     return (
//         <>
//             {loading && <p>Loading...</p>}
//             {error && <ErrorAlert message={error.message} />}
//             {!loading && !error && (
//                 <div className="row">
//                     <div className="col">
//                         <div className="card">
//                             <h5 class="card-header">Locos</h5>
//                             <div class="card-body">
//                                 <div className="col">
//                                     <div >
//                                         <Header title="Loco Table" />
//                                     </div>

//                                     <div className="row">
//                                         {locos ? <Table data={locos} type="locos" /> : null}

//                                     </div>
//                                 </div>
//                                 <a href="/loco" class="btn btn-primary">view loco page</a>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="col">
//                         <div className="card">
//                             <h5 class="card-header">Harvester</h5>
//                             <div class="card-body">
//                                 <div className="col">
//                                     <div >
//                                         <Header title="Harvester Table" />
//                                     </div>

//                                     <div className="row">
//                                         {harvesters ? <Table data={harvesters} type="harvester" /> : null}

//                                     </div>
//                                 </div>
//                                 <a href="/harvester" class="btn btn-primary">view harvester page</a>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="col">

//                         <div className="card">
//                             <h5 class="card-header">Sidings</h5>
//                             <div class="card-body">

//                                 <div className="col">
//                                     <div >
//                                         <Header title="Siding Table" />
//                                     </div>

//                                     <div className="row">
//                                         {sidings ? <Table data={sidings} type="siding" /> : null}

//                                     </div>
//                                 </div>
//                                 <a href="siding" class="btn btn-primary">view siding page</a>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )
//             }
//         </>

//     )
// }

const Header = ({ title }) => (
    <div className="table-wrapper">
        <div className="table-header-wrapper">
            <h4 className="table-header">{title}</h4>
        </div>
    </div>
);

const Table = ({ data, link }) => {
    const navigate = useNavigate();
    const columns = [
        { headerName: "ID", field: "id", hide: true },
        { headerName: "Name", field: "name",},
        { headerName: "Full", field: "full", maxWidth: 100 },
        { headerName: "Empty", field: "empty",  maxWidth: 100 },
        { headerName: "Mill", field: "mill", maxWidth: 100 }
    ]

    const gridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

    const onGridReady = useCallback((params) => {
        params.api.sizeColumnsToFit();
        window.addEventListener('resize', function () {
            setTimeout(function () {
                params.api.sizeColumnsToFit();
            });
        });

        gridRef.current.api.sizeColumnsToFit();
    }, []);

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 90,
            sortable: true,
            resizable: true,
        };
    }, []);

    return (
        <div className="table">
            <div style={containerStyle}>
                <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                    <div style={{ overflow: 'hidden', flexGrow: '1' }}>
                        <div style={gridStyle} className="ag-theme-balham">
                            <AgGridReact
                                ref={gridRef}
                                columnDefs={columns}
                                defaultColDef={defaultColDef}
                                rowData={data}
                                onRowClicked={(row) => navigate(`${link}?id=${row.data.id}`)}
                                domLayout={'autoHeight'}
                                onGridReady={onGridReady}
                            ></AgGridReact>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const DashboardCard = ({ title, data, link }) => {
    return (
        <div className="col">
            <div className="card">
                <h5 className="card-header">{title}</h5>
                <div className="card-body">
                    <div className="col">
                        <div className="row">
                            {data ? <Table data={data} link={link} /> : null}
                        </div>
                    </div>
                    <a href={link} className="btn btn-primary">view page</a>
                </div>
            </div>
        </div>
    );
};

export const DashboardTables = () => {
    const [{ locos, sidings, harvesters, error }, setState] = useState({
        locos: [],
        sidings: [],
        harvesters: [],
        error: null,
    });
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await getDashboard();
            setState({ locos: data.locos, sidings: data.sidings, harvesters: data.harvesters, error: null });
        } catch (err) {
            setState({ locos: null, sidings: null, harvesters: null, error: err });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <>
            {loading && <LoadingSpinner />}
            {error && <ErrorAlert message={error.message} />}
            {!loading && !error && (
                <div className="row">
                    <DashboardCard title="Locos" data={locos} link="/loco" />
                    <DashboardCard title="Harvester" data={harvesters} link="/harvester" />
                    <DashboardCard title="Sidings" data={sidings} link="/siding" />
                </div>
            )}
        </>
    );
};