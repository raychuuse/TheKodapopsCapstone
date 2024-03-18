import React, { useEffect, useState } from "react";
import { ListGroup, ListInlineItem } from 'reactstrap';
import {apiUrl, postConfig, putConfig} from "./utils";


import 'bootstrap/dist/css/bootstrap.min.css';

const Status = {
    1: 'Empty At Mill',
    2: 'Empty On Loco',
    3: 'Empty At Siding',
    4: 'Full At Siding',
    5: 'Full On Loco',
    6: 'Full At Mill'
}

// Original group attempted to transition to functions seemingly, switching to async funcs in api gets etc
/** 
export function getAllBins(){
    return fetch(`${apiUrl}/bins`)
        .then((body) => body.json())
        .then((body) => {
            //check for db error
            if(body.Error){
                console.log(body.Message)
                throw Error(`${body.Message}`)
            }
            return body.data
        })
        .then((data) =>{
            return data.map((bin) => ({
                binsID: bin.binsID,
                transactionTime: bin.transactionTime,
                transactionNumber: bin.transactionNumber,
                statusID: bin.statusID,
                status: (Status[parseInt(bin.statusID)]),
                sidingID: bin.sidingID,
                locoID: bin.locoID,
                harvesterID: bin.harvesterID,
                sidingName: bin.sidingName,
                harvesterName: bin.harvesterName,
                locoName: bin.locoName,

            }))
        })
}

export function useAllBins(){
    const [error, setError] = useState(null);
    const [binData, setBinData] = useState([]);

    useEffect(
        () => {
            getAllBins()
                .then((bins) => {
                    // console.log(bins)
                    setBinData(bins);
                    setError(null)
                })
                .catch((e) =>{
                    setError(e)
                })
        },
        []
    );

    return {
        binData: binData,
        error
    };
}
*/

export async function getAllBins(){
    const res = await fetch(`${apiUrl}/bins`);
    const body = await res.json();
    //check for db error
    if (body.Error) {
       console.log(body.Message);
       throw Error(`${body.Message}`);
   }
   const data = body.data;
   return data.map((bin) => ({
       binsID: bin.binsID,
       transactionTime: bin.transactionTime,
       transactionNumber: bin.transactionNumber,
       statusID: bin.statusID,
        status: (Status[parseInt(bin.statusID)]),
        sidingID: bin.sidingID,
       locoID: bin.locoID,
       harvesterID: bin.harvesterID,
       sidingName: bin.sidingName,
       harvesterName: bin.harvesterName,
       locoName: bin.locoName,
   }));
}

export async function createBin(binID) {
    const response = await fetch(`${apiUrl}/bins`, postConfig({id: binID}));
    return response.json();
}

export async function updateBin(binID, binData) {
    // With reworked database, alter binData contents
    const response = await fetch(`${apiUrl}/bins/${binID}`, putConfig({id: binID, data: binData}));
    return response.json();
}

export async function deleteBin(binID) {
    const response = await fetch(`${apiUrl}/bins/${binID}`, {method: 'DELETE'});
    return response.json();
}