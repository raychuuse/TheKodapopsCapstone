import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import { useLocation, useNavigate } from 'react-router-dom';

import {ErrorAlert} from "./Alerts";
import {standardiseData} from "../utils";

// Search Bar 
export const Search = ({ keyword, onChange }) => {
    return (
        < div className="search-bar d-flex" >
            <input
                className="form-control me-2 searchbar"
                type='text'
                name="search"
                placeholder="Search"
                id='search'
                key="search-bar"
                value={keyword}
                onChange={(e) => onChange(e.target.value)}

            />
        </div >
    )
}

//Searchable List
export const List = ({ data = [], onClick, onEdit, onDelete, loading }) => {
    const navigate = useNavigate();

    const normalized = standardiseData(data);

    return (
      < div className="search-result" >
        <ul id="items" className="list-group">
          {/* Search Result Error  */}
          {data.length === 0 && !loading ? <ErrorAlert message={"No Results Found"} /> : null}
          {normalized.map(({ id, name }) => (
            <button
              key={id}
              type="button"
              className={`list-group-item ${name}`}
              name={name}
              id={id}
              onClick={() => {
                onClick(id);
                navigate(`?id=${id}`);
              }}
            >
              {name}
              {/* Only render the edit and delete buttons if onEdit and onDelete have been provided */}
              {onEdit != null &&
                <button type='button' className={'btn btn-danger'} onClick={() => onDelete(id)} style={{float: 'right'}}>Delete</button>
              }
              { onDelete != null &&
                <button type='button' className={'btn btn-primary'} onClick={() => onEdit(id)} style={{float: 'right', marginRight: '1rem'}}>Edit</button>
              }
            </button>
          ))}
        </ul >
      </div >
    )
  }



