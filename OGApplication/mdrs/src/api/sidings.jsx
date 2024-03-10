import {apiUrl, postConfig, putConfig} from "./utils";

export async function getAllSidings() {
    const res = await fetch(`${apiUrl}/sidings`);
    const body = await res.json();

    // check for db error
    if (body.Error) {
        console.log(body.Message);
        throw Error(`${body.Message}`);
    }

    return body.Sidings.map((siding, index) => {
        return {
            id: siding.sidingID,
            name: `${siding.sidingName}`,
            abbreviation: `${siding.Abbreviation}`,
            key: index
        };
    });
}

export async function getSiding(id) {
    const res = await fetch(`${apiUrl}/sidings/siding?id=${id}`);
    const body = await res.json();
    console.log(body);
    // check for db error
    if (body.Error) {
        throw Error(`${body.Message}`);
    }

    return {
        id: id,
        name: body.name[0].sidingName,
        data: body.data
    };
}



export async function getSidingBreakdown(id) {
    const res = await fetch(`${apiUrl}/sidings/harvester_breakdown?id=${id}`);
    const body = await res.json();

    if (body.Error) {
        console.log(body.Message);
        throw Error(`${body.Message}`);
    }
    return body.data.map((harvester, index) => {
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

export async function createSiding(sidingName) {
    const response = await fetch(`${apiUrl}/siding`, postConfig({name: sidingName}));
    return response.json();
}

export async function updateSiding(id, sidingName) {
    const response = await fetch(`${apiUrl}/siding/${id}/name`, putConfig({name: sidingName}));
    return response.json();
}

export async function deleteSiding(id) {
    const response = await fetch(`${apiUrl}/siding/${id}`, {method: 'DELETE'});
    return response.json();
}