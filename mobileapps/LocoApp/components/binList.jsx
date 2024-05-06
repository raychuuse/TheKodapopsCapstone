import { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import Styles
import { Title2 } from '../styles/typography';

// Import Components
import SwipeableBinItem from './swipeableBinItem';

// Import Provider
import { useRun } from '../context/runContext';
import { useTheme } from '../styles/themeContext';
import { useModal } from '../context/modalContext';
import AddBinCamera from './addBinCamera';

const BinList = ({ stopID, type }) => {
  // Provider
  const { theme } = useTheme();
  const { getStop, getLoco } = useRun();
  const { selectedSidingID } = useModal();

  // Data
  const loco = getLoco();
  const stop = getStop(stopID);
  const bins = type === 'SIDING' ? stop.bins : loco.bins;
  const runData = [];

  // ~ ~ ~ ~ ~ ~ ~ ~ List State ~ ~ ~ ~ ~ ~ ~ ~ //
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [isSelected, setIsSelected] = useState(null);

  // ~ ~ ~ ~ ~ ~ ~ ~ List State ~ ~ ~ ~ ~ ~ ~ ~ //

  // ~ ~ ~ ~ ~ ~ ~ List Functions ~ ~ ~ ~ ~ ~ ~ //
  // Function to handle long press range selection on bins.
  const LongPressRangeSelect = (binNumber, index) => {
    // Clone the current selection to avoid direct state mutation.
    let newSelection = [...selectedIndices];

    // Case when no bins are currently selected.
    if (newSelection.length === 0) {
      // Add the first selected bin's details to the array.
      newSelection.push({ binNumber, index });
      // Update the state to reflect the new selection.
      setSelectedIndices(newSelection);
      // Set the is selected indicator
      setIsSelected(index);
      // Provide haptic feedback to indicate successful selection.
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    // Case when there is already one bin selected.
    else if (newSelection.length === 1) {
      // Check if the same bin is selected again.
      if (newSelection[0].index === index) {
        // Clear the selection if the same bin is selected again.
        setSelectedIndices([]);
        // Unset the is selected indicator
        setIsSelected(null);
        // Provide haptic feedback to indicate removal.
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        // Add the newly selected bin to the selection array.
        newSelection.push({ binNumber, index });

        // Temporary copy of run data for mutation.
        const _runData = runData;
        // Temporary copy of bin data for mutation.
        const _binData = runData.sidings.find(
          (siding) => siding.id == stopID
        )[type];

        // Extract indices from the selected objects for range calculation.
        const indices = newSelection.map((selection) => selection.index);
        // Calculate the minimum and maximum indices to define the range.
        const minIndex = Math.min(...indices);
        const maxIndex = Math.max(...indices);

        // Determine the desired 'full' state based on the first selected bin.
        const toSet = !_binData[newSelection[0].index].isFull;

        // Loop through the range of indices and set each bin's 'full' state.
        for (let i = minIndex; i <= maxIndex; i++) {
          _binData[i].isFull = toSet;
        }

        _runData.sidings = _runData.sidings.map((siding) => {
          if (siding.id == stopID) {
            // Create a new object combining the existing siding data with the new data
            return { ...siding, binListName: _binData };
          } else {
            return siding;
          }
        });

        // Update the bin data state with the new 'full' states.
        updateRun(_runData);
        // Clear the selection after the action is completed.
        setSelectedIndices([]);
        // Unset the is selected indicator
        setIsSelected(null);
        // Provide haptic feedback to indicate successful processing.
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // console.log(
        //   JSON.stringify(
        //     _runData.sidings.find((siding) => siding.id == sidingId)
        //   )
        // );
      }
    }
  };

  // ~ ~ ~ ~ ~ ~ ~ List Components ~ ~ ~ ~ ~ ~ ~ //
  const listRenderItem = ({ item, index }) => (
    <SwipeableBinItem
      index={index}
      longPressedIndex={isSelected}
      bin={item}
      type={type}
      stopID={stopID}
      longPressHandler={LongPressRangeSelect}
    />
  );

  const BinListSeparator = () => (
    <View
      style={{
        width: '80%',
        height: 1,
        backgroundColor: theme.spAtSidingText,
        marginVertical: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        opacity: 0.3,
      }}
    />
  );

  return (
    <GestureHandlerRootView
      style={{ flex: 1, width: '100%', position: 'relative' }}
    >
      {/* Add Bin Modal */}
      {/*<AddBinCamera
        sidingID={stop.stopID}
        isDrop={binsKey}
      />*/}
      {/* List Header */}
      <View
        style={[
          {
            height: 56,
            width: '100%',
            position: 'absolute',
            zIndex: 1,
            borderRadius: 10,
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            paddingHorizontal: 8,
          },
          stop.isCompleted
            ? { backgroundColor: theme.spComplete }
            : stop.stopID == selectedSidingID
            ? { backgroundColor: theme.spSelected }
            : { backgroundColor: theme.spPending },
        ]}
      >
        <Title2>
          {type == 'LOCO'
            ? 'Drop Off:'
            : type == 'SIDING'
            ? 'Collect:'
            : null}
        </Title2>
        <Title2>{bins.length}</Title2>
        <Title2>{bins.length > 1 ? 'Bins' : 'Bin'} at Siding</Title2>
        <TouchableOpacity
          onPress={() => {
            openAddBinModal();
            Haptics.selectionAsync();
          }}
          style={[
            {
              padding: 8,
              borderRadius: 8,
              marginLeft: 'auto',
            },
            stop.isCompleted
              ? { backgroundColor: theme.spCompleteBG }
              : stop.stopID == selectedSidingID
              ? { backgroundColor: theme.spSelectedBG }
              : { backgroundColor: theme.bgModal },
          ]}
        >
          <MaterialCommunityIcons
            name={'plus-circle-outline'}
            size={24}
            color={
              stop.isCompleted
                ? theme.spCompleteText
                : stop.stopID == selectedSidingID
                ? theme.spSelectedText
                : theme.spPendingText
            }
          />
        </TouchableOpacity>
      </View>
      {/* Bin List */}
      <FlatList
        data={bins}
        style={{
          width: '100%',
          backgroundColor: theme.bgOverlay,
          borderRadius: 10,
          height: '100%',
          padding: 8,
          marginTop: 16,
        }}
        renderItem={listRenderItem}
        ItemSeparatorComponent={BinListSeparator}
        ListHeaderComponent={<View style={{ marginTop: 40 }} />}
        ListFooterComponent={<View style={{ marginTop: 18 }} />}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      />
    </GestureHandlerRootView>
  );
};

export default BinList;
