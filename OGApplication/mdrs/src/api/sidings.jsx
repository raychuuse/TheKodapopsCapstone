import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export async function getAllSidings() {
    const res = await fetch("http://localhost:8080/sidings");
    const res_1 = await res.json();
    // console.log(res_1);
    // check for db error
    if (res_1.Error) {
        console.log(res_1.Message);
        throw Error(`${res_1.Message}`);
    }
    return res_1.Sidings.map((siding, index) => {
        return {
            id: siding.sidingID,
            name: `${siding.sidingName}`,
            abbreviation: `${siding.Abbreviation}`,
            key: index
        };
    });
}

export function useAllSidings() {
    const [error, setError] = useState(null);
    const [sidingsData, setSidingsData] = useState([]);

    useEffect(
        () => {
            getAllSidings()
                .then((sidings) => {
                    setSidingsData(sidings);
                    setError(null)
                    // console.log(sidings)
                })
                .catch((e) => {
                    setError(e)
                })
        },
        []
    );

    return {
        sidingsData,
        error
    };
}

export async function getSiding(id) {

    const url = `http://localhost:8080/sidings/siding?id=${id}`
    console.log(url)

    const res = await fetch(url);
    const res_1 = await res.json();
    console.log(res_1);
    // check for db error
    if (res_1.Error) {
        throw Error(`${res_1.Message}`);
    }

    return {
        id: id,
        name: res_1.name[0].sidingName,
        data: res_1.data
    };
}



export async function getSidingBreakdown(id) {
    const url = `http://localhost:8080/sidings/harvester_breakdown?id=${id}`

    const res = await fetch(url);
    const res_1 = await res.json();

    if (res_1.Error) {
        console.log(res_1.Message);
        throw Error(`${res_1.Message}`);
    }
    return res_1.data.map((harvester, index) => {
        return {
            id: harvester.harvesterID,
            name: harvester.harvesterName,
            total: harvester.total,
            full: harvester.full,
            empty: harvester.empty,
            route: harvester.route
        };
    });
}


export function useSiding(search) {
    const [error, setError] = useState(null);
    const [sidingData, setSidingData] = useState([]);

    useEffect(
        () => {
            getSiding(search)
                .then((siding) => {
                    setSidingData(siding);
                    setError(null)
                })
                .catch((e) => {

                    setError(e)
                })
        },
        [search]
    );

    return {
        sidingData,
        error
    };
}