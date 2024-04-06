import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Styles
import { Title3, Headline, H1 } from '../styles/typography';
import { Colours } from '../styles/colours';

// Components
import Button from './button';

export default function SidingCard({ isCompleted = false, isSelected = false, name = 'Siding Name', drop = 888, collect = 888 }) {
  const [_isCompleted, setIsCompleted] = useState(isCompleted);
  const [_isSelected, setIsSelected] = useState(isSelected);

  function selectedHandeler() {
    setIsSelected(!_isSelected);
  }
  return (
    <View style={[styles.card, styles.default, _isCompleted ? styles.complete : null, _isSelected ? styles.selected : null]}>
      <View style={{ flex: 2, justifyContent: 'center' }}>
        <Title3 style={[styles.defaultText, _isCompleted ? styles.completeText : null, _isSelected ? styles.selectedText : null]}>{name}</Title3>
      </View>
      <View style={styles.devider} />
      <View style={styles.binCounterContainer}>
        <View style={styles.binCounterLabel}>
          <MaterialIcons
            name='download'
            size={18}
            color={(Colours.spPendingText, _isCompleted ? Colours.spCompleteText : null, _isSelected ? Colours.spSelectedText : null)}
          />
          <Headline style={[{ marginRight: 9 }, styles.defaultText, _isCompleted ? styles.completeText : null, _isSelected ? styles.selectedText : null]}>Drop Off</Headline>
        </View>
        <H1 style={[styles.binCounter, _isCompleted ? styles.completeText : null, _isSelected ? styles.selectedText : null]}>{drop}</H1>
      </View>
      <View style={styles.devider} />
      <View style={styles.binCounterContainer}>
        <View style={styles.binCounterLabel}>
          <MaterialIcons
            name='upload'
            size={18}
            color={(Colours.spPendingText, _isCompleted ? Colours.spCompleteText : null, _isSelected ? Colours.spSelectedText : null)}
          />
          <Headline style={[{ marginRight: 9 }, styles.defaultText, _isCompleted ? styles.completeText : null, _isSelected ? styles.selectedText : null]}>Collect</Headline>
        </View>
        <H1 style={[styles.binCounter, _isCompleted ? styles.completeText : null, _isSelected ? styles.selectedText : null]}>{collect}</H1>
      </View>
      <View style={styles.devider} />
      <View style={{ flex: 2 }}>
        <TouchableOpacity onPress={selectedHandeler}>
          <MaterialCommunityIcons
            name={_isCompleted ? 'checkbox-marked-circle-outline' : _isSelected ? 'star-circle-outline' : 'checkbox-blank-circle-outline'}
            size={48}
            color={(Colours.spPendingText, _isCompleted ? Colours.spCompleteText : null, _isSelected ? Colours.spSelectedText : null)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  binCounterContainer: {
    flex: 4,
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
    color: Colours.spPendingText,
    marginVertical: 0,
  },
  devider: {
    height: 1,
    width: '70%',
    backgroundColor: Colours.spPendingText,
  },
  debug: {
    borderStyle: 'dashed',
    borderColor: 'red',
    borderWidth: 1,
  },
  card: {
    borderStyle: 'solid',
    borderColor: '#fff',
    borderTopWidth: 4,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRadius: 15,
    margin: 10,
    padding: 10,
    width: 200,
    alignItems: 'center',
  },
  default: {
    backgroundColor: Colours.spPending,
    color: Colours.spPendingText,
  },
  complete: {
    backgroundColor: Colours.spComplete,
    color: Colours.spCompleteText,
  },
  selected: {
    backgroundColor: Colours.spSelected,
    color: Colours.spSelectedText,
  },
  defaultText: {
    color: Colours.spPendingText,
  },
  completeText: {
    color: Colours.spCompleteText,
  },
  selectedText: {
    color: Colours.spSelectedText,
  },
});
