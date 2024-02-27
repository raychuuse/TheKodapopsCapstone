import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";

import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed

import 'ag-grid-community/styles/ag-theme-balham.css'; // Optional theme CSS

import 'bootstrap/dist/css/bootstrap.min.css';

import { ErrorAlert } from "./Alerts";
import LoadingSpinner from "./LoadingSpinner";

import { getAllBins } from "../api/bins";


const Table = ({ data, columns }) => {
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

    const onFilterTextBoxChanged = useCallback(() => {
        gridRef.current.api.setQuickFilter(
            document.getElementById('filter-text-box').value
        );
    }, []);

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 150,
            filter: true,
            sortable: true,
            floatingFilter: true,
            suppressMenu: true,
            filterParams:{buttons: ['clear', 'reset'],}
        };
    }, []);

    return (
        <div className="table">
            <div className="row">
                <div className="search-bar-wrapper">
                    <div className="col-sm-2">
                        <div className="row">
                            < div className="search-bar d-flex" >
                                <input
                                    className="form-control me-2 searchbar"
                                    type='text'
                                    name="search"
                                    placeholder="Filter"
                                    id="filter-text-box"
                                    key="search-bar"
                                    onInput={onFilterTextBoxChanged}
                                />
                            </div >
                        </div>
                    </div>
                </div>
            </div>

            {/*Ensures Table is rendered when data is provided*/}
            {data ?
                <div className="row">
                    <div style={containerStyle}>
                        <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                            <div style={{ overflow: 'hidden', flexGrow: '1'}}>
                                <div style={gridStyle} className="ag-theme-alpine">
                                    <AgGridReact
                                        ref={gridRef}
                                        columnDefs={columns}
                                        defaultColDef={defaultColDef}
                                        rowData={data}
                                        cacheQuickFilter={true}
                                        pagination={true}
                                        paginationPageSize={20}
                                        domLayout={'autoHeight'}
                                        onGridReady={onGridReady}
                                    ></AgGridReact>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                : null
            }
        </div>
    )
}

export const BinAllocationTable = () => {
    const [{ bins, error }, setState] = useState({
        bins: [],
        error: null,
    });

    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const binData = await getAllBins();
            setState({ bins: binData, error: null });
        } catch (err) {
            setState({ bins: null, error: err });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    const columns = [
        { headerName: "Bin ID", field: "binsID", width: 90, maxWidth: 200, filter: 'agNumberColumnFilter', },
        { headerName: "Status", field: "status", filter: 'agTextColumnFilter', },
        { headerName: "Loco", field: "locoName", minWidth: 100, filter: 'agTextColumnFilter', },
        { headerName: "Harvester", field: "harvesterName", minWidth: 100, filter: 'agTextColumnFilter', },
        { headerName: "Siding", field: "sidingName", minWidth: 100, filter: 'agTextColumnFilter', },
    ]

    return (
        <>
            {loading && <LoadingSpinner />}
            {error && <ErrorAlert message={error.message} />}
            {!loading && !error && (
                <div className="row">
                    <Table data={bins} columns={columns} />
                </div>
            )}
        </>
    );
};
