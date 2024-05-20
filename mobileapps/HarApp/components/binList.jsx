import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Import Styles
import { Headline, LargeTitle, Title3 } from './typography';
import { Colours } from './colours';

// Import Components
import SwipeableBinItem from './swipeableBinItem';
import { useBins } from '../context/binContext';

const BinList = ({ openAddBinModal }) => {

  // ~ ~ ~ ~ ~ ~ ~ ~ List State ~ ~ ~ ~ ~ ~ ~ ~ //
  const [rangeSelectStartIndex, setRangeSelectStartIndex] = useState();
  const [isLocked, setIsLocked] = useState(false);
  const {handleConsignRange, getBins} = useBins();

  const bins = getBins();

  // ~ ~ ~ ~ ~ ~ ~ List Functions ~ ~ ~ ~ ~ ~ ~ //
  // Lock lits handeler for when then lock button is longPressed
  const toggleLock = () => {
    setIsLocked(!isLocked);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const longPressHandler = (index) => {
      if (rangeSelectStartIndex == null) {
          setRangeSelectStartIndex(index);
      } else {
          if (rangeSelectStartIndex === index) {
              setRangeSelectStartIndex(null);
          } else {
              handleConsignRange(rangeSelectStartIndex, index);
              setTimeout(() => setRangeSelectStartIndex(null), 1000); // States are annoying
          }
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // ~ ~ ~ ~ ~ ~ ~ List Components ~ ~ ~ ~ ~ ~ ~ //

  // Bin List component to renmder
  const listRenderItem = ({ item, index }) => {
    return (
      <SwipeableBinItem
        index={index}
        bin={item}
        rangeSelectIndex={rangeSelectStartIndex}
        longPressHandler={longPressHandler}
        style={{
          position: 'relative',
          paddingHorizontal: 8,
          paddingTop: 72,
          borderRadius: 16,
          backgroundColor: Colours.bgOverlay,
          zIndex: 0,
        }}
      />
    );
  };

  const listSeperator = () => {
    return (
      <View
        style={{
          width: '80%',
          height: 1,
          backgroundColor: Colours.spAtSidingText,
          marginVertical: 10,
          marginLeft: 'auto',
          marginRight: 'auto',
          opacity: 0.3,
        }}
      />
    );
  };

  const ListHeader = () => {
    return (
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
          <Title3>{bins?.length}</Title3>
          <Headline>{bins?.length > 1 ? 'Bins' : 'Bin'} at Siding</Headline>
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
              openAddBinModal(true);
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
    );
  };

  const LockView = () => {
    return (
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
        <LargeTitle style={{ color: Colours.bgLevel6 }}>Locked</LargeTitle>
      </BlurView>
    );
  };

  const listFooter = () => {
    return <View style={{ marginVertical: 40 }} />;
  };

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {/* Bin List Header */}
      <ListHeader />
      {/* Bin List Lock */}
      {isLocked && <LockView />}
      {/* Bin List Body */}
      <FlatList
        data={bins}
        renderItem={listRenderItem}
        style={{
          position: 'relative',
          paddingHorizontal: 8,
          paddingTop: 72,
          borderRadius: 16,
          backgroundColor: Colours.bgOverlay,
          zIndex: 0,
        }}
        ItemSeparatorComponent={listSeperator}
        ListFooterComponent={listFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default BinList;
