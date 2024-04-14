import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Import Styling Components
import { Headline } from '../styles/typography';
import { Colours } from '../styles/colours';

// Import Functions
import { RemoveBinAlert, RepairBinAlert } from '../lib/alerts';

// Import Mock Data
import { RunMockData } from '../data/RunMockData';

// Import Function
import { SetIsFull, SetIsBurnt } from '../lib/bins';

const SwipeableBinItem = ({
  binData = RunMockData[0].binsDrop[0],
  binListName = 'binsDrop',
  sidingId = RunMockData[0].id,
  runData = RunMockData,
  setRunData,
}) => {
  const [isChecked, setIsChecked] = useState(binData.isFull);
  const [isBurnt, setIsBurnt] = useState(binData.isBurnt);

  // Define the right actions for swipe
  const renderRightActions = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderTopRightRadius: 8,
          borderBottomRightRadius: 8,
          overflow: 'hidden',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            RepairBinAlert(binData.binNumber);
            Haptics.selectionAsync();
          }}
          style={[styles.actionButton, { backgroundColor: '#FFA000' }]}
        >
          <Feather
            name='tool'
            size={24}
            color='#fff'
          />
          <Headline style={styles.binText}>Repair</Headline>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#D32F2F' }]}
          onPress={() => {
            RemoveBinAlert(`Bin #${binData.binNumber}`);
            Haptics.selectionAsync();
          }}
        >
          <Feather
            name='help-circle'
            size={24}
            color='#fff'
          />
          <Headline style={styles.binText}>Missing</Headline>
        </TouchableOpacity>
      </View>
    );
  };

  // Define the left actions for swipe
  const renderLeftActions = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          overflow: 'hidden',
        }}
      >
        <View
          style={[
            styles.actionButton,
            isBurnt ? styles.actionButtonGreen : styles.actionButtonBurnt,
            { width: 180 },
          ]}
          onPress={() => {
            setIsBurnt(!isBurnt);
            SetIsBurnt(
              binData.binNumber,
              sidingId,
              runData,
              setRunData,
              binListName
            );
            Haptics.selectionAsync();
          }}
        >
          <MaterialCommunityIcons
            name={!isBurnt ? 'fire' : 'leaf'}
            size={24}
            color='#fff'
          />
          <Headline style={styles.binText}>
            Mark as {isBurnt ? 'Green' : 'Burnt'}
          </Headline>
        </View>
      </View>
    );
  };

  // Swipeable Reference
  const swipeableRef = useRef(null);

  // OnSwipeOpen Handler
  const onSwipeOpen = (direction) => {
    if (direction == 'left') {
      setIsBurnt(!isBurnt);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      swipeableRef.current.close();
    }
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      overshootLeft={false}
      overshootRight={false}
      ref={swipeableRef}
      onSwipeableOpen={('left', (direction) => onSwipeOpen(direction))}
    >
      <View
        style={[
          styles.binItem,
          isChecked
            ? isBurnt
              ? styles.binItemCaneBurnt
              : styles.binItemCaneGreen
            : null,
        ]}
      >
        <TouchableOpacity
          style={styles.binPressable}
          onPress={() => {
            SetIsFull(
              binData.binNumber,
              sidingId,
              runData,
              setRunData,
              binListName
            );
            setIsChecked(!isChecked);
          }}
        >
          <Feather
            style={[
              styles.binCheckBox,
              isChecked
                ? isBurnt
                  ? styles.binItemCaneBurnt
                  : styles.binItemCaneGreen
                : null,
            ]}
            name={isChecked ? 'check-circle' : 'circle'}
            size={24}
          />
          <Headline
            style={[
              styles.binText,
              isChecked
                ? isBurnt
                  ? styles.binItemCaneBurnt
                  : styles.binItemCaneGreen
                : null,
            ]}
          >
            Bin #{binData.binNumber}
          </Headline>
        </TouchableOpacity>
        {/* Edit Btn / Full Indicator */}
        {isChecked ? (
          <Headline
            style={[
              styles.binText,
              isChecked
                ? isBurnt
                  ? styles.binItemCaneBurnt
                  : styles.binItemCaneGreen
                : null,
            ]}
          >
            Full{isBurnt ? ' | Burnt' : ''}
          </Headline>
        ) : null}
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  binItem: {
    flexDirection: 'row',
    gap: 32,
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colours.binItemBg,
    alignItems: 'center',
  },
  binText: {
    color: Colours.spAtSidingText,
  },
  binPressable: {
    flexDirection: 'row',
    flex: 1,
    gap: 32,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  binCheckBox: {
    color: Colours.spAtSidingText,
  },
  binItemCaneGreen: {
    color: Colours.binItemGreenText,
    backgroundColor: Colours.binItemGreen,
  },
  binItemCaneBurnt: {
    color: Colours.binItemBurntText,
    backgroundColor: Colours.binItemBurnt,
  },
  actionButton: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: 10,
  },
  actionButtonGreen: { backgroundColor: '#8BC34A' },
  actionButtonBurnt: { backgroundColor: '#BF8A30' },
});

export default SwipeableBinItem;
