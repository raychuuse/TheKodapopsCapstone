import { Alert } from "react-native";
import { router } from "expo-router";

export const FinishedAlert = () => {
  Alert.alert("Finished?", "\nAre you sure you're finished for the day?", [
    { text: "I'm not" },
    { text: "Yes, I am!", onPress: router.back },
  ]);
};

export const RemoveBinAlert = (message) => {
  Alert.alert(
    "Are you sure?",
    `\nThis will remove the bin from the list.\n\nAre you sure ${message} \nis not at the siding?`,
    [{ text: "Yes, Remove" }, { text: "No, Keep!" }]
  );
};
