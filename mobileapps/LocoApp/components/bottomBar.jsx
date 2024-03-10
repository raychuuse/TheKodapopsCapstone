import { View } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

// Styles
import { Colours } from "../styles/colours";

// Components
import NotificationBell from "./notificationBell";
import Button from "./button";

const BottomBar = () => {
  return (
    <BlurView intensity={100}>
      <LinearGradient
        colors={["rgba(255,255,255,0.25)", "transparent"]}
        style={{
          flexDirection: "row",
          paddingLeft: 32,
          paddingRight: 16,
          paddingTop: 4,
        }}>
        <NotificationBell
          backgroundColor="transparent"
          iconColor={Colours.textLevel3}
          notificationCount={5}
          iconSize={48}
        />
        <View style={{ marginStart: "auto", flexDirection: "row", gap: 8 }}>
          <Button backgroundColor="transparent" iconName="route" iconSize={48} />
          <Button backgroundColor="transparent" iconName="settings" iconSize={48} />
          <Button backgroundColor="transparent" iconName="help" iconSize={48} />
        </View>
      </LinearGradient>
    </BlurView>
  );
};

export default BottomBar;
