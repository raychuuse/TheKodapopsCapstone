import { serverUrl, postConfig, putConfig, fullConverter, handleFetch, getConfig, deleteConfig } from './utils';

const apiUrl = `${serverUrl}/sidings`;

export function getAllSidings() {
    return handleFetch(fetch(`${apiUrl}`, getConfig()));
}

export function getHarvesterBreakdown(id) {
    return handleFetch(fetch(`${apiUrl}/${id}/harvester_breakdown`, getConfig()));
}

export function getSidingBreakdown(sidingId) {
    return fetch(`${apiUrl}/${sidingId}/breakdown`, getConfig())
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
    return handleFetch(fetch(`${apiUrl}/${id}/loco_breakdown`, getConfig()));
}

export function createSiding(sidingName) {
    return handleFetch(fetch(`${apiUrl}`, postConfig({name: sidingName})), false);
}

export function updateSiding(id, sidingName) {
    return handleFetch(fetch(`${apiUrl}/${id}/${sidingName}`, putConfig()), false);
}

export function deleteSiding(id) {
    return handleFetch(fetch(`${apiUrl}/${id}`, deleteConfig()), false);
}