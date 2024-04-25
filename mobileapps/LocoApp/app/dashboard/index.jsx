import { View, Animated } from 'react-native';
import React, { useState } from 'react';

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
import { RunMockData } from '../../data/RunMockData';
import { NotificationsMockData } from '../../data/NotificationsMockData';

// Import Styles
import { useTheme } from '../../styles/themeContext';

export default function Page() {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const [sidingCarouselWidth, setSidingCarouselWidth] = useState(0);

  // Run Data for the Whole App
  const [runData, setRunData] = useState(RunMockData);
  const [notifications, setNotifications] = useState(NotificationsMockData);

  // Modal State
  const [modalSidingVisible, setModalSidingVisible] = useState(false);
  const [modalSelectSidingVisible, setModalSelectSidingVisible] =
    useState(false);
  const [selectedSidingID, setSelectedSidingID] = useState(3);
  const [sidingToViewID, setSidingToViewID] = useState(2);

  const { theme, toggleTheme } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        backgroundColor: theme.appBG,
        paddingTop: 32,
      }}
    >
      <ModalSidingDetails
        isVisible={modalSidingVisible}
        onClose={() => setModalSidingVisible(!modalSidingVisible)}
        setRunData={setRunData}
        runData={runData}
        sidingToViewID={sidingToViewID}
      />
      <ModalSelectSiding
        isVisible={modalSelectSidingVisible}
        onClose={() => setModalSelectSidingVisible(!modalSelectSidingVisible)}
        setRunData={setRunData}
        runData={runData}
      />
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
          <SelectedSiddingStats
            runData={runData}
            selectedSidingID={selectedSidingID}
            openSidingDetailsModal={() => {
              setSidingToViewID(selectedSidingID);
              setModalSidingVisible(true);
            }}
            openSidingSelectModal={() => {
              setModalSelectSidingVisible(true);
            }}
          />
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
              data={runData.sidings}
              renderItem={({ item, index }) => (
                <SidingCard
                  isCompleted={item.isCompleted}
                  isSelected={item.isSelected}
                  name={item.name}
                  drop={item.binsDrop.length}
                  collect={item.binsCollect.length}
                  index={index}
                  scrollX={scrollX}
                  containerWidth={sidingCarouselWidth}
                  listLength={runData.sidings.length}
                  onPress={() => {
                    setSidingToViewID(item.id);
                    setModalSidingVisible(true);
                  }}
                />
              )}
            />
          </View>
          <View
            style={{
              minHeight: 56,
              backgroundColor: theme.containerGradient[0],
              borderRadius: 16,
            }}
          ></View>
        </View>
      </View>
      {/* Nav Bar */}
      <BottomBar
        runData={runData}
        setRunData={setRunData}
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </View>
  );
}
