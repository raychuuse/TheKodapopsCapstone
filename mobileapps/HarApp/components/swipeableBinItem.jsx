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
  bin,
  rangeSelectIndex,
  longPressHandler,
  isSelected,
}) => {
  // Providers
  const { handleConsignBin, handleUpdateBinState } = useBins();

  // Reference for the Swipeable component to control swipe actions programmatically if needed
  const swipeableRef = useRef(null);

  const onBinRepair = () => {
      handleUpdateBinState(bin, 'REPAIR', !bin.repair);
  };

  const onBinMissing = () => {
      handleUpdateBinState(bin, 'MISSING', !bin.missing);
  };

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
            RepairBinAlert(`Bin #${bin.binID}`, bin, onBinRepair)}
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
        {/* Remove button */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#D32F2F' }]}
          onPress={() => {
            // Trigger haptic feedback and show remove alert
            Haptics.selectionAsync();
            RemoveBinAlert(`Bin #${bin.binID}`, bin, onBinMissing)}}
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
            bin.burnt
              ? styles.actionButtonGreen
              : styles.actionButtonBurnt,
            { width: 180 },
          ]}
          onPress={() => handleUpdateBinState(bin, 'BURNT', !bin.burnt)}
        >
          <MaterialCommunityIcons
            name={!bin.burnt ? 'fire' : 'leaf'}
            size={24}
            color='#fff'
          />
          <Headline style={styles.binText}>
            Mark as {bin.burnt ? 'Green' : 'Burnt'}
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
      handleUpdateBinState(bin, 'BURNT', !bin.burnt)
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
          rangeSelectIndex == index && {
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
          onLongPress={() => longPressHandler(index)}
        >
          {/* Check if bin is full and change icon accordingly */}
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
        {bin.repair ? (
          // Show repair icon if bin needs repair
          <Feather
            name='tool'
            size={24}
            color='#fff'
          />
        ) : null}
        {/* Show Full indicator if bin is full */}
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
