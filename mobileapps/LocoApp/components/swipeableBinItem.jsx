import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Import Styling Components
import { Headline } from '../styles/typography';
import { Colours } from '../styles/colours';

import {pickUpBin, dropOffBin} from '../api/runs.api';

// Import Functions
import { RemoveBinAlert, RepairBinAlert } from '../lib/alerts';

const SwipeableBinItem = ({
  bin,
  onBinSelected,
  type
}) => {
  const isChecked = type === 'PICKED_UP' ? bin.dropped_off_in_stop : bin.picked_up_in_stop;
  const message = type === 'PICKED_UP' ? 'Dropped Off' : 'Picked Up';
  const [isBurnt, setIsBurnt] = useState(bin.burnt);

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
            RepairBinAlert(bin.binNumber);
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
            RemoveBinAlert(`Bin #${bin.binNumber}`);
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
            bin.burnt = !isBurnt;
            setIsBurnt(!isBurnt);
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
    // TODO Remove
    swipeableRef.current.close();
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
            onBinSelected(bin);
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
            Bin #{bin.binID}
          </Headline>
        </TouchableOpacity>
        {/* Edit Btn / Full Indicator */}
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
          {(bin.dropped_off_in_stop || bin.picked_up_in_stop) && message + ' | '} {bin.full ? 'Full' : 'Empty'} {isBurnt ? ' | Burnt' : ''}
        </Headline>
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
