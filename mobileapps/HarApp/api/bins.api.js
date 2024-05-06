import { getConfig, handleFetch, postConfig, putConfig, serverUrl } from './utils.api';

const apiUrl = `${serverUrl}/bin`;

export function consignBin(binID, full) {
    return handleFetch(fetch(`${apiUrl}/consign`, postConfig({binID: binID, full: full})), false);
}

export function updateBinFieldState(binID, field, fieldState) {
    return handleFetch(fetch(`${apiUrl}/bin-field-state/${binID}?field=${field}&state=${fieldState ? 1 : 0}`, putConfig()), false);
}

export function findBin(code, sidingID) {
    return handleFetch(fetch(`${apiUrl}/find-bin/${code}?sidingID=${sidingID}`, postConfig()), true);
}
