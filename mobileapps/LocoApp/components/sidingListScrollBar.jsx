import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { useTheme } from '../styles/themeContext';
import { useModal } from '../context/modalContext';

const CustomScrollbar = ({ stops = [], flatListRef }) => {
  const dotSize = 24;
  const spaceBetweenDots = 32;
  const windowWidth = Dimensions.get('window').width;

  // Providers
  const { theme } = useTheme();
  const { selectedSidingID, setSelectedSidingID } = useModal(); // Assuming a setter function for demonstration

  // Calculate total width of dots and spaces
  const totalDotsWidth =
    stops.length * (dotSize + spaceBetweenDots) - spaceBetweenDots;

  // Determine if the dots should be centered
  const shouldCenterDots = totalDotsWidth < windowWidth;

  // Handle dot press
  const onDotPress = (item, index) => {
    // Scroll the FlatList to the corresponding item
    flatListRef.current?.scrollToIndex({
      index: index,
      animated: true,
      viewPosition: 0.5, // Optionally center the item in the view
    });
  };

  return (
    <View
      style={[
        styles.scrollBarContainer,
        { backgroundColor: theme.containerGradient[0] },
        shouldCenterDots ? styles.centerDots : {},
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollBar,
          shouldCenterDots ? { justifyContent: 'center', flex: 1 } : {},
        ]}
      >
        {stops.map((item, index) => {
          const dotStyles =
              item.collectComplete && item.dropOffComplete
            ? {
                backgroundColor: theme.spComplete,
                borderColor: theme.spCompleteBorder,
              }
            : item.id == selectedSidingID
            ? {
                backgroundColor: theme.spSelected,
                borderColor: theme.spSelectedBorder,
              }
            : {
                backgroundColor: theme.spPending,
                borderColor: theme.spPendingBorder,
              };
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onDotPress(item, index)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: spaceBetweenDots / 2,
              }}
            >
              <View
                style={[
                  {
                    borderStyle: 'solid',
                    borderTopWidth: 2,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderRadius: 12,
                    width: dotSize,
                    height: dotSize,
                  },
                  dotStyles,
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollBarContainer: {
    height: 60, // Increase height for better touch area
    marginTop: 10,
    paddingHorizontal: 16, // Padding to ensure dots are not cut off
    borderRadius: 16,
  },
  scrollBar: {
    alignItems: 'center', // Center dots vertically in the container
  },
  centerDots: {
    justifyContent: 'center', // Center content horizontally when there are few dots
  },
});

export default CustomScrollbar;
