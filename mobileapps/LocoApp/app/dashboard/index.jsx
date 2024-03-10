import { Text, View } from "react-native";
import { useEffect, useState } from "react";

// Styles
import { LargeTitle, Title2, Title1 } from "../../styles/typography";

// Components
import Container from "../../components/container";
import GreetingMessage from "../../lib/greetingMessage";
import Button from "../../components/button";

const Clock = () => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const time = new Date();
      setTime(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })); // Update the time every minute
    }, 60000); // 60000 milliseconds = 1 minute

    return () => clearInterval(intervalId); // Clear the interval on component unmount
  }, []);

  return `${time}`;
};

export default function Page() {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          borderWidth: 1,
          borderColor: "red",
          borderStyle: "solid",
          flexDirection: "row",
          paddingHorizontal: 16,
          gap: 32,
        }}>
        <Container>
          {/* Connection Status */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Button
              backgroundColor="transparent"
              iconName="sensors"
              iconSize={32}
              style={{ paddingVertical: 0, paddingHorizontal: 0 }}
            />
            <Title1>Loco #12</Title1>
          </View>
          {/* Clock */}
          <View>
            <Title2 style={{ textAlign: "center" }}>
              <Clock />
            </Title2>
          </View>
        </Container>
        <Container>
          <View style={{ alignItems: "center" }}>
            <Title1>
              <GreetingMessage />
            </Title1>
            <Title2>John Smith</Title2>
          </View>
        </Container>
        <Container marginLeft={"auto"}></Container>
      </View>
      <View style={{ flex: 1, borderWidth: 1, borderColor: "red", borderStyle: "solid" }}>
        <LargeTitle>The Dashboard Page</LargeTitle>
      </View>
    </View>
  );
}
