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
