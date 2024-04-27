import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Import Styling Components
import { Headline } from './typography';
import { Colours } from './colours';

// Import Functions
import { RemoveBinAlert, RepairBinAlert } from '../lib/alerts';
import { useBins } from '../context/binContext';

const SwipeableBinItem = ({ index, binNumber, longPressHandler }) => {
  // Providers
  const { getBinData, setBinFull, setBinBurnt } = useBins();

  // ~ ~ ~ ~ ~ ~ ~ ~ Reference ~ ~ ~ ~ ~ ~ ~ ~ //
  // Swipeable Reference
  const swipeableRef = useRef(null);

  // ~ ~ ~ ~ ~ ~ ~ ~ Components ~ ~ ~ ~ ~ ~ ~ ~ //
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
            RepairBinAlert(binNumber);
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
            RemoveBinAlert(`Bin #${binNumber}`);
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
            getBinData(binNumber).isBurnt
              ? styles.actionButtonGreen
              : styles.actionButtonBurnt,
            { width: 180 },
          ]}
          onPress={() => setBinBurnt(binNumber, !getBinData(binNumber).isBurnt)}
        >
          <MaterialCommunityIcons
            name={!getBinData(binNumber).isBurnt ? 'fire' : 'leaf'}
            size={24}
            color='#fff'
          />
          <Headline style={styles.binText}>
            Mark as {getBinData(binNumber).isBurnt ? 'Green' : 'Burnt'}
          </Headline>
        </View>
      </View>
    );
  };

  // ~ ~ ~ ~ ~ ~ ~ Functions ~ ~ ~ ~ ~ ~ ~ //
  // OnSwipeOpen Handler
  const onSwipeOpen = (direction) => {
    if (direction == 'left') {
      setBinBurnt(binNumber, !getBinData(binNumber).isBurnt);
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
          getBinData(binNumber).isFull
            ? getBinData(binNumber).isBurnt
              ? styles.binItemCaneBurnt
              : styles.binItemCaneGreen
            : null,
        ]}
      >
        <TouchableOpacity
          style={styles.binPressable}
          onPress={() => {
            setBinFull(binNumber, !getBinData(binNumber).isFull);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          onLongPress={() => longPressHandler(binNumber, index)}
        >
          <Feather
            style={[
              styles.binCheckBox,
              getBinData(binNumber).isFull
                ? getBinData(binNumber).isBurnt
                  ? styles.binItemCaneBurnt
                  : styles.binItemCaneGreen
                : null,
            ]}
            name={getBinData(binNumber).isFull ? 'check-circle' : 'circle'}
            size={24}
          />
          <Headline
            style={[
              styles.binText,
              getBinData(binNumber).isFull
                ? getBinData(binNumber).isBurnt
                  ? styles.binItemCaneBurnt
                  : styles.binItemCaneGreen
                : null,
            ]}
          >
            Bin #{binNumber}
          </Headline>
        </TouchableOpacity>
        {/* Edit Btn / Full Indicator */}
        {getBinData(binNumber).isFull ? (
          <Headline
            style={[
              styles.binText,
              getBinData(binNumber).isFull
                ? getBinData(binNumber).isBurnt
                  ? styles.binItemCaneBurnt
                  : styles.binItemCaneGreen
                : null,
            ]}
          >
            Full{getBinData(binNumber).isBurnt ? ' | Burnt' : ''}
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
