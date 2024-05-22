import {handleFetch, postConfig, putConfig, serverUrl} from "./utils"

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
        .then((body) => body.json())
        .then((data) =>{
            // Data formatting
            return data.map((obj) => ({
                sidingName: obj.sidingName == null ? "No Siding Listed" : obj.sidingName,
                binsFilled: obj.binsFilled,
            }))
        })
}

export function createHarvester(name) {
    return handleFetch(fetch(`${apiUrl}`, postConfig({name: name})), false);
}

export function updateHarvester(id, name) {
    return handleFetch(fetch(`${apiUrl}/${id}/${name}`, putConfig()), false);
}

export function deleteHarvester(id) {
    return handleFetch(fetch(`${apiUrl}/${id}`, {method: 'DELETE'}), false);
}
