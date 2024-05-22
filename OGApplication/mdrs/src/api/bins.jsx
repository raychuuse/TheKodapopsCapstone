import React, { useEffect, useState } from "react";
import { ListGroup, ListInlineItem } from 'reactstrap';
import {serverUrl, postConfig, putConfig, Status, handleFetch} from "./utils";
import 'bootstrap/dist/css/bootstrap.min.css';

const apiUrl = `${serverUrl}/bins`;

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

export function getAllBins(){
    return fetch(`${apiUrl}`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
}

export function moveBin(binID, sidingID) {
    return handleFetch(fetch(`${apiUrl}/${binID}/move-bin/${sidingID}`, postConfig()), false);
}

export function getDashBins(){
    return fetch(`${apiUrl}/dash`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
}

export function getSidingBreakdown(id) {
    return fetch(`${apiUrl}/${id}/siding_breakdown`)
        .then((body) => body.json())
        .then((data) =>{
            // Data formatting
            return data.map((transaction) => ({
                type: transaction.type,
                sidingName: transaction.sidingName == null ? "No Siding Listed" : transaction.sidingName,
            }))
        })
}

export function getBin(binID) {
    return handleFetch(fetch(`${apiUrl}/${binID}`), true);
}

export function createBin(code) {
    return handleFetch(fetch(`${apiUrl}/${code}`, postConfig()), false);
}

export function editBin(binID,code) {
    console.info(binID, code);
    return handleFetch(fetch(`${apiUrl}/${binID}/${code}`, putConfig()), false);
}

export function deleteBin(binID) {
    return handleFetch(fetch(`${apiUrl}/${binID}`, {method: 'DELETE'}), false);
}

export function getMaintenanceBreakdown() {
    return fetch(`${apiUrl}/maintenance_breakdown`)
        .then((body) => body.json())
        .then((data) =>{
            // Data formatting
            return data.map((obj) => ({
                id: obj.binID,
                sidingName: obj.sidingName,
                issue: getFlag(obj.missing, obj.repair),
            }))
        })
}

const getFlag = (missing, repair) => {
    if (missing) {
        return "Missing";
    }
    if (repair)
    {
        return "Needs Repairs";
    }
}