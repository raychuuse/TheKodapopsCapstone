import {useEffect, useRef, useState} from 'react';
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

// Import Styles
import { Colours } from '../styles/colours';
import { Title2 } from '../styles/typography';

import {getSidingBreakdown} from "../api/siding.api";

// Import Components
import BinList from './binList';

// Import Mock Data
import { RunMockData } from '../data/RunMockData';
import { dropOffBin, getCounts, pickUpBin } from '../api/runs.api';
import { getCurrentLoadById } from '../api/loco.api';

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
  stop,
  run,
  setRun,
  isExpanded,
  onToggle,
}) => {
  const animatedHeight = useRef(new Animated.Value(0)).current; // Initial height is 0 for collapsed state
  const rotation = useRef(new Animated.Value(0)).current; // For icon rotation
  const [sidingBins, setSidingBins] = useState();
  const [loco, setLoco] = useState();
  const [locoBins, setLocoBins] = useState();
  const [dropOffCount, setDropOffCount] = useState();
  const [collectCount, setCollectCount] = useState();

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

    getInfo();
  }, [isExpanded]);

  const onDropOffSelected = (bin) => {
    dropOffBin(bin.binID, 3, stop.stopID)
      .then(response => {
        getInfo();
      })
      .catch(err => {
        console.error(err);
      });
  };

  const onPickupSelected = (bin) => {
    pickUpBin(bin.binID, 3, stop.stopID)
      .then(response => {
        getInfo();
      })
      .catch(err => {
        console.error(err);
      })
  };

  const getInfo = () => {
    getSidingBreakdown(stop.sidingID, stop.stopID)
      .then(response => {
        setSidingBins(response);
      })
      .catch(err => {
        console.error(err);
      });


    getCurrentLoadById(3, stop.stopID)
      .then(response => {
        setLocoBins(response.bins);
      })
      .catch(err => {
        console.error(err);
      });

    getCounts(stop.stopID)
        .then(counts => {
          setDropOffCount(counts.dropped_off_count);
          setCollectCount(counts.picked_up_count);
        })
        .catch(err => {
          console.error(err);
        })
  };

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View
      style={[
        styles.itemContainer,
        stop.isCompleted
          ? styles.itemContatinerComplete
          : stop.isSelected
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
          <TouchableOpacity disabled={stop.isCompleted}>
            <MaterialCommunityIcons
              size={28}
              name={
                stop.isCompleted
                  ? 'checkbox-marked-circle-outline'
                  : stop.isSelected
                  ? 'star-circle-outline'
                  : 'checkbox-blank-circle-outline'
              }
              color={Colours.textLevel3}
            />
          </TouchableOpacity>
          {/* Siding Name */}
          <Title2 style={{ flex: 1 }}>{stop.sidingName}</Title2>

          <View style={styles.binBumberContainer}>
            {/* Drop Number */}

            <Title2>Total</Title2>
            <View style={styles.binNumberItem}>
              <MaterialCommunityIcons
                name='tray-arrow-down'
                size={24}
                color={Colours.textLevel3}
              />
              <Title2>{stop.drop_off_quantity}</Title2>
            </View>

            {/* Collect Number */}
            <View style={styles.binNumberItem}>
              <MaterialCommunityIcons
                name='tray-arrow-up'
                size={24}
                color={Colours.textLevel3}
              />
              <Title2>{stop.collect_quantity}</Title2>
            </View>

            <Title2>Current</Title2>
            <View style={styles.binNumberItem}>
              <MaterialCommunityIcons
                name='tray-arrow-down'
                size={24}
                color={Colours.textLevel3}
              />
              <Title2>{dropOffCount}</Title2>
            </View>

            {/* Collect Number */}
            <View style={styles.binNumberItem}>
              <MaterialCommunityIcons
                name='tray-arrow-up'
                size={24}
                color={Colours.textLevel3}
              />
              <Title2>{collectCount}</Title2>
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
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            gap: 16,
            paddingHorizontal: 8,
          }}
        >
          {/* Drop Bin List */}
          <BinList
            bins={locoBins}
            type={'DROPPED_OFF'}
            onBinSelected={onDropOffSelected}
          />
          {/* Collect Bin List */}
          <BinList
            bins={sidingBins}
            type={'PICKED_UP'}
            onBinSelected={onPickupSelected}
          />
        </View>
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
