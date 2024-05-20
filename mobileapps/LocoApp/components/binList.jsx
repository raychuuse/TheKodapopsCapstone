import { useState } from 'react';
import { View, FlatList, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';

// Import Styles
import { Title1, Title2 } from '../styles/typography';

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
  const { getStop, getLoco, handlePerformStopActionRange, onCompletePressed } = useRun();
  const { selectedSidingID, openAddBinModal } = useModal();

  // Data
  const loco = getLoco();
  const stop = getStop(stopID);
  const bins = type === 'SIDING' ? stop.bins : loco.bins;

  // ~ ~ ~ ~ ~ ~ ~ ~ List State ~ ~ ~ ~ ~ ~ ~ ~ //
  const [rangeSelectStartIndex, setRangeSelectStartIndex] = useState();


  const complete = type === 'SIDING' ? stop.collectComplete : stop.dropOffComplete;

  const textColour = complete
      ? { color: theme.spCompleteText }
      : { color: theme.spPendingText };

  // Used to set the icon colour
  const iconColour = complete ? theme.spCompleteText : theme.spPendingText;

  // Used to set the background color
  const backgroundColor = complete
      ? { backgroundColor: theme.spComplete }
      : { backgroundColor: theme.spPending };


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
      style={{
        flex: 1,
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Add Bin Modal */}
      {/*TODO <AddBinCamera
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
          complete
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
            complete
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
              complete
                ? theme.spCompleteText
                : stop.stopID == selectedSidingID
                ? theme.spSelectedText
                : theme.spPendingText
            }
          />
        </TouchableOpacity>
      </View>
      {/* Bin List Complete Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 24,
          left: 0,
          zIndex: 2,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
        }}
      >
        <TouchableOpacity
          style={[
            {
              flexDirection: 'row',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 10,
              gap: 10,
              alignItems: 'center',
            },
            backgroundColor,
          ]}
          onPress={() => onCompletePressed(stopID, type)}
        >
          <Feather
            size={24}
            name={complete ? 'check-circle' : 'circle'}
            color={iconColour}
          />
          <Title2 style={textColour}>
            {complete ? 'Complete' : 'Incomplete'}
          </Title2>
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
        ListFooterComponent={<View style={{ marginTop: 100 }} />}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      />
    </GestureHandlerRootView>
  );
};

export default BinList;
