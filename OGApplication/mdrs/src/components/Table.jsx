import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";

import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-balham.css'; // Optional theme CSS

import 'bootstrap/dist/css/bootstrap.min.css';

const Table = ({ columns, data, onRowClicked, onGridReadyCallback }) => {
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
      if (onGridReadyCallback != null)
        onGridReadyCallback(params);
    }, []);
  
    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        minWidth: 150,
        filter: true,
        sortable: true,
        floatingFilter: true,
        suppressMenu: true,
        filterParams: { buttons: ['clear'], }
      };
    }, []);
  
    return (
      <div className="table">
        {/*Ensures Table is rendered when data is provided*/}
        {data ?
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
                      cacheQuickFilter={true}
                      pagination={true}
                      paginationPageSize={20}
                      domLayout={'autoHeight'}
                      onGridReady={onGridReady}
                      onRowClicked={params => onRowClicked != null ? onRowClicked(params) : null}
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

  export default Table;