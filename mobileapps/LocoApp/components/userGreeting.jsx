import { View } from "react-native";

// Styles
import GreetingMessage from "../lib/greetingMessage";

// Componets
import Container from "./container";

// Styles
import { Title2, Title1 } from "../styles/typography";

export default function UserGreeting() {
  return (
    <Container style={{ flex: 1 }}>
      <View style={{ alignItems: "center" }}>
        <Title1>
          <GreetingMessage />
        </Title1>
        <Title2>John Smith</Title2>
      </View>
    </Container>
  );
}
