import { LinearGradient } from "expo-linear-gradient";

const Container = ({ children, style, marginLeft, marginRight, marginHorizontal, marginVertical, margin }) => {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.7)", "rgba(255,255,255,0.4)"]}
      style={[
        {
          borderRadius: 16,
          flexDirection: "column",
          paddingHorizontal: 12,
          paddingVertical: 8,
        },
        style,
      ]}>
      {children}
    </LinearGradient>
  );
};

export default Container;
