import {postConfig, serverUrl} from "./utils";

const apiUrl = `${serverUrl}/user`;

export default async function loginUser(user) {
    return fetch(`${apiUrl}/login`, postConfig(user))
        .then(response => {
            if (response.ok)
                return response.json();
            throw new Error();
        });
}
