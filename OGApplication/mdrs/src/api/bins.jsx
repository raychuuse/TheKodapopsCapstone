import React, { useEffect, useState } from "react";
import { ListGroup, ListInlineItem } from 'reactstrap';



import 'bootstrap/dist/css/bootstrap.min.css';

const Status = {
    1: 'Empty At Mill',
    2: 'Empty On Loco',
    3: 'Empty At Siding',
    4: 'Full At Siding',
    5: 'Full On Loco',
    6: 'Full At Mill'
}


export function getAllBins(){
    return fetch("http://localhost:8080/bins")
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

// export async function getAllBins(){
//     const res = await fetch("http://localhost:8080/bins");
//     const res_1 = await res.json();
//     //check for db error
//     if (res_1.Error) {
//         console.log(res_1.Message);
//         throw Error(`${res_1.Message}`);
//     }
//     const data = res_1.data;
//     return data.map((bin) => ({
//         binsID: bin.binsID,
//         transactionTime: bin.transactionTime,
//         transactionNumber: bin.transactionNumber,
//         statusID: bin.statusID,
//         status: (Status[parseInt(bin.statusID)]),
//         sidingID: bin.sidingID,
//         locoID: bin.locoID,
//         harvesterID: bin.harvesterID,
//         sidingName: bin.sidingName,
//         harvesterName: bin.harvesterName,
//         locoName: bin.locoName,
//     }));
// }



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
