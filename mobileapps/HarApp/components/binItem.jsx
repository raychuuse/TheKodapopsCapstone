import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

// Import Styling Components
import { Headline } from '../components/typography';
import { Colours } from '../components/colours';
import { Feather } from '@expo/vector-icons';

// Import Functions
import { RemoveBinAlert } from '../lib/alerts';

/**
 * BinItem Component
 *
 * This component renders a bin item with a checkable state and an option to remove the bin.
 *
 * @param {Object} props - Component props
 * @param {boolean} [props.checked=0] - Initial checked state of the bin
 * @param {string} [props.binNumber="Bin Number"] - The bin number to display
 *
 * @returns {JSX.Element} The rendered BinItem component
 */
const BinItem = ({ checked = 0, binNumber = 'Bin Number' }) => {
  const [isChecked, setIsChecked] = useState(checked); // State for the checked status of the bin

  return (
    <View style={[styles.binItem, isChecked ? styles.binItemChecked : null]}>
      <TouchableOpacity
        style={styles.binPressable}
        onPress={() => {
          setIsChecked(!isChecked); // Toggle the checked state
        }}
      >
        <Feather
          style={[styles.binCheckBox, isChecked ? styles.binItemChecked : null]}
          name={isChecked ? 'check-circle' : 'circle'} // Icon changes based on checked state
          size={24}
        />
        <Headline
          style={[styles.binText, isChecked ? styles.binItemChecked : null]}
        >
          {binNumber} {/* Display the bin number */}
        </Headline>
      </TouchableOpacity>
      {/* Edit Btn / Full Indicator */}
      {isChecked ? (
        <Headline>Full</Headline> // Display "Full" if the bin is checked
      ) : (
        <TouchableOpacity
          onPress={() => {
            RemoveBinAlert(`Bin #${binNumber}`); // Show alert to remove the bin
          }}
        >
          <Feather
            style={[
              styles.binCheckBox,
              isChecked ? styles.binItemChecked : null,
            ]}
            name='trash-2' // Trash icon to remove the bin
            size={24}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  binItem: {
    flexDirection: 'row', // Layout direction
    gap: 32, // Space between elements
    paddingLeft: 8, // Left padding
    paddingRight: 16, // Right padding
    paddingVertical: 8, // Vertical padding
    borderRadius: 8, // Rounded corners
  },
  binText: {
    color: Colours.spAtSidingText, // Text color
  },
  binPressable: {
    flexDirection: 'row', // Layout direction
    flex: 1, // Flex to fill available space
    gap: 32, // Space between elements
    paddingHorizontal: 8, // Horizontal padding
    paddingVertical: 8, // Vertical padding
  },
  binEditBtn: {
    paddingHorizontal: 0, // No horizontal padding
    paddingVertical: 0, // No vertical padding
    backgroundColor: 'transparent', // Transparent background
  },
  binCheckBox: {
    color: Colours.spAtSidingText, // Checkbox color
  },
  binItemChecked: {
    color: Colours.spCompleteText, // Text color when checked
    backgroundColor: Colours.spComplete, // Background color when checked
  },
});

export default BinItem;
