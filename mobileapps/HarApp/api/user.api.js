import { getConfig, handleFetch, serverUrl } from './utils.api';

const apiUrl = `${serverUrl}/user`;

export function getFarms() {
    return handleFetch(fetch(`${apiUrl}/1/farms`, getConfig()), true);
}

export function getBlocks(farmID) {
    return handleFetch(fetch(`${apiUrl}/farms/${farmID}/blocks`, getConfig()), true);
}

export function getSubBlocks(farmID, blockID) {
    return handleFetch(fetch(`${apiUrl}/blocks/${farmID}/${blockID}/subs`, getConfig()), true);
}



