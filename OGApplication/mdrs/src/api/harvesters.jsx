import {apiUrl} from "./utils"


export async function getAllHarvesters() {
    const res = await fetch(`${apiUrl}/harvesters`);
    const json = await res.json();
   
    // check for db error
    if (json.Error) {
        console.log(json.Message);
        throw Error(`${json.Message}`);
    }
    return json.Harvesters.map((harvester, index) => {
        return {
            id: harvester.harvesterID,
            name: `${harvester.harvesterName}`,
            key: index
        };
    });
}

export async function getHarvester(id) {
    const res = await fetch(`${apiUrl}/harvesters/harvester?id=${id}`);
    const json = await res.json();
    if (json.Error) {
        console.log(json.Message);
        throw Error(`${json.Message}`);
    }
    return {
        id: id,
        name: json.name[0].harvesterName,
        data: json.data
    };
}

export async function getHarvesterBreakdown(id) {
    const res = await fetch(`${apiUrl}/harvesters/siding_breakdown?id=${id}`);
    const json = await res.json();

    if (json.Error) {
        console.log(json.Message);
        throw Error(`${json.Message}`);
    }
    return json.data.map((siding, index) => {
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