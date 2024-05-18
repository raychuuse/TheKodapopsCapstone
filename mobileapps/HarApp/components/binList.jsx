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

/**
 * BinList Component
 *
 * This component renders a list of bins with swipeable items and provides functionalities
 * like selection, locking, and adding new bins.
 *
 * @param {Object} props - Component props
 * @param {Array} props.BinData - Array of bin data to display
 * @param {function} props.openAddBinModal - Function to open the modal for adding a new bin
 *
 * @returns {JSX.Element} The rendered BinList component
 */
const BinList = ({ BinData, openAddBinModal }) => {
  // Provider
  const { binData, setBinData, getBinData } = useBins();

  // ~ ~ ~ ~ ~ ~ ~ ~ List State ~ ~ ~ ~ ~ ~ ~ ~ //
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [isSelected, setIsSelected] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  // ~ ~ ~ ~ ~ ~ ~ List Functions ~ ~ ~ ~ ~ ~ ~ //

  /**
   * Toggle the lock state of the bin list.
   */
  const toggleLock = () => {
    setIsLocked(!isLocked);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Provide haptic feedback
  };

  /**
   * Handle long press range selection on bins.
   *
   * @param {string} binNumber - The bin number being selected
   * @param {number} index - The index of the bin in the list
   */
  const LongPressRangeSelect = (binNumber, index) => {
    let newSelection = [...selectedIndices]; // Clone the current selection

    if (newSelection.length === 0) {
      newSelection.push({ binNumber, index });
      setSelectedIndices(newSelection); // Update the state with the new selection
      setIsSelected(index);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Provide haptic feedback
    } else if (newSelection.length === 1) {
      if (newSelection[0].index === index) {
        setSelectedIndices([]); // Clear the selection if the same bin is selected again
        setIsSelected(null);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Provide haptic feedback
      } else {
        newSelection.push({ binNumber, index });
        const _binData = binData; // Temporary copy of bin data

        const indices = newSelection.map((selection) => selection.index);
        const minIndex = Math.min(...indices);
        const maxIndex = Math.max(...indices);

        const toSet = !binData[newSelection[0].index].isFull; // Desired 'full' state

        for (let i = minIndex; i <= maxIndex; i++) {
          _binData[i].isFull = toSet; // Set each bin's 'full' state
        }

        setBinData(_binData); // Update the bin data state
        setSelectedIndices([]); // Clear the selection
        setIsSelected(null);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); // Provide haptic feedback
      }
    }
  };

  // ~ ~ ~ ~ ~ ~ ~ List Components ~ ~ ~ ~ ~ ~ ~ //

  /**
   * Render each bin item in the list.
   *
   * @param {Object} param0 - Object containing the item and index
   * @param {Object} param0.item - The bin item data
   * @param {number} param0.index - The index of the bin item in the list
   *
   * @returns {JSX.Element} The rendered SwipeableBinItem component
   */
  const listRenderItem = ({ item, index }) => {
    return (
      <SwipeableBinItem
        index={index}
        isSelected={isSelected}
        binNumber={item.binNum}
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

  /**
   * Render the separator between bin items in the list.
   *
   * @returns {JSX.Element} The separator view
   */
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

  /**
   * Render the header for the bin list.
   *
   * @returns {JSX.Element} The list header view
   */
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
          zIndex: 3,
          borderRadius: 12,
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
          <Title3>{BinData.length}</Title3>
          <Headline>{BinData.length > 1 ? 'Bins' : 'Bin'} at Siding</Headline>
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

  /**
   * Render the lock view overlay when the list is locked.
   *
   * @returns {JSX.Element} The lock view overlay
   */
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

  /**
   * Render the footer for the bin list.
   *
   * @returns {JSX.Element} The list footer view
   */
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
        data={BinData}
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
