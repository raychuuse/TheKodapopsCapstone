import {serverUrl} from "./utils"

const apiUrl = `${serverUrl}/harvesters`;


export function getAllHarvesters() {
    return fetch(`${apiUrl}`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
}

export function getHarvester(id) {
    return fetch(`${apiUrl}/${id}`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
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
