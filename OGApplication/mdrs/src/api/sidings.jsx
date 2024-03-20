import {serverUrl, postConfig, putConfig} from "./utils";

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

export function getSidingBreakdown(id) {
    return fetch(`${apiUrl}/${id}/breakdown`)
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
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
                return response.json();
            throw new Error();
        });
}

export function updateSiding(id, sidingName) {
    return fetch(`${apiUrl}/${id}/name`, putConfig({name: sidingName}))
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
}

export function deleteSiding(id) {
    return fetch(`${apiUrl}/${id}`, {method: 'DELETE'})
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
}