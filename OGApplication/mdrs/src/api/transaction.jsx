import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Status = {
    1: 'Empty At Mill',
    2: 'Empty On Loco',
    3: 'Empty At Siding',
    4: 'Full At Siding',
    5: 'Full On Loco',
    6: 'Full At Mill'
}

export function getAllTransactions(){
    return fetch("http://localhost:8080/log")
        .then((res) => res.json())
        .then((res) => {
            //check for db error
            if(res.Error){
                console.log(res.Message)
                throw Error(`${res.Message}`)
            }
            return res.data
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
