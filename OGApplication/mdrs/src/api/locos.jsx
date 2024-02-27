import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export async function getAllLocos() {
    const res = await fetch("http://localhost:8080/locos");
    const res_1 = await res.json();
    // console.log(res_1);
    // check for db error
    if (res_1.Error) {
        console.log(res_1.Message);
        throw Error(`${res_1.Message}`);
    }
    return res_1.data.map((loco, index) => {
        return {
            id: loco.locoID,
            name: loco.locoName,
            key: index
        };
    });
}

export function useAllLocos() {
    const [error, setError] = useState(null);
    const [locosData, setLocosData] = useState([]);

    useEffect(
        () => {
            getAllLocos()
                .then((locos) => {
                    setLocosData(locos);
                    setError(null)
                    // console.log(locos)
                })
                .catch((e) => {
                    setError(e)
                })
        },
        []
    );

    return {
        locosData,
        error
    };
}

export async function getLoco(id) {
    const url = `http://localhost:8080/locos/loco?id=${id}`;
    console.log(url);

    const res = await fetch(url);
    const res_1 = await res.json();
    console.log(res_1);
    // Check for db error
    if (res_1.Error) {
        throw Error(`${res_1.Message}`);
    }
    return {
        id: id,
        name: res_1.name[0].locoName,
        data: res_1.data
    };
}


export function useLoco(search) {
    //console.log(search.id);
    const [error, setError] = useState(null);
    const [locoData, setLocoData] = useState([]);

    useEffect(
        () => {
            getLoco(search)
                .then((locos) => {
                    setLocoData(locos);
                    setError(null)
                    // console.log(locos)
                })
                .catch((e) => {
                    setError(e)
                })
        },
        [search]
    );

    return {
        locoData,
        error
    };
}