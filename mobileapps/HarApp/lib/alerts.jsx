import { Alert } from 'react-native';
import { router } from 'expo-router';
import Toast from "react-native-toast-message";

export const FinishedAlert = (func) => {
  Alert.alert('Finished?', "\nAre you sure you're finished at this Siding?", [
    {text: "I'm not"},
    {
      text: 'Yes, I am!', onPress: () => {
        func()
        router.back()
      }
    },
  ]);
};

export const RemoveBinAlert = (message, bin, func) => {
  Alert.alert(
    'Confirm Missing Bin?',
    `\nAre you sure you want to report ${message} as missing?`,
    [{ text: "No, It's Here!"}, { text: 'Yes, Report', onPress: func}]
      //func(binNum, !getFunc(binNum).isMissing)}}]
    );
};

export const RepairBinAlert = (message, bin, func) => {
  Alert.alert(
    bin.repair ? 'Cancel Repair' : 'Request Repair',
    `\nAre you sure you want to ${bin.repair ? 'cancel' : 'request'} repair for #${message}?`,
    [{ text: "No, It's Fine!"}, { text: 'Yes, ' + (bin.repair ? 'Cancel' : 'Request'), onPress: func}]
  );
};

export const issueAlert = (message) => {
  Alert.alert(
    'Sorry you have encountered a problem. See Details below.',
    `\n${message}`,
    [{ text: "OK" }]
  );
};

export const generalAlert = (message) => {
  Alert.alert(`See message below`, `\n${message}`, [{text: "OK"}]);
};

export const errorToast = (err) => {
  Toast.show({
    text1: err.message != null ? err.message : 'An unknown error occurred. Please try again.',
    type: 'error',
    visibilityTime: 4000,
    autoHide: true,
    position: 'bottom',
  });
};

export const showToast = (message, type) => {
  Toast.show({
    text1: message,
    type: type,
    visibilityTime: 4000,
    autoHide: true,
    position: 'bottom',
  });
};