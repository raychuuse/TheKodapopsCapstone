import { Slot } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function HomeLayout() {
  return (
    <View style={styles.root}>
        <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: "#574294", flex: 1, position: "relative" },
});
