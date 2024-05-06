import { getConfig, handleFetch, serverUrl } from './utils.api';

const apiUrl = `${serverUrl}/locos`;

export function getAllLocos() {
    return handleFetch(fetch(`${apiUrl}`, getConfig()), true);
}

export function getLocoById(id) {
    return handleFetch(fetch(`${apiUrl}/${id}`, getConfig()), true);
}

export function getCurrentLoadById(id, stopID) {
    return handleFetch(fetch(`${apiUrl}/${id}/load` + (stopID != null ? `?stopID=${stopID}` : ''), getConfig()), true);
}
