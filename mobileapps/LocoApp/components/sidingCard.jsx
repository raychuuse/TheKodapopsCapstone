import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Styles
import { Title3, Headline, H1 } from '../styles/typography';
import { useTheme } from '../styles/themeContext';

const SidingCard = ({
  containerWidth,
  index,
  listLength,
  isCompleted = false,
  isSelected = false,
  name: name = 'Siding Name',
  drop = 888,
  collect = 888,
  selectedHandeler,
  scrollX,
  onPress,
}) => {
  const { theme, toggleTheme } = useTheme();
  const [_isCompleted, setIsCompleted] = useState(isCompleted);
  const [_isSelected, setIsSelected] = useState(isSelected);
  const inputRange = [(index - 1) * 170, index * 170, (index + 1) * 170];
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [0, -10, 0],
  });

  // TODO: REMOVE when a selectedHandeler is implemented!!!
  if (selectedHandeler == null) {
    selectedHandeler = () => {
      setIsSelected(!_isSelected);
    };
  }

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.spPending,
          borderColor: theme.spPendingBorder,
        },
        _isCompleted
          ? {
              backgroundColor: theme.spComplete,
              borderColor: theme.spCompleteBorder,
            }
          : _isSelected
          ? {
              backgroundColor: theme.spSelected,
              borderColor: theme.spSelectedBorder,
            }
          : null,
        { transform: [{ translateY }] },
        index == 0 ? { marginLeft: (containerWidth - 170) / 2 } : null,
        index == listLength - 1
          ? { marginRight: (containerWidth - 170) / 2 }
          : null,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={{ flex: 1, width: '100%', alignItems: 'center' }}
      >
        <View style={{ flex: 3, justifyContent: 'center' }}>
          <Title3
            style={[
              { color: theme.spPendingText },
              _isCompleted
                ? { color: theme.spCompleteText }
                : _isSelected
                ? { color: theme.spSelectedText }
                : null,
            ]}
          >
            {name}
          </Title3>
        </View>
        <View
          style={[styles.devider, { backgroundColor: theme.spPendingText }]}
        />
        <View style={styles.binCounterContainer}>
          <View style={styles.binCounterLabel}>
            <MaterialIcons
              name='download'
              size={18}
              color={
                _isCompleted
                  ? theme.spCompleteText
                  : _isSelected
                  ? theme.spSelectedText
                  : theme.spPendingText
              }
            />
            <Headline
              style={[
                { marginRight: 9 },
                { color: theme.spPendingText },
                _isCompleted
                  ? { color: theme.spCompleteText }
                  : _isSelected
                  ? { color: theme.spSelectedText }
                  : null,
              ]}
            >
              Drop Off
            </Headline>
          </View>
          <H1
            style={[
              styles.binCounter,
              { color: theme.spPendingText },
              _isCompleted
                ? { color: theme.spCompleteText }
                : _isSelected
                ? { color: theme.spSelectedText }
                : null,
            ]}
          >
            {drop}
          </H1>
        </View>
        <View
          style={[styles.devider, { backgroundColor: theme.spPendingText }]}
        />
        <View style={styles.binCounterContainer}>
          <View style={styles.binCounterLabel}>
            <MaterialIcons
              name='upload'
              size={18}
              color={
                _isCompleted
                  ? theme.spCompleteText
                  : _isSelected
                  ? theme.spSelectedText
                  : theme.spPendingText
              }
            />
            <Headline
              style={[
                { marginRight: 9 },
                { color: theme.spPendingText },
                _isCompleted
                  ? { color: theme.spCompleteText }
                  : _isSelected
                  ? { color: theme.spSelectedText }
                  : null,
              ]}
            >
              Collect
            </Headline>
          </View>
          <H1
            style={[
              styles.binCounter,
              { color: theme.spPendingText },
              _isCompleted
                ? { color: theme.spCompleteText }
                : _isSelected
                ? { color: theme.spSelectedText }
                : null,
            ]}
          >
            {collect}
          </H1>
        </View>
        <View
          style={[styles.devider, { backgroundColor: theme.spPendingText }]}
        />
        <View style={{ flex: 3, justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={selectedHandeler}
            disabled={isCompleted}
          >
            <MaterialCommunityIcons
              name={
                _isCompleted
                  ? 'checkbox-marked-circle-outline'
                  : _isSelected
                  ? 'star-circle-outline'
                  : 'checkbox-blank-circle-outline'
              }
              size={36}
              color={
                _isCompleted
                  ? theme.spCompleteText
                  : _isSelected
                  ? theme.spSelectedText
                  : theme.spPendingText
              }
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  binCounterContainer: {
    flex: 6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  binCounterLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  binCounter: {
    textAlign: 'center',
    fontSize: 51,
    fontWeight: '800',
    lineHeight: 61,
    marginVertical: 0,
  },
  devider: {
    height: 1,
    width: '70%',
  },
  card: {
    borderStyle: 'solid',
    borderTopWidth: 4,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRadius: 15,
    padding: 10,
    width: 170,
    alignItems: 'center',
    height: '90%',
  },
});

export default SidingCard;
