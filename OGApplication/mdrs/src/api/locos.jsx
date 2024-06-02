import { deleteConfig, fullConverter, getConfig, handleFetch, postConfig, putConfig, serverUrl } from './utils';

const apiUrl = `${serverUrl}/locos`;

export function getAllLocos() {
    return handleFetch(fetch(`${apiUrl}`, getConfig()));
}

export function getLoco(id) {
    return handleFetch(fetch(`${apiUrl}`, getConfig()));
}

export function getCurrentLoad(id) {
    return handleFetch(fetch(`${apiUrl}/${id}/load`, getConfig()), true);
}

export function getSidingBreakdown(id) {
    return fetch(`${apiUrl}/${id}/siding_breakdown`, getConfig())
        .then((body) => body.json())
        .then((data) =>{
            // Data formatting
            return data.map((obj) => ({
                sidingName: obj.sidingName !== null ? obj.sidingName : "NOT LISTED",
                type: obj.type !== null ? obj.type : "NOT LISTED",
                count: obj.count
            }))
        })
}

export function createLoco(name) {
    return handleFetch(fetch(`${apiUrl}`, postConfig({name: name})), false);
}

export function updateLoco(id, name) {
    return handleFetch(fetch(`${apiUrl}/${id}/${name}`, putConfig()), false);
}

export function deleteLoco(id) {
    return handleFetch(fetch(`${apiUrl}/${id}`, deleteConfig()), false);
}