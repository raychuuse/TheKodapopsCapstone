import { Alert } from 'react-native';
import { router } from 'expo-router';

export const FinishedAlert = (data, func) => {
  Alert.alert('Finished?', "\nAre you sure you're finished at this Siding?", [
    { text: "I'm not" },
    { text: 'Yes, I am!', onPress: () => {
      if (!data) {
        func(data);
      }
      router.back();
    }},
  ]);
};

export const RemoveBinAlert = (message, binNum, func/*, getFunc*/) => {
  Alert.alert(
    'Confirm Missing Bin?',
    `\nAre you sure you want to report ${message} as missing?`,
    [{ text: "No, It's Here!"}, { text: 'Yes, Report', onPress: () => {func(binNum)}}]
      //func(binNum, !getFunc(binNum).isMissing)}}]
    );
};

export const RepairBinAlert = (message, binNum, func, getFunc) => {
  Alert.alert(
    'Switch Bin Repair Status?',
    `\nAre you sure you want to request/ cancel a repair for #${message}?`,
    [{ text: "No, It's Fine!"}, { text: 'Yes, Request', onPress: () => {func(binNum, !getFunc(binNum).isRepairNeeded)}}]
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