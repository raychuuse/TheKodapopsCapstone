import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {serverUrl, Status} from "./utils";


const translateStatus = (fill, sidingID, type) => {
    if (type == 'MISSING') {
        return 7;
    }
    if (type == "PICKED_UP") {
        if (fill == true) {
            return 5;
        }
        else {
            return 2;
        }
    }
    if (sidingID == 0) {
        if (fill == true) {
            return 6;
        }
        else {
            return 1;
        }
    }
    if (fill == true) {
        return 4;
    }
    else {
        return 3;
    }
}

export function getAllTransactions(){
    return fetch(`${serverUrl}/log`)
        .then((body) => body.json())
        .then((data) =>{
            // Data formatted
            return data.map((transaction) => ({
                transactionNumber: transaction.transactionID,
                transactionTime: new Date(transaction.transactionTime).toLocaleString("en-AU"),
                date: new Date(transaction.transactionTime).toLocaleDateString("en-AU"),
                time: new Date(transaction.transactionTime).toLocaleTimeString("en-AU", {hour12: false}),
                binID: transaction.binID,
                type: transaction.type,
                status: (Status[parseInt(translateStatus(transaction.status, transaction.sidingID, transaction.type))]),
                sidingID: transaction.sidingID,
                locoID: transaction.locoID,
                harvesterID: transaction.harvesterID,
                sidingName: transaction.sidingName,
                harvesterName: transaction.harvesterName,
                locoName: transaction.locoName,
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
