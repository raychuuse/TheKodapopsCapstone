import { Alert } from 'react-native';
import { router } from 'expo-router';

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