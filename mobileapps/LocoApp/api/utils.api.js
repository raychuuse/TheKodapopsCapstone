export const serverUrl = "http://10.0.0.80:8080";

export function postConfig(data) {
    const b = data != null ? JSON.stringify(data) : '';
    return {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: b
    }
}

export function putConfig(data) {
    const b = data != null ? JSON.stringify(data) : '';
    return {
        method: 'PUT',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: b
    }
}

export function handleFetch(promise, hasJson = true) {
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
