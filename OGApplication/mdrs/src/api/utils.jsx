export const apiUrl = "http://localhost:8080";

export function postConfig(data) {
  return {
    method: 'POST',
    mode: 'cors',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }
}

export function putConfig(data) {
  return {
    method: 'PUT',
    mode: 'cors',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }
}