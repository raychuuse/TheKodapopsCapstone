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
  const { getStop, getLoco, handlePerformStopActionRange } = useRun();
  const { selectedSidingID } = useModal();

  // Data
  const loco = getLoco();
  const stop = getStop(stopID);
  const bins = type === 'SIDING' ? stop.bins : loco.bins;

  // ~ ~ ~ ~ ~ ~ ~ ~ List State ~ ~ ~ ~ ~ ~ ~ ~ //
  const [rangeSelectStartIndex, setRangeSelectStartIndex] = useState();

  const longPressHandler = (index) => {
    if (rangeSelectStartIndex == null) {
      setRangeSelectStartIndex(index);
    } else {
      if (rangeSelectStartIndex === index) {
        setRangeSelectStartIndex(null);
      } else {
        handlePerformStopActionRange(rangeSelectStartIndex, index, stop, type === 'SIDING' ? 'COLLECT' : 'DROP_OFF');
        setTimeout(() => setRangeSelectStartIndex(null), 1000); // States are annoying
      }
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // ~ ~ ~ ~ ~ ~ ~ List Components ~ ~ ~ ~ ~ ~ ~ //
  const listRenderItem = ({ item, index }) => (
    <SwipeableBinItem
      index={index}
      bin={item}
      type={type}
      stop={stop}
      rangeSelectIndex={rangeSelectStartIndex}
      longPressHandler={longPressHandler}
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
