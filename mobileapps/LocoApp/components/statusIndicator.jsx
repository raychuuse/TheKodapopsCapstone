import { View } from "react-native";

// Components
import Container from "./container";
import Clock from "../lib/clock";
import NetworkIndicator from "./networkIndicator";

// Styles
import { Title2, Title1 } from "../styles/typography";

export default function StatusIndicator() {
  return (
    <Container style={{ flexDirection: "row" }}>
      <NetworkIndicator style={{ paddingRight: 12 }} />

      {/* Config Status */}
      <View style={{ paddingHorizontal: 24 }}>
        <Title1>Loco #12</Title1>
        <View>
          <Title2 style={{ textAlign: "center" }}>
            <Clock />
          </Title2>
        </View>
      </View>
    </Container>
  );
}
