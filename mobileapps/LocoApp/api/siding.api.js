import {handleFetch, serverUrl} from "./utils.api";

const apiUrl = `${serverUrl}/sidings`;

export function getSidingBreakdown(id, stopID) {
    return handleFetch(fetch(`${apiUrl}/${id}/breakdown?` + new URLSearchParams({stopID: stopID})), true);
}
