import Cookies from 'js-cookie';

export const serverUrl = "http://10.0.0.90:8080";

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

function getToken() {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNzE1MDUxMTcwMzU0LCJpYXQiOjE3MTQ5NjQ3NzB9.7mRDeb8rlYAV3Q37aWUJ9KlBx-yMcDea2fZSChUrQB8';
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
