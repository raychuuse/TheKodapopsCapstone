import {serverUrl} from "./utils";

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
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
}

export function getSidingBreakdown(id) {
    return fetch(`${apiUrl}/${id}/siding_breakdown`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
}
