import { getConfig, handleFetch, postConfig, serverUrl } from './utils.api';

const apiUrl = `${serverUrl}/bin`;

export function consignBin(binID, full) {
    return handleFetch(fetch(`${apiUrl}/consign`, postConfig({binID: binID, full: full})), false);
}
