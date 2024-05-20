import { View, Animated, Dimensions } from 'react-native';
import React, { useRef, useState } from 'react';

// Components
import StatusIndicator from '../../components/statusIndicator';
import UserGreeting from '../../components/userGreeting';
import SelectedSiddingStats from '../../components/selectedSidingStats';
import SidingCard from '../../components/sidingCard';
import BottomBar from '../../components/bottomBar';

// Modals
import ModalSidingDetails from '../../components/modalSidingDetails';
import ModalSelectSiding from '../../components/modalSelectSiding';

// Import Mock Data
import { NotificationsMockData } from '../../data/NotificationsMockData';

// Import Providers
import { useTheme } from '../../styles/themeContext';
import { useRun } from '../../context/runContext';
import SidingListScrollBar from '../../components/sidingListScrollBar';

import {getRunById} from "../../api/runs.api";
import {getCurrentLoadById} from "../../api/loco.api";

export default function Page() {
  // Providers
  const { getStops } = useRun();
  const { theme } = useTheme();

  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [sidingCarouselWidth, setSidingCarouselWidth] = useState(0);

  const sidingListRef = useRef(null);
  const windowWidth = Dimensions.get('window').width;

  // Run Data for the Whole App
  const [notifications, setNotifications] = useState(NotificationsMockData);
  const stops = getStops();

  console.info('Index', stops);

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: theme.appBG,
        paddingTop: 32,
      }}
    >
      <ModalSidingDetails />
      <ModalSelectSiding />
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 32,
            gap: 16,
            justifyContent: 'center',
          }}
        >
          <StatusIndicator />
          <UserGreeting />
          <SelectedSiddingStats />
        </View>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 128,
            paddingVertical: 32,
            gap: 32,
          }}
        >
          <View
            onLayout={(event) =>
              setSidingCarouselWidth(event.nativeEvent.layout.width)
            }
            style={{
              flex: 1,
              backgroundColor: theme.containerGradient[0],
              borderRadius: 16,
              flexDirection: 'row',
            }}
          >
            <Animated.FlatList
              ref={sidingListRef}
              contentContainerStyle={{
                alignItems: 'center',
                paddingVertical: 10,
                gap: 16,
              }}
              snapToInterval={85}
              decelerationRate={0}
              scrollEventThrottle={16}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}
              bounces={false}
              horizontal={true}
              keyExtractor={(item) => item.stopID}
              data={stops}
              renderItem={({ item, index }) => {
                  console.info('item', item);
                  return (
                <SidingCard
                  stopID={item.stopID}
                  index={index}
                  scrollX={scrollX}
                  containerWidth={sidingCarouselWidth}
                />
              );}}
            />
          </View>
          <SidingListScrollBar
            data={runData.sidings}
            flatListRef={sidingListRef}
            containerWidth={sidingCarouselWidth}
          />
        </View>
      </View>
      {/* Nav Bar */}
      <BottomBar
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </View>
  );
}
