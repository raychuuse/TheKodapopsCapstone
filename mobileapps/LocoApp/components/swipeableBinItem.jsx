import React, { useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
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

const SwipeableBinItem = ({
  index,
  rangeSelectIndex,
  bin,
  type,
  stop,
  longPressHandler,
}) => {
  // Providers
  const { theme } = useTheme();
  const { handleUpdateBinState, handleConsignBin, handlePerformStopAction } = useRun();

  const message = type === 'SIDING' ? 'Dropped Off' : 'Picked Up';
  const isSelected = bin.pickedUpInRun || bin.droppedOffInRun;

  const onBinRepair = () => {
      handleUpdateBinState(bin, 'REPAIR', !bin.repair, stop, type === 'SIDING' ? 'COLLECT' : 'DROP_OFF');
  };

  const onBinMissing = () => {
      handleUpdateBinState(bin, 'MISSING', !bin.missing, stop, type === 'SIDING' ? 'COLLECT' : 'DROP_OFF');
  };

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
            RepairBinAlert(bin.binID, onBinRepair);
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
            RemoveBinAlert(bin.binID, onBinMissing);
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
            handleConsignBin(bin, type === 'SIDING' ? stop : null);
            Haptics.selectionAsync();
          }}
          style={[
            styles.actionButton,
            bin.full
              ? { backgroundColor: theme.spCompleteBG }
              : { backgroundColor: theme.spPendingBG },
            { width: 150 },
          ]}
        >
          <MaterialCommunityIcons
            name={bin.full ? 'tray-full' : 'tray'}
            size={24}
            color={bin.full ? theme.spCompleteText : theme.spPendingText}
          />
          <Headline
            style={{
              color: bin.full
                ? theme.spCompleteText
                : theme.spPendingText,
              marginLeft: 'auto',
            }}
          >
            Mark {bin.full ? 'Empty' : 'as Full'}
          </Headline>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            bin.burnt
              ? { backgroundColor: theme.bgGreen }
              : { backgroundColor: theme.bgBurnt },
            { width: 138 },
          ]}
          onPress={() => {
            handleUpdateBinState(bin, 'BURNT', !bin.burnt, stop, type === 'SIDING' ? 'COLLECT' : 'DROP_OFF');
            Haptics.selectionAsync();
          }}
        >
          <MaterialCommunityIcons
            name={bin.burnt ? 'fire' : 'leaf'}
            size={24}
            color={theme.spAtSidingText}
          />
          <Headline style={{ color: theme.spAtSidingText, marginLeft: 'auto' }}>
            Mark {bin.burnt ? 'Green' : 'Burnt'}
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
            bin.burnt
              ? { backgroundColor: theme.bgGreen }
              : { backgroundColor: theme.bgBurnt },
            { width: 180 },
          ]}
        >
          <MaterialCommunityIcons
            name={bin.burnt ? 'fire' : 'leaf'}
            size={24}
            color={theme.spAtSidingText}
          />
          <Headline style={{ color: theme.spAtSidingText }}>
            Mark as {bin.burnt ? 'Green' : 'Burnt'}
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
      // SetIsBurnt(sidingId, binNumber, binsKey);
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
          rangeSelectIndex === index && {
            borderColor: theme.spAtSidingText,
            borderWidth: 4,
            borderStyle: 'solid',
            paddingLeft: 4,
            paddingRight: 14,
            paddingVertical: 4,
          },
          { backgroundColor: theme.binItemBg },
          isSelected
            ? bin.burnt
              ? { backgroundColor: theme.binItemBurnt }
              : { backgroundColor: theme.binItemGreen }
            : null,
        ]}
      >
        <TouchableOpacity
          style={styles.binPressable}
          onPress={() => {
              handlePerformStopAction(bin.binID, stop, type === 'SIDING' ? 'COLLECT' : 'DROP_OFF');
          }}
          onLongPress={() => longPressHandler(index)}
        >
          <Feather
            style={[
              { color: theme.spAtSidingText },
              isSelected
                ? bin.burnt
                  ? { color: theme.binItemBurntText }
                  : { color: theme.binItemGreenText }
                : null,
            ]}
            name={isSelected ? 'check-circle' : 'circle'}
            size={24}
          />
          <Headline
            style={[
              { color: theme.spAtSidingText },
              isSelected
                ? bin.burnt
                  ? { color: theme.binItemBurntText }
                  : { color: theme.binItemGreenText }
                : null,
            ]}
          >
            Bin #{bin.binID}
          </Headline>
        </TouchableOpacity>
        {/* Edit Btn / Full Indicator */}
        <Headline
          style={[
            { color: theme.spAtSidingText },
            isSelected
              ? bin.burnt
                ? { color: theme.binItemBurntText }
                : { color: theme.binItemGreenText }
              : null,
          ]}
        >
        {(bin.droppedOffInRun || bin.pickedUpInRun) && message + ' | '} {bin.full ? 'Full' : 'Empty'} {bin.burnt ? ' |' +
            ' Burnt' : ''}
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
