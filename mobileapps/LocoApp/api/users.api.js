import { handleFetch, postConfig, serverUrl } from './utils.api';

const apiUrl = `${serverUrl}/users`;

export function login(email, password) {
    return handleFetch(fetch(`${apiUrl}/login`, postConfig({email: email, password: password})), true);
}
