import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AuthProvider } from "../context/authContext";
export default function HomeLayout() {
  return (
    <View style={styles.root}>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: "#574294", flex: 1, position: "relative" },
});
