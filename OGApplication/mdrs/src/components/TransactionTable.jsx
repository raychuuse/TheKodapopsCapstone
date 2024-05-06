import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";

import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css'; // Optional theme CSS

import 'bootstrap/dist/css/bootstrap.min.css';

import { ErrorAlert } from "./Alerts";
import LoadingSpinner from "./LoadingSpinner";

import { getAllTransactions} from "../api/transaction";

export const TransactionTable = () => {
    const [{ transactions, error }, setState] = useState({
        transactions: [],
        error: null,
    });

    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const data = await getAllTransactions();
            setState({ transactions: data, error: null });
        } catch (err) {
            setState({ transactions: null, error: err });
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
                    <Table data={transactions} />
                </div>
            )}
        </>
    );
};

const Table = ({ data }) => {
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

    const filterParams = {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
            const dateAsString = cellValue;
            if (dateAsString == null) {
                return 0;
            }

            // Dates are stored as dd/mm/yyy
            // Date object for comparison against the filter date
            const dateParts = dateAsString.split('/');
            const year = Number(dateParts[2]);
            const month = Number(dateParts[1]) - 1;
            const day = Number(dateParts[0]);
            const cellDate = new Date(year, month, day);

            // Compare Date objects 
            if (cellDate < filterLocalDateAtMidnight) {
                return -1;
            } else if (cellDate > filterLocalDateAtMidnight) {
                return 1;
            }
            return 0;
        },
        minValidYear: 2000,
        // max valid year commented out for now
        // maxValidYear: 2023,
        inRangeFloatingFilterDateFormat: 'Do MMM YYYY',
    };

    const columns = [
        {
            headerName: "Transaction",
            field: "transactionNumber",
            maxWidth: 150,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: "Date",
            field: "date",
            maxWidth: 200,
            filter: 'agDateColumnFilter',
            filterParams: filterParams,
        },
        {
            headerName: "Time",
            field: "time",
            maxWidth: 150,
            filter: 'agTextColumnFilter',
        },
        {
            headerName: "binID",
            field: "binID",
            maxWidth: 150,
            filter: 'agNumberColumnFilter',
        },
        {
            headerName: "Type",
            field: "type",
            filter: 'agTextColumnFilter',
        },
        {
            headerName: "Status",
            field: "status",
            filter: 'agTextColumnFilter',
        },
        {
            headerName: "Loco",
            field: "locoName",
            filter: 'agTextColumnFilter',
        },
        {
            headerName: "Harvester",
            field: "harvesterName",
            filter: 'agTextColumnFilter',
        },
        {
            headerName: "Siding",
            field: "sidingName",
            filter: 'agTextColumnFilter',
        },
    ];

    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 150,
            filter: true,
            sortable: true,
            floatingFilter: true,
            suppressMenu: true,
            filterParams: { buttons: ['clear', 'reset'], }
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
                            <div style={{ overflow: 'hidden', flexGrow: '1' }}>
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


