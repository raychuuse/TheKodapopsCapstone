import { StatusBar } from "expo-status-bar";
import LogInPage from "../pages/login";
import { SafeAreaView } from "react-native";

export default function Page() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LogInPage />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
