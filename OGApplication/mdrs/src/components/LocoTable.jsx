import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

// Loco Bins Table element
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


const LocoBins = ({ text, data }) => {
    const columns = [
        { headerName: "Bin ID", field: "binsID", maxWidth: 150 },
        { headerName: "Status", field: "status" },
        { headerName: "Harvester Group", field: "harvesterName" },
        { headerName: "Siding", field: "sidingName" },
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
                            <Table columns={columns} data={data} />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};




export {LocoBins};