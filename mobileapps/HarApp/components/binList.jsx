import { useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// Import Styles
import { Headline, LargeTitle, Title3 } from './typography';
import { Colours } from './colours';

// Import Components
import SwipeableBinItem from './swipeableBinItem';
import { useBins } from '../context/binContext';

const BinList = ({ bins, openAddBinModal }) => {

  // ~ ~ ~ ~ ~ ~ ~ ~ List State ~ ~ ~ ~ ~ ~ ~ ~ //
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [isSelected, setIsSelected] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // ~ ~ ~ ~ ~ ~ ~ List Functions ~ ~ ~ ~ ~ ~ ~ //
  // Lock lits handeler for when then lock button is longPressed
  const toggleLock = () => {
    setIsLocked(!isLocked);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

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

        // Temporary copy of bin data for mutation.
        const _binData = binData;

        // Extract indices from the selected objects for range calculation.
        const indices = newSelection.map((selection) => selection.index);
        // Calculate the minimum and maximum indices to define the range.
        const minIndex = Math.min(...indices);
        const maxIndex = Math.max(...indices);

        // Determine the desired 'full' state based on the first selected bin.
        const toSet = !binData[newSelection[0].index].isFull;

        // Loop through the range of indices and set each bin's 'full' state.
        for (let i = minIndex; i <= maxIndex; i++) {
          _binData[i].isFull = toSet;
        }

        // Update the bin data state with the new 'full' states.
        setBinData(_binData);
        // Clear the selection after the action is completed.
        setSelectedIndices([]);
        // Unset the is selected indicator
        setIsSelected(null);
        // Provide haptic feedback to indicate successful processing.
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  // ~ ~ ~ ~ ~ ~ ~ List Components ~ ~ ~ ~ ~ ~ ~ //

  // Bin List component to renmder
  const listRenderItem = ({ item, index }) => {
    return (
      <SwipeableBinItem
        index={index}
        isSelected={isSelected}
        bin={item}
        longPressHandler={LongPressRangeSelect}
        style={{
          position: 'relative',
          paddingHorizontal: 8,
          paddingTop: 72,
          borderRadius: 16,
          backgroundColor: Colours.bgOverlay,
          zIndex: 0,
        }}
      />
    );
  };

  const listSeperator = () => {
    return (
      <View
        style={{
          width: '80%',
          height: 1,
          backgroundColor: Colours.spAtSidingText,
          marginVertical: 10,
          marginLeft: 'auto',
          marginRight: 'auto',
          opacity: 0.3,
        }}
      />
    );
  };

  const ListHeader = () => {
    return (
      <View
        style={{
          width: '100%',
          position: 'absolute',
          paddingVertical: 12,
          paddingLeft: 24,
          paddingRight: 12,
          alignItems: 'center',
          flexDirection: 'row',
          gap: 12,
          backgroundColor: 'rgb(235, 235, 235)',
          zIndex: 100,
          borderRadius: 12,
          zIndex: 3,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            gap: 16,
            alignItems: 'center',
          }}
        >
          <Title3>{bins.length}</Title3>
          <Headline>{bins.length > 1 ? 'Bins' : 'Bin'} at Siding</Headline>
        </View>
        <TouchableOpacity
          onLongPress={() => toggleLock()}
          style={{
            backgroundColor: '#4F12FA42',
            padding: 8,
            borderRadius: 8,
            alignItems: 'center',
            flexDirection: 'row',
          }}
        >
          <MaterialCommunityIcons
            name={isLocked ? 'lock' : 'lock-open-outline'}
            size={24}
          />
          {isLocked ? <Text>Locked</Text> : null}
        </TouchableOpacity>
        {isLocked ? null : (
          <TouchableOpacity
            onPress={() => {
              openAddBinModal(true);
              Haptics.selectionAsync();
            }}
            style={{
              backgroundColor: '#4F12FA42',
              padding: 8,
              borderRadius: 8,
            }}
          >
            <MaterialCommunityIcons
              name={'plus-circle-outline'}
              size={24}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const LockView = () => {
    return (
      <BlurView
        intensity={10}
        style={{
          position: 'absolute',
          backgroundColor: Colours.bgOverlay,
          zIndex: 1,
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MaterialCommunityIcons
          name='lock'
          size={34}
          color={Colours.bgLevel6}
        />
        <LargeTitle style={{ color: Colours.bgLevel6 }}>Locked</LargeTitle>
      </BlurView>
    );
  };

  const listFooter = () => {
    return <View style={{ marginVertical: 40 }} />;
  };

  return (
    <View
      style={{
        flex: 1,
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {/* Bin List Header */}
      <ListHeader />
      {/* Bin List Lock */}
      {isLocked && <LockView />}
      {/* Bin List Body */}
      <FlatList
        data={bins}
        renderItem={listRenderItem}
        style={{
          position: 'relative',
          paddingHorizontal: 8,
          paddingTop: 72,
          borderRadius: 16,
          backgroundColor: Colours.bgOverlay,
          zIndex: 0,
        }}
        ItemSeparatorComponent={listSeperator}
        ListFooterComponent={listFooter}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default BinList;
