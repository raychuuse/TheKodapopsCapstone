import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


export async function getAllHarvesters() {
    const res = await fetch("http://localhost:8080/harvesters");
    const res_1 = await res.json();
   
    // check for db error
    if (res_1.Error) {
        console.log(res_1.Message);
        throw Error(`${res_1.Message}`);
    }
    return res_1.Harvesters.map((harvester, index) => {
        return {
            id: harvester.harvesterID,
            name: `${harvester.harvesterName}`,
            key: index
        };
    });
}


export async function getHarvester(id) {
    const url = `http://localhost:8080/harvesters/harvester?id=${id}`

    const res = await fetch(url);
    const res_1 = await res.json();
    if (res_1.Error) {
        console.log(res_1.Message);
        throw Error(`${res_1.Message}`);
    }
    return {
        id: id,
        name: res_1.name[0].harvesterName,
        data: res_1.data
    };
}



export async function getHarvesterBreakdown(id) {
    const url = `http://localhost:8080/harvesters/siding_breakdown?id=${id}`

    const res = await fetch(url);
    const res_1 = await res.json();

    if (res_1.Error) {
        console.log(res_1.Message);
        throw Error(`${res_1.Message}`);
    }
    return res_1.data.map((siding, index) => {
        return {
            id: siding.sidingID,
            name: siding.sidingName,
            total: siding.total,
            full: siding.full,
            empty:siding.empty,
            route: siding.route
        };
    });
}

export function useHarvester(search) {
    const [error, setError] = useState(null);
    const [harvesterData, setHarvesterData] = useState([]);

    useEffect(
        () => {
            getHarvester(search)
                .then((harvesters) => {
                    setHarvesterData(harvesters);
                    setError(null)

                })
                .catch((e) => {
                    setError(e)
                })
        },
        [search]
    );

    return {
        harvesterData: harvesterData,
        error
    };
}

export function useAllHarvesters() {
    const [error, setError] = useState(null);
    const [harvestersData, setHarvestersData] = useState([]);

    useEffect(
        () => {
            getAllHarvesters()
                .then((harvesters) => {
                    setHarvestersData(harvesters);
                    setError(null)
                })
                .catch((e) => {
                    setError(e)
                })
        },
        []
    );

    return {
        harvestersData: harvestersData,
        error
    };
}