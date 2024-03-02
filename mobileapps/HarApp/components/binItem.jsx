import { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";

// Import Styling Components
import { Headline } from "../components/typography";
import { Colours } from "../components/colours";
import { Feather } from "@expo/vector-icons";

//Import Functions
import { RemoveBinAlert } from "../lib/alerts";

const BinItem = ({ checked = 0, binNumber = "Bin Number" }) => {
  const [isChecked, setIsChecked] = useState(checked);
  return (
    <View style={[styles.binItem, isChecked ? styles.binItemChecked : null]}>
      <TouchableOpacity
        style={styles.binPressable}
        onPress={() => {
          setIsChecked(!isChecked);
        }}>
        <Feather
          style={[styles.binCheckBox, isChecked ? styles.binItemChecked : null]}
          name={isChecked ? "check-circle" : "circle"}
          size={24}
        />
        <Headline
          style={[styles.binText, isChecked ? styles.binItemChecked : null]}>
          {binNumber}
        </Headline>
      </TouchableOpacity>
      {/* Edit Btn / Full Indicator */}
      {isChecked ? (
        <Headline>Full</Headline>
      ) : (
        <TouchableOpacity
          onPress={() => {
            RemoveBinAlert(`Bin #${binNumber}`);
          }}>
          <Feather
            style={[
              styles.binCheckBox,
              isChecked ? styles.binItemChecked : null,
            ]}
            name="trash-2"
            size={24}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  binItem: {
    flexDirection: "row",
    gap: 32,
    paddingLeft: 8,
    paddingRight: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  binText: {
    color: Colours.spAtSidingText,
  },
  binPressable: {
    flexDirection: "row",
    flex: 1,
    gap: 32,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  binEditBtn: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: "transparent",
  },
  binCheckBox: {
    color: Colours.spAtSidingText,
  },
  binItemChecked: {
    color: Colours.spCompleteText,
    backgroundColor: Colours.spComplete,
  },
});

export default BinItem;
