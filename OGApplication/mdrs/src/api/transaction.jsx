import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {apiUrl} from "./utils";

const Status = {
    1: 'Empty At Mill',
    2: 'Empty On Loco',
    3: 'Empty At Siding',
    4: 'Full At Siding',
    5: 'Full On Loco',
    6: 'Full At Mill'
}

export function getAllTransactions(){
    return fetch(`${apiUrl}/log`)
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
            // Data formatted
            return data.map((bin) => ({
                binID: bin.binID,
                transactionTime: new Date(bin.transactionTime).toLocaleString("en-AU"),
                date: new Date(bin.transactionTime).toLocaleDateString("en-AU"),
                time: new Date(bin.transactionTime).toLocaleTimeString("en-AU", {hour12: false}),
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

export function useAllTransactions(){
    const [error, setError] = useState(null);
    const [transactionData, setTransactionData] = useState([]);

    useEffect(
        () => {
            getAllTransactions()
                .then((transactions) => {
                    setTransactionData(transactions);
                    setError(null)
                })
                .catch((e) =>{
                    setError(e)
                })
        },
        []
    );

    return {
        binData: transactionData,
        error
    };
}
