export const serverUrl = "http://localhost:8080";

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