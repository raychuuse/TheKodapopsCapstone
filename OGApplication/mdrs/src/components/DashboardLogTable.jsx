import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";

import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-balham.css'; // Optional theme CSS

import 'bootstrap/dist/css/bootstrap.min.css';

import { ErrorAlert } from "./Alerts";
import LoadingSpinner from "./LoadingSpinner";

import { getAllTransactions } from "../api/transaction";
import { getAllBins } from "../api/bins";

import { useLocation, useNavigate } from 'react-router-dom';

const Header = ({ title }) => (
    <div className="table-wrapper">
        <div className="table-header-wrapper">
            <h4 className="table-header">{title}</h4>
        </div>
    </div>
);

const Table = ({ data, link, columns }) => {
    const navigate = useNavigate();
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
                                onRowClicked={(row) => navigate(`${link}`)}
                                domLayout={'autoHeight'}
                                onGridReady={onGridReady}
                                paginationPageSize={20}
                                pagination={true}
                            ></AgGridReact>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



const DashboardCard = ({ title, data, link, columns }) => {
    return (
        <div className="col">
            <div className="card">
                <h5 className="card-header" >{title}</h5>
                <div className="card-body">
                    <div className="col">
                        {/* <div>
                            <Header title={`${title} Table`} />
                        </div> */}
                        <div className="row">
                            {data ? <Table data={data} link={link} columns={columns}/> : null}
                        </div>
                    </div>
                    <a href={link} className="btn btn-primary">view page</a>
                </div>
            </div>
        </div>
    );
};

export const toFull = (integer) => {
    if (integer == 1) {
        return "Full";
    }
    else if (integer == 0) {
        return "Empty";
    }
    return null;
}


export const DashboardLogTables = () => {
    const [{ bins, transactions, error }, setState] = useState({
        bins: [],
        transactions: [],
        error: null,
    });

    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const transactionData = await getAllTransactions();
            const binData = await getAllBins();
            const temp = binData.map(bins => ({
                binID: bins.binID,
                status: bins.status !== null ? bins.status : "NOT LISTED",
                sidingName: bins.sidingName,
                locoName: bins.locoName
            }))
            setState({ bins: temp, transactions: transactionData, error: null });
        } catch (err) {
            setState({ bins: null, transactions: null, error: err });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const transactionColumns = [
        { headerName: "Transaction", field: "transactionNumber", width: 90, sortable: true },
        { headerName: "Time", field: "transactionTime", width: 200, sortable: true },
        { headerName: "Bin ID", field: "binID", width: 100, filter: 'agNumberColumnFilter', sortable: true },
        { headerName: "Status", field: "status", sortable: true },
        { headerName: "Loco", field: "locoName", sortable: true },
        { headerName: "Harvester", field: "harvesterName", sortable: true },
        { headerName: "Siding", field: "sidingName", sortable: true },
    ]

    const binColumns = [
        { headerName: "Bin ID", field: "binID"},        
        { headerName: "Status", field: "status", sortable: true },          
        { headerName: "Loco", field: "locoName",  minWidth: 100, maxWidth: 300 },
        { headerName: "Siding", field: "sidingName",  minWidth: 100, maxWidth: 300 },/* 
        { headerName: "Harvester", field: "harvesterName",  minWidth: 100, maxWidth: 300 },*/
    ]

    return (
        <>
            {loading && <LoadingSpinner />}
            {error && <ErrorAlert message={error.message} />}
            {!loading && !error && (
                <div className="row">
                    <DashboardCard title="Bin Allocation" data={bins} link="/bins"  columns={binColumns}/>
                    <DashboardCard title="Transaction Log" data={transactions} link="/log" columns={transactionColumns}/>
                </div>
            )}
        </>
    );
};