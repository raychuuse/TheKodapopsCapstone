import {fullConverter, postConfig, putConfig, serverUrl} from "./utils";

const apiUrl = `${serverUrl}/locos`;

export function getAllLocos() {
    return fetch(`${apiUrl}`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
}

export function getLoco(id) {
    return fetch(`${apiUrl}`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        })
}

export function getCurrentLoad(id) {
    return fetch(`${apiUrl}/${id}/current-load`)
        .then((body) => body.json())
        .then((data) =>{
            // Data formatting
            return data.map((obj) => ({
                binID: obj.binID,
                status: obj.status !== null ? obj.status : "NOT LISTED",
            }))
        })
}

export function getSidingBreakdown(id) {
    return fetch(`${apiUrl}/${id}/siding_breakdown`)
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
    return fetch(`${apiUrl}`, postConfig({name: name}))
        .then(response => {
            if (response.ok)
                return response;
            throw new Error();
        });
}

export function updateLoco(id, name) {
    return fetch(`${apiUrl}/${id}/name`, putConfig({name: name}))
        .then(response => {
            if (response.ok)
                return response;
            throw new Error();
        });
}

export function deleteLoco(id) {
    return fetch(`${apiUrl}/${id}`, {method: 'DELETE'})
        .then(response => {
            if (response.ok)
                return response;
            throw new Error();
        });
}