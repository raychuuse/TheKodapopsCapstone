import Cookies from 'js-cookie';
import AsyncStorage from '@react-native-async-storage/async-storage';

const serverIP = process.env.EXPO_PUBLIC_SERVER_IP;
const serverPort = process.env.EXPO_PUBLIC_SERVER_PORT;

export const serverUrl = `http://${serverIP}:${serverPort}`;

export function postConfig(data) {
  const b = data != null ? JSON.stringify(data) : '';
  return {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + getToken(),
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
      Authorization: 'Bearer ' + getToken(),
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
      Authorization: 'Bearer ' + getToken(),
    },
  };
}

async function getToken() {
  return await AsyncStorage.getItem("token");
  //return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxNzE1MDUxMTcwMzU0LCJpYXQiOjE3MTQ5NjQ3NzB9.7mRDeb8rlYAV3Q37aWUJ9KlBx-yMcDea2fZSChUrQB8';
}

export async function logout() {
  AsyncStorage.removeItem
  Cookies.remove('token');
  Cookies.remove('user');
  await AsyncStorage.removeItem('isSignedIn');
  await AsyncStorage.removeItem('userID');
  await AsyncStorage.removeItem('email');
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('fullname');
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
