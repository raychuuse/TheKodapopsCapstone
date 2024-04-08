import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';
import LoadingSpinner from "./LoadingSpinner";
import { ErrorAlert } from "./Alerts";
import { getHarvesterBreakdown } from "../api/sidings";

import { useLocation, useNavigate } from 'react-router-dom';

const Header = ({ title }) => (
    <div className="table-wrapper">
        <div className="table-header-wrapper">
            <h3 className="table-header">{title}</h3>
        </div>
    </div>
);

const Table = ({ columns, data, type }) => {
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
            filter: true,
            floatingFilter: true,
            suppressMenu: true,
            filterParams: { buttons: ['reset'], }
        };
      }, []);

    return (
        <div className="row">
            <div style={containerStyle}>
                <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                    <div style={{ overflow: 'hidden', flexGrow: '1' }}>
                        <div style={gridStyle} className="ag-theme-balham">
                            <AgGridReact
                                ref={gridRef}
                                columnDefs={columns}
                                defaultColDef={defaultColDef}
                                rowData={data}
                                onRowClicked={(row) => navigate(`/${type}?id=${row.data.id}`)}
                                domLayout={'autoHeight'}
                                onGridReady={onGridReady}
                            ></AgGridReact>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


/*
export const SidingBreakdown = ({ id }) => {
    const [breakdownData, setBreakdownData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBreakdown = async () => {
            try {
                const data = await getHarvesterBreakdown(id);
                setBreakdownData(data);
            } catch (err) {
                setError(err);
                setBreakdownData([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBreakdown();
    }, [id]);

    const columns = [
        { headerName: "ID", field: "id", hide:true },
        { headerName: "Name", field: "name", minWidth: 100, maxWidth: 300},
        { headerName: "Full", field: "full", minWidth: 70, maxWidth: 100},
        { headerName: "Empty", field: "empty",minWidth: 70, maxWidth: 100  },
        // { headerName: "On Route", field: "route" },
        { headerName: "Total", field: "total", minWidth: 70, maxWidth: 100  },
    ];

    return (
        <>
            {loading && <LoadingSpinner />}
            {error && <ErrorAlert message={error.message} />}
            {!loading && !error && (
                <div className="row">
                    <Header title="Harvester Breakdown" />
                    <Table columns={columns} data={breakdownData} type="harvester" />
                </div>
            )}
        </>
    );
};
*/

export const HarvesterBreakdown = ({ id }) => {
    const [breakdownData, setBreakdownData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBreakdown = async () => {
            try {
                const data = await getHarvesterBreakdown(id);
                setBreakdownData(data);
            } catch (err) {
                setError(err);
                setBreakdownData(null);
            } finally {
                setLoading(false);
            }
        };
        fetchBreakdown();
    }, [id]);

    const columns = [
        { headerName: "ID", field: "id" , hide:true},
        { headerName: "Name", field: "name", minWidth: 100, maxWidth: 300},
        { headerName: "Full", field: "full", minWidth: 70, maxWidth: 100},
        { headerName: "Empty", field: "empty",minWidth: 70, maxWidth: 100  },
        // { headerName: "On Route", field: "route" },
        { headerName: "Total", field: "total", minWidth: 70, maxWidth: 100  },
    ];

    return (
        <>
            {loading && <LoadingSpinner />}
            {error && <ErrorAlert message={error.message} />}
            {!loading && !error && (
                <div className="row">
                    <Header title="Siding Breakdown" />
                    <Table columns={columns} data={breakdownData} type="siding" />
                </div>
            )}
        </>
    );
};