import { getConfig, handleFetch, serverUrl } from './utils.api';

const apiUrl = `${serverUrl}/sidings`;

export function getBinsFromSiding(id, stopID) {
    return handleFetch(fetch(`${apiUrl}/${id}/breakdown?` + new URLSearchParams({stopID: stopID}), getConfig()), true);
}
