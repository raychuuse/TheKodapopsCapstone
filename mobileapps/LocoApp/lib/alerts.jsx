import { Alert } from 'react-native';
import { router } from 'expo-router';
import Toast from "react-native-toast-message";

export const FinishedAlert = () => {
  Alert.alert('Finished?', "\nAre you sure you're finished at this Siding?", [
    { text: "I'm not" },
    { text: 'Yes, I am!', onPress: router.back },
  ]);
};

export const RemoveBinAlert = (message, func) => {
  Alert.alert(
      'Confirm Missing Bin?',
      `\nAre you sure you want to report ${message} as missing?`,
      [{ text: "No, It's Here!"}, { text: 'Yes, Report', onPress: func}]
  );
};

export const RepairBinAlert = (message, func) => {
  Alert.alert(
      'Switch Bin Repair Status?',
      `\nAre you sure you want to request/ cancel a repair for #${message}?`,
      [{ text: "No, It's Fine!"}, { text: 'Yes, Request', onPress: func}]
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
}

export const showToast = (message, type) => {
  Toast.show({
    text1: message,
    type: type,
    visibilityTime: 4000,
    autoHide: true,
    position: 'bottom',
  });
}