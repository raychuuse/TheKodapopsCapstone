import { View, Animated, Text } from 'react-native';
import React, {useEffect, useState} from 'react';

// Components
import StatusIndicator from '../../components/statusIndicator';
import UserGreeting from '../../components/userGreeting';
import SelectedSiddingStats from '../../components/selectedSidingStats';
import SidingCard from '../../components/sidingCard';
import BottomBar from '../../components/bottomBar';

// Import Mock Data
import { RunMockData } from '../../data/RunMockData';
import { NotificationsMockData } from '../../data/NotificationsMockData';

import {getRunById} from "../../api/runs.api";
import {getCurrentLoadById} from "../../api/loco.api";

export default function Page() {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [sidingCarouselWidth, setSidingCarouselWidth] = useState(0);

  // Run Data for the Whole App
  const [loco, setLoco] = useState();
  const [run, setRun] = useState();
  const [notifications, setNotifications] = useState(NotificationsMockData);

  useEffect(() => {
      getRunById(1)
          .then(response => {
              setRun(response);
          })
          .catch(err => {
              console.error(err);
          });
  }, []);

  return (
    <>
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
              backgroundColor: 'rgba(255,255,255,0.6)',
              borderRadius: 16,
              flexDirection: 'row',
            }}
          >
            {run != null && loco != null && <Animated.FlatList
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
              keyExtractor={(item) => item.id}
              data={run.stops}
              renderItem={({ item, index }) => (
                <SidingCard
                  isCompleted={false}
                  isSelected={item.isSelected}
                  name={item.sidingName}
                  drop={item.drop_off_quantity}
                  collect={item.collect_quantity}
                  index={index}
                  scrollX={scrollX}
                  containerWidth={sidingCarouselWidth}
                  listLength={run.stops.length}
                />
              )}
            />}
          </View>
          <View
            style={{
              minHeight: 56,
              backgroundColor: 'rgba(255,255,255,0.6)',
              borderRadius: 16,
            }}
          ></View>
        </View>
      </View>
      {/* Nav Bar */}
      {run != null && <BottomBar
        run={run}
        setRun={setRun}
        notifications={notifications}
        setNotifications={setNotifications}
      />}
    </>
  );
}
