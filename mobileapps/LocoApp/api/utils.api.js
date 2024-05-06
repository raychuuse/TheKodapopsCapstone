import Cookies from 'js-cookie';

export const serverUrl = "http://10.0.0.147:8080";

export function postConfig(data) {
    const b = data != null ? JSON.stringify(data) : '';
    return {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken(),
        },
        body: b
    }
}

export function getConfig() {
    return {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken(),
        },
    }
}

function getToken() {
    return Cookies.get('token');
}

function logout() {
    Cookies.remove('token');
    Cookies.remove('user');
}

export function handleFetch(promise, hasJson = true) {
    return promise
        .then(response => {
            if (response.ok) {
                return hasJson ? response.json() : response;
            } else {
                return response.json()
                    .then(err => {
                        console.error(err);
                        if (response.status === 403)
                            logout();
                        throw {status: response.status, message: err.message};
                    });
            }
        });
}
