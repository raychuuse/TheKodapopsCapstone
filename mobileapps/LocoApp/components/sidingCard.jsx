import { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

// Styles
import { Title3, Headline, H1 } from "../styles/typography";
import { Colours } from "../styles/colours";

const SidingCard = ({ containerWidth, index, listLength, isCompleted = false, isSelected = false, name: name = "Siding Name", drop = 888, collect = 888, selectedHandeler, scrollX }) => {
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
        styles.default,
        _isCompleted ? styles.complete : _isSelected ? styles.selected : null,
        { transform: [{ translateY }] },
        index == 0 ? { marginLeft: (containerWidth - 170) / 2 } : null,
        index == listLength - 1 ? { marginRight: (containerWidth - 170) / 2 } : null,
      ]}>
      <View style={{ flex: 3, justifyContent: "center" }}>
        <Title3 style={[styles.defaultText, _isCompleted ? styles.completeText : _isSelected ? styles.selectedText : null]}>{name}</Title3>
      </View>
      <View style={styles.devider} />
      <View style={styles.binCounterContainer}>
        <View style={styles.binCounterLabel}>
          <MaterialIcons name="download" size={18} color={(Colours.spPendingText, _isCompleted ? Colours.spCompleteText : _isSelected ? Colours.spSelectedText : null)} />
          <Headline style={[{ marginRight: 9 }, styles.defaultText, _isCompleted ? styles.completeText : _isSelected ? styles.selectedText : null]}>Drop Off</Headline>
        </View>
        <H1 style={[styles.binCounter, _isCompleted ? styles.completeText : _isSelected ? styles.selectedText : null]}>{drop}</H1>
      </View>
      <View style={styles.devider} />
      <View style={styles.binCounterContainer}>
        <View style={styles.binCounterLabel}>
          <MaterialIcons name="upload" size={18} color={(Colours.spPendingText, _isCompleted ? Colours.spCompleteText : _isSelected ? Colours.spSelectedText : null)} />
          <Headline style={[{ marginRight: 9 }, styles.defaultText, _isCompleted ? styles.completeText : _isSelected ? styles.selectedText : null]}>Collect</Headline>
        </View>
        <H1 style={[styles.binCounter, _isCompleted ? styles.completeText : _isSelected ? styles.selectedText : null]}>{collect}</H1>
      </View>
      <View style={styles.devider} />
      <View style={{ flex: 3, justifyContent: "center" }}>
        <TouchableOpacity onPress={selectedHandeler} disabled={isCompleted}>
          <MaterialCommunityIcons
            name={_isCompleted ? "checkbox-marked-circle-outline" : _isSelected ? "star-circle-outline" : "checkbox-blank-circle-outline"}
            size={36}
            color={(Colours.spPendingText, _isCompleted ? Colours.spCompleteText : _isSelected ? Colours.spSelectedText : null)}
          />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  binCounterContainer: {
    flex: 6,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  binCounterLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  binCounter: {
    textAlign: "center",
    fontSize: 51,
    fontWeight: "800",
    lineHeight: 61,
    color: Colours.spPendingText,
    marginVertical: 0,
  },
  devider: {
    height: 1,
    width: "70%",
    backgroundColor: Colours.spPendingText,
  },
  debug: {
    borderStyle: "dashed",
    borderColor: "red",
    borderWidth: 1,
  },
  card: {
    borderStyle: "solid",
    borderColor: "#fff",
    borderTopWidth: 4,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderRadius: 15,
    // margin: 10,
    padding: 10,
    width: 170,
    alignItems: "center",
    height: "90%",
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

export default SidingCard;
