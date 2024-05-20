import { getConfig, handleFetch, postConfig, serverUrl } from './utils.api';

const apiUrl = `${serverUrl}/runs`;

export function getRunsByLocoAndDate(locoID, date) {
    console.info(date);
    const dateStr = date.toISOString().split('T')[0];
    return handleFetch(fetch(`${apiUrl}/${locoID}/${dateStr}`, getConfig()), true);
}

export function getRunById(id) {
    return handleFetch(fetch(`${apiUrl}/${id}`, getConfig()), true);
}

export function performStopAction(binID, locoID, stopID, type) {
    return handleFetch(fetch(`${apiUrl}/${locoID}/stop-action/${stopID}/${binID}?type=${type}`, postConfig(null)), false);
}

export function getCounts(stopID) {
    return handleFetch(fetch(`${apiUrl}/counts/${stopID}`, getConfig()), true);
}