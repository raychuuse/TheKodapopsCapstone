import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Import Styling Components
import { Headline } from '../styles/typography';
import { useTheme } from '../styles/themeContext';

// Import Functions
import { RemoveBinAlert, RepairBinAlert } from '../lib/alerts';

// Import Provider
import { useRun } from '../context/runContext';

// Import Function
import { useSetIsFull, useSetIsBurnt, useSetIsDone } from '../lib/bins';

const SwipeableBinItem = ({
  index,
  isSelected,
  binNumber,
  binListName = 'binsDrop',
  sidingId,
  longPressHandler,
}) => {
  // Providers
  const { theme } = useTheme();
  const { getBin } = useRun();

  // Build Function Hooks
  const SetIsFull = useSetIsFull();
  const SetIsBurnt = useSetIsBurnt();
  const SetIsDone = useSetIsDone();

  // Data
  const binsKey = binListName == 'binsDrop';
  const binData = getBin(sidingId, binNumber, binsKey);

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
            color={theme.spAtSidingText}
          />
          <Headline style={{ color: theme.spAtSidingText }}>Repair</Headline>
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
            color={theme.spAtSidingText}
          />
          <Headline style={{ color: theme.spAtSidingText }}>Missing</Headline>
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
        <TouchableOpacity
          onPress={() => {
            SetIsFull(sidingId, binData.binNumber, binsKey);
            Haptics.selectionAsync();
          }}
          style={[
            styles.actionButton,
            binData.isFull
              ? { backgroundColor: theme.spCompleteBG }
              : { backgroundColor: theme.spPendingBG },
            { width: 150 },
          ]}
        >
          <MaterialCommunityIcons
            name={binData.isFull ? 'tray-full' : 'tray'}
            size={24}
            color={binData.isFull ? theme.spCompleteText : theme.spPendingText}
          />
          <Headline
            style={{
              color: binData.isFull
                ? theme.spCompleteText
                : theme.spPendingText,
              marginLeft: 'auto',
            }}
          >
            Mark {binData.isFull ? 'as Full' : 'Empty'}
          </Headline>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            binData.isBurnt
              ? { backgroundColor: theme.bgGreen }
              : { backgroundColor: theme.bgBurnt },
            { width: 138 },
          ]}
          onPress={() => {
            SetIsBurnt(sidingId, binData.binNumber, binsKey);
            Haptics.selectionAsync();
          }}
        >
          <MaterialCommunityIcons
            name={binData.isBurnt ? 'fire' : 'leaf'}
            size={24}
            color={theme.spAtSidingText}
          />
          <Headline style={{ color: theme.spAtSidingText, marginLeft: 'auto' }}>
            Mark {binData.isBurnt ? 'Green' : 'Burnt'}
          </Headline>
        </TouchableOpacity>
      </View>
    );
  };

  const renderLeftActions_old = () => {
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
            binData.isBurnt
              ? { backgroundColor: theme.bgGreen }
              : { backgroundColor: theme.bgBurnt },
            { width: 180 },
          ]}
        >
          <MaterialCommunityIcons
            name={binData.isBurnt ? 'fire' : 'leaf'}
            size={24}
            color={theme.spAtSidingText}
          />
          <Headline style={{ color: theme.spAtSidingText }}>
            Mark as {binData.isBurnt ? 'Green' : 'Burnt'}
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
      SetIsBurnt(sidingId, binNumber, binsKey);
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
    >
      <View
        style={[
          styles.binItem,
          isSelected == index && {
            borderColor: theme.spAtSidingText,
            borderWidth: 4,
            borderStyle: 'solid',
            paddingLeft: 4,
            paddingRight: 14,
            paddingVertical: 4,
          },
          { backgroundColor: theme.binItemBg },
          binData.isDone
            ? binData.isBurnt
              ? { backgroundColor: theme.binItemBurnt }
              : { backgroundColor: theme.binItemGreen }
            : null,
        ]}
      >
        <TouchableOpacity
          style={styles.binPressable}
          onPress={() => {
            SetIsDone(sidingId, binData.binNumber, binsKey);
          }}
          onLongPress={() => longPressHandler(binData.binNumber, index)}
        >
          <Feather
            style={[
              { color: theme.spAtSidingText },
              binData.isFull
                ? binData.isBurnt
                  ? { color: theme.binItemBurntText }
                  : { color: theme.binItemGreenText }
                : null,
            ]}
            name={binData.isDone ? 'check-circle' : 'circle'}
            size={24}
          />
          <Headline
            style={[
              { color: theme.spAtSidingText },
              binData.isFull
                ? binData.isBurnt
                  ? { color: theme.binItemBurntText }
                  : { color: theme.binItemGreenText }
                : null,
            ]}
          >
            Bin #{binData.binNumber}
          </Headline>
        </TouchableOpacity>
        {/* Edit Btn / Full Indicator */}
        {binData.isFull ? (
          <Headline
            style={[
              { color: theme.spAtSidingText },
              binData.isFull
                ? binData.isBurnt
                  ? { color: theme.binItemBurntText }
                  : { color: theme.binItemGreenText }
                : null,
            ]}
          >
            Full{binData.isBurnt ? ' | Burnt' : ''}
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
    alignItems: 'center',
  },
  binPressable: {
    flexDirection: 'row',
    flex: 1,
    gap: 32,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: 10,
  },
});

export default SwipeableBinItem;
