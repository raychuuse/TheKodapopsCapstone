import { StatusBar } from "expo-status-bar";
import LoginPage from "../pages/login";
import { SafeAreaView } from "react-native";

export default function Page() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LoginPage />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
