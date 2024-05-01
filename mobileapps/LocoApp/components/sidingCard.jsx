import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Styles
import { Title3, Headline, H1 } from '../styles/typography';

// Import Providers
import { useTheme } from '../styles/themeContext';
import { useModal } from '../context/modalContext';
import { useRun } from '../context/runContext';

const SidingCard = ({ sidingID, index, scrollX, containerWidth }) => {
  // Providers
  const { theme } = useTheme();
  const { getSiding, runData } = useRun();
  const { updateSelectedSidingID, selectedSidingID, openSidingModal } =
    useModal();

  // Data
  const siding = getSiding(sidingID);

  // Animation Constants
  const inputRange = [(index - 1) * 170, index * 170, (index + 1) * 170];
  const translateY = scrollX.interpolate({
    inputRange,
    outputRange: [0, -10, 0],
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.spPending,
          borderColor: theme.spPendingBorder,
        },
        siding.isCompleted
          ? {
              backgroundColor: theme.spComplete,
              borderColor: theme.spCompleteBorder,
            }
          : siding.id == selectedSidingID
          ? {
              backgroundColor: theme.spSelected,
              borderColor: theme.spSelectedBorder,
            }
          : null,
        { transform: [{ translateY }] },
        index == 0 ? { marginLeft: (containerWidth - 170) / 2 } : null,
        index == runData.sidings.length - 1
          ? { marginRight: (containerWidth - 170) / 2 }
          : null,
      ]}
    >
      <TouchableOpacity
        onPress={() => openSidingModal(sidingID)}
        style={{ flex: 1, width: '100%', alignItems: 'center' }}
      >
        <View style={{ flex: 4, justifyContent: 'center' }}>
          <Title3
            style={[
              {
                color: theme.spPendingText,
                paddingHorizontal: 8,
                textAlign: 'center',
              },
              siding.isCompleted
                ? { color: theme.spCompleteText }
                : siding.id == selectedSidingID
                ? { color: theme.spSelectedText }
                : null,
            ]}
          >
            {siding.name}
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
                siding.isCompleted
                  ? theme.spCompleteText
                  : siding.id == selectedSidingID
                  ? theme.spSelectedText
                  : theme.spPendingText
              }
            />
            <Headline
              style={[
                { marginRight: 9 },
                { color: theme.spPendingText },
                siding.isCompleted
                  ? { color: theme.spCompleteText }
                  : siding.id == selectedSidingID
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
              siding.isCompleted
                ? { color: theme.spCompleteText }
                : siding.id == selectedSidingID
                ? { color: theme.spSelectedText }
                : null,
            ]}
          >
            {siding.binsDrop.length}
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
                siding.isCompleted
                  ? theme.spCompleteText
                  : siding.id == selectedSidingID
                  ? theme.spSelectedText
                  : theme.spPendingText
              }
            />
            <Headline
              style={[
                { marginRight: 9 },
                { color: theme.spPendingText },
                siding.isCompleted
                  ? { color: theme.spCompleteText }
                  : siding.id == selectedSidingID
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
              siding.isCompleted
                ? { color: theme.spCompleteText }
                : siding.id == selectedSidingID
                ? { color: theme.spSelectedText }
                : null,
            ]}
          >
            {siding.binsCollect.length}
          </H1>
        </View>
        <View
          style={[styles.devider, { backgroundColor: theme.spPendingText }]}
        />
        <View style={{ flex: 3, justifyContent: 'center' }}>
          <TouchableOpacity
            onPress={() => updateSelectedSidingID(sidingID)}
            disabled={siding.isCompleted}
          >
            <MaterialCommunityIcons
              name={
                siding.isCompleted
                  ? 'checkbox-marked-circle-outline'
                  : siding.id == selectedSidingID
                  ? 'star-circle-outline'
                  : 'checkbox-blank-circle-outline'
              }
              size={36}
              color={
                siding.isCompleted
                  ? theme.spCompleteText
                  : siding.id == selectedSidingID
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
