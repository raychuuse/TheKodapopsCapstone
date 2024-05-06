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


const SwipeableBinItem = ({
  index,
  bin,
  longPressHandler,
  isSelected,
}) => {
  // Providers
  const { setBinFull, setBinBurnt, deleteBin, flagBin,
    setBinMissing, setBinToRepair, checkRepair, getExceptionBinData, handleConsignBin } = useBins();

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
            Haptics.selectionAsync();
            RepairBinAlert(`Bin #${binNumber}`, binNumber, setBinToRepair, getBinData);}
          }
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
            Haptics.selectionAsync();
            RemoveBinAlert(`Bin #${binNumber}`, binNumber, deleteBin);}}
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
            bin.burnt
              ? styles.actionButtonGreen
              : styles.actionButtonBurnt,
            { width: 180 },
          ]}
          onPress={() => setBinBurnt(bin.binID, !bin.burnt)}
        >
          <MaterialCommunityIcons
            name={!bin.burnt ? 'fire' : 'leaf'}
            size={24}
            color='#fff'
          />
          <Headline style={styles.binText}>
            Mark as {bin.burnt ? 'Green' : 'Burnt'}
          </Headline>
        </View>
      </View>
    );
  };

  // ~ ~ ~ ~ ~ ~ ~ Functions ~ ~ ~ ~ ~ ~ ~ //
  // OnSwipeOpen Handler
  const onSwipeOpen = (direction) => {
    if (direction == 'left') {
      setBinBurnt(bin.binID, !bin.burn);
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
          isSelected == index && {
            borderColor: Colours.spAtSidingText,
            borderWidth: 4,
            borderStyle: 'solid',
            paddingLeft: 4,
            paddingRight: 14,
            paddingVertical: 4,
          },
          bin.full
            ? bin.burnt
              ? styles.binItemCaneBurnt
              : styles.binItemCaneGreen
            : null,
        ]}
      >
        <TouchableOpacity
          style={styles.binPressable}
          onPress={() => {
            handleConsignBin(bin);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
          onLongPress={() => longPressHandler(binNumber, index)}
        >
          <Feather
            style={[
              styles.binCheckBox,
              bin.full
                ? bin.burnt
                  ? styles.binItemCaneBurnt
                  : styles.binItemCaneGreen
                : null,
            ]}
            name={bin.full ? 'check-circle' : 'circle'}
            size={24}
          />
          <Headline
            style={[
              styles.binText,
              bin.full
                ? bin.burnt
                  ? styles.binItemCaneBurnt
                  : styles.binItemCaneGreen
                : null,
            ]}
          >
            Bin #{bin.binID}
          </Headline>
        </TouchableOpacity>
        {/* Edit Btn / Full Indicator */}
        {bin.full ? (
          <Headline
            style={[
              styles.binText,
              bin.full
                ? bin.burnt
                  ? styles.binItemCaneBurnt
                  : styles.binItemCaneGreen
                : null,
            ]}
          >
            Full{bin.burnt ? ' | Burnt' : ''}
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
