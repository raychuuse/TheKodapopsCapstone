import Cookies from 'js-cookie';

export const serverUrl = "http://localhost:8080";

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

export function putConfig(data) {
    const b = data != null ? JSON.stringify(data) : '';
    return {
        method: 'PUT',
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

export function deleteConfig() {
    return {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + getToken(),
        },
    }
}

export function handleFetch(promise, hasJson=true) {
    return promise
        .then(response => {
            if (response.ok) {
                return hasJson ? response.json() : response;
            } else {
                return response.json()
                    .then(json => {
                        console.error(json);
                        throw new Error(json.message);
                    });
            }
        });
}

function getToken() {
    return Cookies.get('token');
}

export const Status = {
    1: 'Empty At Mill',
    2: 'Empty On Loco',
    3: 'Empty At Siding',
    4: 'Full At Siding',
    5: 'Full On Loco',
    6: 'Full At Mill',
    7: 'Missing',
    8: 'Error Unknown'
}

export const fullConverter = (val) => {
    if (val == 0) {
        return 'Empty'
    }
    else if (val == 1) {
        return 'Full';
    }
    return null;
}