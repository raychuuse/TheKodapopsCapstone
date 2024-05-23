import { View } from "react-native";

// Components
import Container from "./container";
import Clock from "../lib/clock";
import NetworkIndicator from "./networkIndicator";

// Styles
import { Title2, Title1 } from "../styles/typography";
import { useRun } from '../context/runContext';

export default function StatusIndicator() {
  const {getLoco} = useRun();

  const loco = getLoco();

  return (
    <Container style={{ flexDirection: "row" }}>
      <NetworkIndicator style={{ paddingRight: 12 }} />

      {/* Config Status */}
      <View style={{ paddingHorizontal: 24 }}>
        <Title1>{loco != null ? loco.locoName : ''}</Title1>
        <View>
          <Title2 style={{ textAlign: "center" }}>
            <Clock />
          </Title2>
        </View>
      </View>
    </Container>
  );
}
