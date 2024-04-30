import { React, forwardRef } from "react";
import { Pressable, Text, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colours } from "./colours";
import * as Haptics from "expo-haptics";

// Alternative button as a temporary fix, uses "pressable"
// Can alternate between this and other button if forwardRef is used
const AltButton = ({
  title = "",
  pressedTitle = title,
  onPress = () => alert("Button Pressed"),
  backgroundColor = "#4F12FA42",
  textColor = Colours.textLevel3,
  iconPosition = "left",
  iconName = "",
  iconSize = 24,
  iconColor = Colours.textLevel3,
  style = {},
  textStyle = {},
  border = false,
  borderWidth = 2,
}, ref) => {
  // Determine if the icon should be rendered and if title is provided
  const shouldRenderIcon = iconName !== "";
  const shouldRenderTitle = title !== "";

  // Function to render the icon component with adjusted style based on title presence
  const renderIcon = () =>
    shouldRenderIcon ? (
      <MaterialIcons name={iconName} size={iconSize} color={iconColor} style={[shouldRenderTitle ? (iconPosition === "left" ? styles.iconLeft : styles.iconRight) : styles.iconNoMargin]} />
    ) : null;

  return (
    <Pressable ref = {ref}
    onPress={() => {
        onPress();
        Haptics.selectionAsync();
    }}
    style={({pressed}) => [
        styles.button,
        { backgroundColor}, 
        { borderColor: textColor }, 
        { opacity: pressed ? 0.5 : 1},
        border ? { borderStyle: "solid" } : null, 
        border ? { borderWidth } : { borderWidth: 0 }, 
        style
    ]}>
    {({pressed}) => (
        <View style={[styles.buttonContent, !shouldRenderIcon && styles.buttonContentNoIcon]}>
            {iconPosition === "left" && renderIcon()}
            {shouldRenderTitle && <Text style={[styles.button_text, { color: textColor }, textStyle]}>{pressed ? title : pressedTitle}</Text>}
            {iconPosition === "right" && renderIcon()}
        </View>
    )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#4F12FA42",
    minWidth: 48,
    minHeight: 48,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    textTransform: "capitalize",
  },
  buttonContentNoIcon: {
    justifyContent: "center",
  },
  button_text: {
    fontSize: 20,
    fontWeight: "600",
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  iconNoMargin: {
    margin: 0, // Remove margin when there's no title
  },
});

export default forwardRef(AltButton);
