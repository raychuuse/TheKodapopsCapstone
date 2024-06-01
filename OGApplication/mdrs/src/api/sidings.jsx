import {serverUrl, postConfig, putConfig, fullConverter, handleFetch} from "./utils";

const apiUrl = `${serverUrl}/sidings`;

export function getAllSidings() {
    return fetch(`${apiUrl}`)
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
    return handleFetch(fetch(`${apiUrl}`, postConfig({name: sidingName})), false);
}

export function updateSiding(id, sidingName) {
    return handleFetch(fetch(`${apiUrl}/${id}/${sidingName}`, putConfig()), false);
}

export function deleteSiding(id) {
    return handleFetch(fetch(`${apiUrl}/${id}`, {method: 'DELETE'}), false);
}