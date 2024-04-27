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

// Import Mock Data
import { RunMockData } from '../data/RunMockData';

// Import Function
import { SetIsFull, SetIsBurnt } from '../lib/bins';

const SwipeableBinItem = ({
  index,
  isSelected,
  binData = RunMockData[0].binsDrop[0],
  binListName = 'binsDrop',
  sidingId = RunMockData[0].id,
  runData = RunMockData,
  setRunData,
  longPressHandler,
}) => {
  const { theme, toggleTheme } = useTheme();
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
        <View
          style={[
            styles.actionButton,
            isBurnt
              ? { backgroundColor: theme.bgGreen }
              : { backgroundColor: theme.bgBurnt },
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
            color={theme.spAtSidingText}
          />
          <Headline style={{ color: theme.spAtSidingText }}>
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
          isSelected == index && {
            borderColor: theme.spAtSidingText,
            borderWidth: 4,
            borderStyle: 'solid',
            paddingLeft: 4,
            paddingRight: 14,
            paddingVertical: 4,
          },
          { backgroundColor: theme.binItemBg },
          isChecked
            ? isBurnt
              ? { backgroundColor: theme.binItemBurnt }
              : { backgroundColor: theme.binItemGreen }
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
          onLongPress={() => longPressHandler(binData.binNumber, index)}
        >
          <Feather
            style={[
              { color: theme.spAtSidingText },
              isChecked
                ? isBurnt
                  ? { color: theme.binItemBurntText }
                  : { color: theme.binItemGreenText }
                : null,
            ]}
            name={isChecked ? 'check-circle' : 'circle'}
            size={24}
          />
          <Headline
            style={[
              { color: theme.spAtSidingText },
              isChecked
                ? isBurnt
                  ? { color: theme.binItemBurntText }
                  : { color: theme.binItemGreenText }
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
              { color: theme.spAtSidingText },
              isChecked
                ? isBurnt
                  ? { color: theme.binItemBurntText }
                  : { color: theme.binItemGreenText }
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
