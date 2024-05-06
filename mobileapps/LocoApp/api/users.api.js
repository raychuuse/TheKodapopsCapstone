import { handleFetch, postConfig, serverUrl } from './utils.api';

const apiUrl = `${serverUrl}/user`;

export function login(email, password) {
    return handleFetch(fetch(`${apiUrl}/login`, postConfig({id: 1, password: password})), true);
}
