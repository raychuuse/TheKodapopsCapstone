import { Slot } from "expo-router";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";

// Components
import BottomBar from "../../components/bottomBar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Body */}
      <Slot />
      {/* Nav Bar */}
      <BottomBar />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
