import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { AgGridReact } from 'ag-grid-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-balham.css';

const Metrics = ({ bins: { mill, empty, route, full, bins } }) => {
    const metrics = [
        { headerName: "Delivered to Mill", field: "binsID", data: mill, count: mill.length },
        // { headerName: "Full Bins On Route to Mill", field: "binsID", data: route, count: route.length },
        { headerName: "Full Bins", field: "binsID", data: full, count: full.length },
        { headerName: "Empty Bins", field: "binsID", data: empty, count: empty.length },
    ];

    return (
        <div className="row">
            {metrics.map(({ headerName, field, data, count }, i) => (
                <BinsMetric
                    key={i}
                    count={count}
                    text={headerName}
                    data={data}
                    columns={{ headerName, field }}
                />
            ))}
        </div>
    )
}

const HarvesterMetrics = ({ bins: { mill, empty, route, full, bins } }) => {
    const metrics = [
        { headerName: "Delivered to Mill", field: "binsID", data: mill, count: mill.length },
        { headerName: "On Route to Mill", field: "binsID", data: route, count: route.length },
        { headerName: "Full Bins", field: "binsID", data: full, count: full.length },
        { headerName: "Empty Bins", field: "binsID", data: empty, count: empty.length },
    ];

    return (
        <div className="row">
            {metrics.map(({ headerName, field, data, count }, i) => (
                <BinsMetric
                    key={i}
                    count={count}
                    text={headerName}
                    data={data}
                    columns={{ headerName, field }}
                />
            ))}
        </div>
    )
}

const LocoMetrics = ({ bins: { mill, empty, route, full, bins } }) => {
    const metrics = [

        { headerName: "Empty Bins", field: "binsID", data: empty, count: empty.length },
        { headerName: "Full Bins", field: "binsID", data: full, count: full.length },
        { headerName: "Delivered to Mill", field: "binsID", data: mill, count: mill.length },
    ];

    return (
        <div className="row">
            <div className="col">
                <div className="row">
                    {metrics.map(({ headerName, field, data, count }, i) => (
                        <BinsMetric
                            key={i}
                            count={count}
                            text={headerName}
                            data={data}
                            columns={{ headerName, field }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

// Component for displaying number of bins and table listing bin ids 
const BinsMetric = ({ columns, count, text, data }) => {
    const gridRef = useRef();
    const containerStyle = useMemo(() => ({ width: '90%', height: '100%' }), []);
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
            minWidth: 150,
            sortable: true,
            filter: true
        };
    }, []);

    return (
        <div className="col">
            <section className="metric">
                <div className="hero__content">
                    <h1 className="hero__title">{count}</h1>
                    <p className="hero__subtitle">{text}</p>
                    <div className="table-wrapper">
                        <div className="table-header-wrapper">
                            <h4 className="table-header">{text}</h4>
                        </div>
                        <div className="row">
                            <div style={containerStyle}>
                                <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                                    <div style={{ overflow: 'hidden', flexGrow: '1' }}>
                                        <div style={gridStyle} className="ag-theme-balham">
                                            <AgGridReact
                                                ref={gridRef}
                                                columnDefs={[columns]}
                                                defaultColDef={defaultColDef}
                                                rowData={data}
                                                cacheQuickFilter={true}
                                                pagination={true}
                                                paginationPageSize={10}
                                                domLayout={'autoHeight'}
                                                onGridReady={onGridReady}
                                            ></AgGridReact>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className="ag-theme-balham" style={{ height: "300px", width: "250px" }}>
                                <AgGridReact columnDefs={[columns]} rowData={data} />
                            </div>
                        </div> */}
                    </div>
                </div>
            </section>

        </div>
    );
};

export { Metrics, BinsMetric, HarvesterMetrics, LocoMetrics };