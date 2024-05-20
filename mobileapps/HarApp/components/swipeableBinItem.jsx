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

/**
 * SwipeableBinItem Component
 * This component renders a swipeable list item representing a bin, with options to mark it for repair or remove it.
 * @param {Object} props - Component props
 * @param {number} props.index - Index of the bin item in the list
 * @param {string} props.binNumber - Bin number to display
 * @param {function} props.longPressHandler - Function to handle long press on the bin item
 * @param {boolean} props.isSelected - Boolean indicating if the bin item is selected
 * @returns {React.ReactElement} SwipeableBinItem component
 */
const SwipeableBinItem = ({
  index,
  binNumber,
  longPressHandler,
  isSelected,
}) => {
  // Context to get bin-related functions and data
  const {
    getBinData,
    setBinFull,
    setBinBurnt,
    deleteBin,
    flagBin,
    setBinMissing,
    setBinToRepair,
    checkRepair,
    getExceptionBinData,
  } = useBins();

  // Reference for the Swipeable component to control swipe actions programmatically if needed
  const swipeableRef = useRef(null);

  /**
   * Function to render the right swipe actions (Repair and Remove)
   * @returns {React.ReactElement} - JSX to render right swipe actions
   */
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
        {/* Repair button */}
        <TouchableOpacity
          onPress={() => {
            // Trigger haptic feedback and show repair alert
            Haptics.selectionAsync();
            RepairBinAlert(
              `Bin #${binNumber}`,
              binNumber,
              setBinToRepair,
              getBinData
            );
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
        {/* Remove button */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#D32F2F' }]}
          onPress={() => {
            // Trigger haptic feedback and show remove alert
            Haptics.selectionAsync();
            RemoveBinAlert(`Bin #${binNumber}`, binNumber, deleteBin);
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

  /**
   * Function to render the left swipe actions (Full and Burnt)
   * @returns {React.ReactElement} - JSX to render left swipe actions
   */
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
        {/* Mark as Full/Burnt button */}
        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
    );
  };

  /**
   * Function to handle swipe open action
   * @param {string} direction - Direction of the swipe
   */
  const onSwipeOpen = (direction) => {
    if (direction == 'left') {
      // Mark bin as burnt/unburnt and trigger haptic feedback
      setBinBurnt(binNumber, !getBinData(binNumber).isBurnt);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      swipeableRef.current.close(); // Close the swipeable component
    }
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions} // Function to render right swipe actions
      renderLeftActions={renderLeftActions} // Function to render left swipe actions
      overshootLeft={false} // Disable overshoot effect on the left swipe
      overshootRight={false} // Disable overshoot effect on the right swipe
      ref={swipeableRef} // Reference to control the swipeable component
      onSwipeableOpen={(direction) => onSwipeOpen(direction)} // Handle swipe open action
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
          onLongPress={() => longPressHandler(binNumber, index)} // Handle long press action
        >
          {/* Check if bin is full and change icon accordingly */}
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
        {getBinData(binNumber).isRepairNeeded ? (
          // Show repair icon if bin needs repair
          <Feather
            name='tool'
            size={24}
            color='#fff'
          />
        ) : null}
        {/* Show Full indicator if bin is full */}
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

// Styles for the component
const styles = StyleSheet.create({
  binItem: {
    flexDirection: 'row', // Layout children in a row
    gap: 32, // Space between children
    paddingLeft: 8, // Left padding
    paddingRight: 16, // Right padding
    paddingVertical: 8, // Top and bottom padding
    borderRadius: 8, // Rounded corners
    backgroundColor: Colours.binItemBg, // Background color
    alignItems: 'center', // Align items to center
  },
  binText: {
    color: Colours.spAtSidingText, // Text color
  },
  binPressable: {
    flexDirection: 'row', // Layout children in a row
    flex: 1, // Flex to fill available space
    gap: 32, // Space between children
    paddingHorizontal: 8, // Horizontal padding
    paddingVertical: 8, // Vertical padding
  },
  binCheckBox: {
    color: Colours.spAtSidingText, // CheckBox color
  },
  binItemCaneGreen: {
    color: Colours.binItemGreenText, // Text color for green bin
    backgroundColor: Colours.binItemGreen, // Background color for green bin
  },
  binItemCaneBurnt: {
    color: Colours.binItemBurntText, // Text color for burnt bin
    backgroundColor: Colours.binItemBurnt, // Background color for burnt bin
  },
  actionButton: {
    flexDirection: 'row', // Layout children in a row
    padding: 10, // Padding
    justifyContent: 'center', // Center content horizontally
    alignItems: 'center', // Center content vertically
    height: '100%', // Full height
    gap: 10, // Space between children
  },
  actionButtonGreen: { backgroundColor: '#8BC34A' }, // Background color for green action button
  actionButtonBurnt: { backgroundColor: '#BF8A30' }, // Background color for burnt action button
});

export default SwipeableBinItem;
