import { View, StyleSheet } from "react-native";

// Import Style Components
import { Colours } from "./colours";

const Divider = ({ style }) => {
  return (
    <View
      style={[
        {
          height: 1,
          width: "100%",
          backgroundColor: Colours.spDiv,
        },
        style,
      ]}
    />
  );
};

export default Divider;
