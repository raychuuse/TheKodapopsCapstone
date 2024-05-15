import {serverUrl, postConfig, putConfig, fullConverter} from "./utils";

const apiUrl = `${serverUrl}/sidings`;

export function getAllSidings() {
    return fetch(`${apiUrl}`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
}

export function getSiding(id) {
    return fetch(`${apiUrl}/${id}`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
}

export function getHarvesterBreakdown(id) {
    return fetch(`${apiUrl}/${id}/harvester_breakdown`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
}

export function getSidingBreakdown(sidingId) {
    return fetch(`${apiUrl}/${sidingId}/breakdown`)
        .then((body) => body.json())
        .then((data) =>{
            // Data formatting
            return data.map((obj) => ({
                binID: obj.binID,
                status: obj.status !== null ? obj.status : "NOT LISTED",
                time: obj.transactionTime
            }))
        })
}

export function getLocoBreakdown(id) {
    return fetch(`${apiUrl}/${id}/loco_breakdown`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
}

export function createSiding(sidingName) {
    return fetch(`${apiUrl}`, postConfig({name: sidingName}))
        .then(response => {
            if (response.ok)
                return response;
            throw new Error();
        });
}

export function updateSiding(id, sidingName) {
    return fetch(`${apiUrl}/${id}/name`, putConfig({name: sidingName}))
        .then(response => {
            if (response.ok)
                return response;
            throw new Error();
        });
}

export function deleteSiding(id) {
    return fetch(`${apiUrl}/${id}`, {method: 'DELETE'})
        .then(response => {
            if (response.ok)
                return response;
            throw new Error();
        });
}