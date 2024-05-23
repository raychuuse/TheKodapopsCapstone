import {getConfig, handleFetch, postConfig, putConfig, serverUrl} from "./utils";

const apiUrl = `${serverUrl}/user`;

export function login(user) {
    return handleFetch(fetch(`${apiUrl}/login`, postConfig(user)))
    .catch(() => {
        throw new Error("Invalid user ID/ password");
    });
}

export function resetToken(user) {
    return handleFetch(fetch(`${apiUrl}/reset-code`, postConfig(user)))
    .catch(() => {
        throw new Error("Invalid email for reset (doesn't exist).");
    });
}

export function resetPassword(user) {
    return handleFetch(fetch(`${apiUrl}/reset-password`, postConfig(user)))
    .catch(() => {
        throw new Error("Invalid token/ email.");
    });
}

export function getAll() {
    return handleFetch(fetch(`${apiUrl}/`, getConfig()), true);
}
export function getById(id) {
    return handleFetch(fetch(`${apiUrl}/${id}`));
}

export function update(user) {
    return handleFetch(fetch(`${apiUrl}/`, putConfig(user)), false);
}

export function create(user) {
    return handleFetch(fetch(`${apiUrl}/`, postConfig(user)));
}

export function setActiveStatus(id, active)  {
    return handleFetch(fetch(`${apiUrl}/set-active/${id}/${active}`, postConfig()), false);
}
