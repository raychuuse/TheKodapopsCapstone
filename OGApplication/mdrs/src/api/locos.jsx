import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {apiUrl} from "./utils";

export async function getAllLocos() {
    const res = await fetch(`${apiUrl}/locos`);
    const body = await res.json();
    // console.log(body);
    // check for db error
    if (body.Error) {
        console.log(body.Message);
        throw Error(`${body.Message}`);
    }
    return body.data.map((loco, index) => {
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
    const url = `${apiUrl}/locos/loco?id=${id}`;
    console.log(url);

    const res = await fetch(url);
    const body = await res.json();
    console.log(body);
    // Check for db error
    if (body.Error) {
        throw Error(`${body.Message}`);
    }
    return {
        id: id,
        name: body.name[0].locoName,
        data: body.data
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