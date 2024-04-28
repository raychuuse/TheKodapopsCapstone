import {handleFetch, serverUrl} from "./utils.api";

const apiUrl = `${serverUrl}/locos`;

export function getAllLocos() {
    return handleFetch(fetch(`${apiUrl}`), true);
}

export function getLocoById(id) {
    return handleFetch(fetch(`${apiUrl}`), true);
}

export function getCurrentLoadById(id, stopID) {
    return handleFetch(fetch(`${apiUrl}/${id}/load?stopID=${stopID}`), true);
}