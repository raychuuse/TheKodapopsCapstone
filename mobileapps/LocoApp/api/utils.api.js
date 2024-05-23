import {router} from 'expo-router';
import { generalAlert } from '../lib/alerts';

const serverIP = process.env.EXPO_PUBLIC_SERVER_IP;
const serverPort = process.env.EXPO_PUBLIC_SERVER_PORT;

export const serverUrl = `http://${serverIP}:${serverPort}`;

let token;

export function postConfig(data) {
  const b = data != null ? JSON.stringify(data) : '';
  return {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: b,
  };
}

export function putConfig(data) {
  const b = data != null ? JSON.stringify(data) : '';
  return {
    method: 'PUT',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
    body: b,
  };
}

export function getConfig() {
  return {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  };
}

export function setToken(t) {
  token = t;
}

export function logout() {
  token = null;
  generalAlert('Your authentication has expired, you have been logged out.');
  router.navigate('/');
}

export function handleFetch(promise, hasJson = true) {
  return promise.then((response) => {
    if (response.ok) {
      return hasJson ? response.json() : response;
    } else {
      return response.json().then((err) => {
        console.error(err);
        if (response.status === 403) logout();
        throw { status: response.status, message: err.message };
      });
    }
  });
}
