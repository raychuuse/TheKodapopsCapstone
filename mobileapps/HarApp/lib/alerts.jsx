import { Alert } from 'react-native';
import { router } from 'expo-router';

export const FinishedAlert = () => {
  Alert.alert('Finished?', "\nAre you sure you're finished at this Siding?", [
    { text: "I'm not" },
    { text: 'Yes, I am!', onPress: router.back },
  ]);
};

export const RemoveBinAlert = (message) => {
  Alert.alert(
    'Confirm Missing Bin?',
    `\nAre you sure you want to report ${message} as missing?`,
    [{ text: "No, It's Here!" }, { text: 'Yes, Report' }]
  );
};

export const RepairBinAlert = (message) => {
  Alert.alert(
    'Confirm Bin Repair?',
    `\nAre you sure you want to request a repair for Bin #${message}?`,
    [{ text: "No, It's Fine!" }, { text: 'Yes, Request' }]
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