import { useEffect, useRef } from 'react';
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
import { useTheme } from '../styles/themeContext';
import { Title2 } from '../styles/typography';

// Import Components
import BinList from './binList';

// Import Mock Data
import { RunMockData } from '../data/RunMockData';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const window = Dimensions.get('window');
// 30% of the window height, with a minimum of 150 units
const calculatedHeight = Math.min(window.height * 0.3, 300);

const RunSheetAccordionItem = ({
  sidingData = RunMockData.sidings[0],
  runData = RunMockData,
  setRunData,
  isExpanded,
  onToggle,
}) => {
  const animatedHeight = useRef(new Animated.Value(0)).current; // Initial height is 0 for collapsed state
  const rotation = useRef(new Animated.Value(0)).current; // For icon rotation
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(animatedHeight, {
      // toValue: isExpanded ? calculatedHeight : 0,
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
        { backgroundColor: theme.spPendingBG },
        sidingData.isCompleted
          ? { backgroundColor: theme.spCompleteBG }
          : sidingData.isSelected
          ? { backgroundColor: theme.spSelectedBG }
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
          <TouchableOpacity disabled={sidingData.isCompleted}>
            <MaterialCommunityIcons
              size={28}
              name={
                sidingData.isCompleted
                  ? 'checkbox-marked-circle-outline'
                  : sidingData.isSelected
                  ? 'star-circle-outline'
                  : 'checkbox-blank-circle-outline'
              }
              color={theme.textLevel3}
            />
          </TouchableOpacity>
          {/* Siding Name */}
          <Title2 style={{ flex: 1 }}>{sidingData.name}</Title2>

          <View style={styles.binBumberContainer}>
            {/* Drop Number */}
            <View style={styles.binNumberItem}>
              <MaterialCommunityIcons
                name='tray-arrow-down'
                size={24}
                color={theme.textLevel3}
              />
              <Title2>{sidingData.binsDrop.length}</Title2>
            </View>

            {/* Collect Number */}
            <View style={styles.binNumberItem}>
              <MaterialCommunityIcons
                name='tray-arrow-up'
                size={24}
                color={theme.textLevel3}
              />
              <Title2>{sidingData.binsCollect.length}</Title2>
            </View>
          </View>

          {/* Accordion Toggle Icon */}
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <MaterialCommunityIcons
              name='chevron-down'
              size={36}
              color={theme.textLevel3}
            />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Accordion Body */}
      <Animated.View
        style={{
          height: animatedHeight,
          overflow: 'hidden',
          flexDirection: 'row',
          width: '100%',
          gap: 16,
          paddingHorizontal: 8,
        }}
      >
        {/* Drop Bin List */}
        <BinList
          BinData={sidingData.binsDrop}
          binListName='binsDrop'
          sidingId={sidingData.id}
          runData={runData}
          setRunData={setRunData}
        />
        {/* Collect Bin List */}
        <BinList
          BinData={sidingData.binsCollect}
          binListName='binsCollect'
          sidingId={sidingData.id}
          runData={runData}
          setRunData={setRunData}
        />
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
    borderRadius: 10,
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
