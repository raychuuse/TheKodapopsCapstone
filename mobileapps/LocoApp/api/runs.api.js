import { handleFetch, postConfig, serverUrl } from './utils.api';

const apiUrl = `${serverUrl}/runs`;

export function getAllRunsOnDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    return handleFetch(fetch(`${apiUrl}/date/${dateStr}`), true);
}

export function getRunById(id) {
    return handleFetch(fetch(`${apiUrl}/${id}`), true);
}

export function dropOffBin(binID, locoID, stopID) {
    return handleFetch(fetch(`${apiUrl}/${locoID}/drop-off/${stopID}/${binID}`, postConfig(null)), false);
}

export function pickUpBin(binID, locoID, stopID) {
    return handleFetch(fetch(`${apiUrl}/${locoID}/pick-up/${stopID}/${binID}`, postConfig(null)), false);
}

export function getCounts(stopID) {
    return handleFetch(fetch(`${apiUrl}/counts/${stopID}`), true);
}