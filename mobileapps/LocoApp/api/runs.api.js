import { getConfig, handleFetch, postConfig, serverUrl } from './utils.api';

const apiUrl = `${serverUrl}/runs`;

export function getRunsByLocoAndDate(locoID, date) {
    const dateStr = date.toISOString().split('T')[0];
    return handleFetch(fetch(`${apiUrl}/${locoID}/${dateStr}`, getConfig()), true);
}

export function performStopAction(binID, locoID, stopID, type) {
    return handleFetch(fetch(`${apiUrl}/${locoID}/stop-action/${stopID}/${binID}?type=${type}`, postConfig(null)), false);
}

export function completeStop(stopID, type, complete) {
    return handleFetch(fetch(`${apiUrl}/${stopID}/complete-stop/${type}/${complete ? '1' : '0'}`, postConfig(null)), false);
}