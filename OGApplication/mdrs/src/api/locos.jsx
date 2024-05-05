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
    return fetch(`${apiUrl}/${id}/load`)
        .then((body) => body.json())
        .then((data) =>{
            // Data formatting
            return data.map((obj) => ({
                binID: obj.binID,
                status: fullConverter(obj.status),
            }))
        })
}

export function getSidingBreakdown(id) {
    return fetch(`${apiUrl}/${id}/siding_breakdown`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
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