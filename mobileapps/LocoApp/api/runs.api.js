import {handleFetch, serverUrl} from "./utils.api";

const apiUrl = `${serverUrl}/runs`;

export function getAllRunsOnDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    return handleFetch(fetch(`${apiUrl}/${dateStr}`), true);
}