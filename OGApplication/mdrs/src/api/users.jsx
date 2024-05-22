import {handleFetch, postConfig, putConfig, serverUrl} from "./utils";

const apiUrl = `${serverUrl}/user`;

export function login(user) {
    return handleFetch(fetch(`${apiUrl}/login`, postConfig(user)))
    .catch(err => {
        throw new Error("Invalid user ID/ password");
    });
}

export function getAll() {
    //return handleFetch(fetch(`${apiUrl}/`));
    return fetch(`${apiUrl}/`)
    .then((body) => body.json())
        .then((data) =>{
            // Data formatting
            return data.map((obj) => ({
                userID: obj.userID,
                firstName: obj.firstName,
                lastName: obj.lastName,
                userRole: obj.userRole === "Locomotive" ? "Locomotive Driver" : obj.userRole
            }))
        })
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
