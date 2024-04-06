import { View } from "react-native";

// Components
import StatusIndicator from "../../components/statusIndicator";
import UserGreeting from "../../components/userGreeting";
import SelectedSiddingStats from "../../components/selectedSidingStats";
import SidingCard from "../../components/sidingCard";

export default function Page() {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 32,
          gap: 16,
          justifyContent: "center",
        }}>
        <StatusIndicator />
        <UserGreeting />
        <SelectedSiddingStats />
      </View>
      <View style={{ flex: 1, paddingHorizontal: 128, paddingVertical: 32, gap: 32 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.6)",
            borderRadius: 16,
            flexDirection: "row",
          }}>
          <SidingCard isCompleted />
          <SidingCard isSelected />
          <SidingCard />
        </View>
        <View
          style={{
            minHeight: 56,
            backgroundColor: "rgba(255,255,255,0.6)",
            borderRadius: 16,
          }}></View>
      </View>
    </View>
  );
}
