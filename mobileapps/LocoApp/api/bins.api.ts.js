import { handleFetch, postConfig, putConfig, serverUrl } from './utils.api';

const apiUrl = `${serverUrl}/bins`;

export function consignBin(binID, full) {
    return handleFetch(fetch(`${apiUrl}/consign`, postConfig({binID: binID, full: full})), false);
}

export function updateBinFieldState(binID, field, fieldState) {
    return handleFetch(fetch(`${apiUrl}/bin-field-state/${binID}?field=${field}&state=${fieldState ? 1 : 0}`, putConfig()), false);
}

export function findBin(code, sidingID, locoID) {
    const query = sidingID != null ? `?sidingID=${sidingID}` : `?locoID=${locoID}`;
    return handleFetch(fetch(`${apiUrl}/find-bin/${code}${query}`, postConfig()), true);
}