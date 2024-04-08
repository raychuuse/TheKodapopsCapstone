import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  UIManager,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colours } from '../styles/colours';
import { Title2 } from '../styles/typography';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const window = Dimensions.get('window');
// 30% of the window height, with a minimum of 150 units
const calculatedHeight = Math.max(window.height * 0.3, 150);

const RunSheetAccordionItem = ({
  id,
  isExpanded,
  onToggle,
  sidingName = 'Siding Name',
  collect = 58,
  drop = 58,
  isComplete = false,
  isSelected = false,
}) => {
  const animatedHeight = useRef(new Animated.Value(0)).current; // Initial height is 0 for collapsed state
  const rotation = useRef(new Animated.Value(0)).current; // For icon rotation

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedHeight, {
      toValue: isExpanded ? calculatedHeight : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View
      style={[
        styles.itemContainer,
        isComplete
          ? styles.itemContatinerComplete
          : isSelected
          ? styles.itemContatinerSelected
          : null,
      ]}
    >
      {/* Accordion Body Toggle Button */}
      <TouchableOpacity
        onPress={onToggle}
        style={styles.toggleButton}
      >
        {/* Header */}
        <View style={styles.HeaderContainer}>
          {/* Selected/Completed Siding Button */}
          <TouchableOpacity disabled={isComplete}>
            <MaterialCommunityIcons
              size={28}
              name={
                isComplete
                  ? 'checkbox-marked-circle-outline'
                  : isSelected
                  ? 'star-circle-outline'
                  : 'checkbox-blank-circle-outline'
              }
              color={Colours.textLevel3}
            />
          </TouchableOpacity>
          {/* Siding Name */}
          <Title2 style={{ flex: 1 }}>{sidingName}</Title2>

          <View style={styles.binBumberContainer}>
            {/* Drop Number */}
            <View style={styles.binNumberItem}>
              <MaterialCommunityIcons
                name='tray-arrow-down'
                size={24}
                color={Colours.textLevel3}
              />
              <Title2>{drop}</Title2>
            </View>

            {/* Collect Number */}
            <View style={styles.binNumberItem}>
              <MaterialCommunityIcons
                name='tray-arrow-up'
                size={24}
                color={Colours.textLevel3}
              />
              <Title2>{collect}</Title2>
            </View>
          </View>

          {/* Accordion Toggle Icon */}
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <MaterialCommunityIcons
              name='chevron-down'
              size={36}
              color={Colours.textLevel3}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Accordion Body */}
      <Animated.View style={{ height: animatedHeight, overflow: 'hidden' }}>
        <View></View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  binBumberContainer: { flexDirection: 'row', gap: 16 },
  binNumberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemContainer: {
    padding: 4,
    backgroundColor: Colours.bgLevel6,
    borderRadius: 10,
  },
  itemContatinerComplete: {
    backgroundColor: Colours.spComplete,
  },
  itemContatinerSelected: {
    backgroundColor: Colours.spSelected,
  },
  HeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 32,
  },
  toggleButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingVertical: 2,
    paddingLeft: 2,
    paddingRight: 6,
    borderRadius: 10,
    minWidth: 30,
    minHeight: 30,
  },
});

export default RunSheetAccordionItem;
