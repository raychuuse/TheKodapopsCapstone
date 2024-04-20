import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

// Import Components
import GreetingMessage from '../components/greetingMessage';
import Button from '../components/button';
import CustomModal from '../components/modal';
import SwipeableBinItem from '../components/swipeableBinItem';
import SelectedSiding from '../components/selectedSiding';
import AddBinCamera from '../components/addBinCamera';
import NetworkIndicator from '../components/networkIndicator';

//Import Functions
import { FinishedAlert } from '../lib/alerts';

// Import Styling Components
import { LargeTitle, Title1, Headline, Title3 } from '../components/typography';
import { Colours } from '../components/colours';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MainPage = () => {
  // Test Bin data
  let BinData = [
    { isFull: false, binNum: 2141, isBurnt: false },
    { isFull: true, binNum: 2123, isBurnt: true },
    { isFull: false, binNum: 1232, isBurnt: false },
    { isFull: true, binNum: 1234, isBurnt: false },
    { isFull: true, binNum: 5637, isBurnt: false },
    { isFull: false, binNum: 5633, isBurnt: false },
    { isFull: false, binNum: 654, isBurnt: false },
    { isFull: false, binNum: 12, isBurnt: false },
    { isFull: false, binNum: 2345, isBurnt: false },
    { isFull: false, binNum: 7545, isBurnt: false },
    { isFull: false, binNum: 8765, isBurnt: false },
    { isFull: false, binNum: 2334, isBurnt: false },
    { isFull: false, binNum: 4632, isBurnt: false },
  ];

  const [addBinVisable, setAddBinVisable] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const toggleLock = () => {
    setIsLocked(!isLocked);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={styles.body}>
      {/* Add Bin Modal */}
      <CustomModal
        isVisible={addBinVisable}
        onClose={() => setAddBinVisable(false)}
        buttonIcon='close-circle-outline'
        style={{ height: '60%', marginTop: 56 }}
      >
        <AddBinCamera modalCloser={() => setAddBinVisable(false)} />
      </CustomModal>
      {/* Page Headings */}
      <View style={styles.page_heading}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
          }}
        >
          <NetworkIndicator
            style={{ position: 'absolute', left: 0, top: -16 }}
          />
          <LargeTitle>
            <GreetingMessage />
          </LargeTitle>
        </View>
        <Title1>John Smith</Title1>
      </View>
      {/* Page Content */}
      <View style={styles.content}>
        {/* Selected Siding */}
        <SelectedSiding sidingName='Old Creek Rd' />
        {/* Bin List */}
        <View
          style={{
            flex: 1,
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {/* Bin List Header */}
          <View
            style={{
              width: '100%',
              position: 'absolute',
              paddingVertical: 12,
              paddingLeft: 24,
              paddingRight: 12,
              alignItems: 'center',
              flexDirection: 'row',
              gap: 12,
              backgroundColor: 'rgb(235, 235, 235)',
              zIndex: 100,
              borderRadius: 12,
              zIndex: 3,
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                gap: 16,
                alignItems: 'center',
              }}
            >
              <Title3>{BinData.length}</Title3>
              <Headline>
                {BinData.length > 1 ? 'Bins' : 'Bin'} at Siding
              </Headline>
            </View>
            <TouchableOpacity
              onLongPress={() => toggleLock()}
              style={{
                backgroundColor: '#4F12FA42',
                padding: 8,
                borderRadius: 8,
                alignItems: 'center',
                flexDirection: 'row',
              }}
            >
              <MaterialCommunityIcons
                name={isLocked ? 'lock' : 'lock-open-outline'}
                size={24}
              />
              {isLocked ? <Text>Locked</Text> : null}
            </TouchableOpacity>
            {isLocked ? null : (
              <TouchableOpacity
                onPress={() => {
                  setAddBinVisable(true);
                  Haptics.selectionAsync();
                }}
                style={{
                  backgroundColor: '#4F12FA42',
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <MaterialCommunityIcons
                  name={'plus-circle-outline'}
                  size={24}
                />
              </TouchableOpacity>
            )}
          </View>
          {/* Bin List Lock */}
          {isLocked ? (
            <BlurView
              intensity={10}
              style={{
                position: 'absolute',
                backgroundColor: Colours.bgOverlay,
                zIndex: 1,
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MaterialCommunityIcons
                name='lock'
                size={34}
                color={Colours.bgLevel6}
              />
              <LargeTitle style={{ color: Colours.bgLevel6 }}>
                Locked
              </LargeTitle>
            </BlurView>
          ) : null}
          {/* Bin List Body */}
          <FlatList
            data={BinData}
            renderItem={({ item }) => (
              <SwipeableBinItem
                checked={item.isFull}
                binNumber={item.binNum}
                style={styles.binList}
                burnt={item.isBurnt}
              />
            )}
            style={styles.binList}
            ItemSeparatorComponent={<View style={styles.binListSeparator} />}
            ListFooterComponent={<View style={{ marginVertical: 40 }} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <Button
        title='Done'
        style={StyleSheet.create({ width: '100%' })}
        onPress={FinishedAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  binListSeparator: {
    width: '80%',
    height: 1,
    backgroundColor: Colours.spAtSidingText,
    marginVertical: 10,
    marginLeft: 'auto',
    marginRight: 'auto',
    opacity: 0.3,
  },
  binList: {
    position: 'relative',
    paddingHorizontal: 8,
    paddingTop: 72,
    borderRadius: 16,
    backgroundColor: Colours.bgOverlay,
    zIndex: 0,
  },
  body: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    borderRadius: 32,
    padding: 16,
    paddingTop: 32,
    gap: 16,
    marginTop: 8,
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
    width: '100%',
    gap: 8,
  },
  page_heading: {
    alignItems: 'center',
    width: '100%',
  },
});

export default MainPage;
