import { View, Animated, Text } from "react-native";
import React, { useState } from "react";

// Components
import StatusIndicator from "../../components/statusIndicator";
import UserGreeting from "../../components/userGreeting";
import SelectedSiddingStats from "../../components/selectedSidingStats";
import SidingCard from "../../components/sidingCard";

const sidingData = [
  {
    id: 1,
    isCompleted: true,
    isSelected: false,
    name: "Siding #1",
    drop: 5,
    collect: 10,
  },
  {
    id: 2,
    isCompleted: false,
    isSelected: false,
    name: "Siding #2",
    drop: 5,
    collect: 10,
  },
  {
    id: 3,
    isCompleted: false,
    isSelected: true,
    name: "Siding #3",
    drop: 5,
    collect: 10,
  },
  {
    id: 4,
    isCompleted: false,
    isSelected: false,
    name: "Siding #4",
    drop: 5,
    collect: 10,
  },
  {
    id: 5,
    isCompleted: false,
    isSelected: false,
    name: "Siding #5",
    drop: 5,
    collect: 10,
  },
  {
    id: 6,
    isCompleted: false,
    isSelected: false,
    name: "Siding #6",
    drop: 5,
    collect: 10,
  },
  {
    id: 7,
    isCompleted: false,
    isSelected: false,
    name: "Siding #7",
    drop: 5,
    collect: 10,
  },
];

export default function Page() {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [sidingCarouselWidth, setSidingCarouselWidth] = useState(0);

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
          onLayout={(event) => setSidingCarouselWidth(event.nativeEvent.layout.width)}
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.6)",
            borderRadius: 16,
            flexDirection: "row",
          }}>
          <Animated.FlatList
            contentContainerStyle={{ alignItems: "center", paddingVertical: 10, gap: 16 }}
            snapToInterval={85}
            decelerationRate={0}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
            bounces={false}
            horizontal={true}
            keyExtractor={(item) => item.id}
            data={sidingData}
            renderItem={({ item, index }) => (
              <SidingCard
                isCompleted={item.isCompleted}
                isSelected={item.isSelected}
                name={item.name}
                drop={item.drop}
                collect={item.collect}
                index={index}
                scrollX={scrollX}
                containerWidth={sidingCarouselWidth}
                listLength={sidingData.length}
              />
            )}
          />
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
