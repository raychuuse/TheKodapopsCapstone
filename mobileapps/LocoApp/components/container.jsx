import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { StyleSheet } from "react-native";

const Container = ({ children, style, marginLeft, marginRight, marginHorizontal, marginVertical, margin }) => {
  return (
    <BlurView
      intensity={100}
      style={{
        borderRadius: 16,
        overflow: "hidden",
        marginLeft: marginLeft,
        marginHorizontal: marginHorizontal,
        marginRight: marginRight,
        marginVertical: marginVertical,
        margin: margin,
      }}>
      <LinearGradient
        colors={["rgba(255,255,255,0.25)", "transparent"]}
        style={[
          {
            flexDirection: "column",
            paddingHorizontal: 12,
            paddingVertical: 8,
          },
          style,
        ]}>
        {children}
      </LinearGradient>
    </BlurView>
  );
};

export default Container;
