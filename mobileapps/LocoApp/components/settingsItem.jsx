import { View, StyleSheet, Text } from "react-native";

// Import Component
import Button from "./button";

// Import Style Components
import * as Type from "../styles/typography";
import { Colours } from "../styles/colours";

const SettingsItem = ({ type = "edit", body = "body", label = "label" }) => {
  return (
    <View style={styles.item}>
      <Type.Title3 style={styles.label}>{label}:</Type.Title3>
      <Text style={[Type.styles.body, styles.body]} numberOfLines={1}>
        {body}
      </Text>
      <Button
        iconName={type}
        iconColor={Colours.textLevel3}
        textColor={Colours.textLevel3}
        backgroundColor={Colours.bgLevel6}
        border
        borderWidth={1}
        iconSize={28}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    width: "100%",

    gap: 22,

    paddingHorizontal: 16,
    paddingVertical: 4,

    alignItems: "center",
  },
  button: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  body: {
    flex: 1,
    textTransform: "capitalize",
  },
  label: {
    textTransform: "capitalize",
  },
});

export default SettingsItem;
