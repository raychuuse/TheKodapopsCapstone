import { View, StyleSheet } from "react-native";

// Import Style Components
import { Colours } from "../styles/colours";

const Divider = () => {
  return (
    <View
      style={StyleSheet.create({
        height: 1,
        width: "100%",
        backgroundColor: Colours.spDiv,
      })}
    />
  );
};

export default Divider;
