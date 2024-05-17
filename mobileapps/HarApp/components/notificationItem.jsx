import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import custom Colours and Type objects
import { Headline } from './typography';
import { Colours } from './colours';

/**
 * NotificationItem Component
 *
 * This component renders a notification item with an icon, label, and a remove button.
 *
 * @param {Object} props - Component props
 * @param {string} props.icon - The icon name to display
 * @param {string} props.label - The label text to display
 * @param {function} props.onRemove - Function to call when the remove button is pressed
 * @param {string} [props.type='default'] - The type of notification, which determines the color
 *
 * @returns {JSX.Element} The rendered NotificationItem component
 */
const NotificationItem = ({ icon, label, onRemove, type = 'default' }) => {
  // Get the color based on the type, default to 'default' if not specified
  const textColor = Colours.types[type] || Colours.types.default;

  return (
    <View style={styles.container}>
      {/* Icon for the notification item */}
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={textColor}
      />

      {/* Label for the notification item */}
      <Headline style={{ color: textColor, flex: 1, paddingLeft: 14 }}>
        {label}
      </Headline>

      {/* Button to remove the notification item */}
      <TouchableOpacity onPress={onRemove}>
        <MaterialCommunityIcons
          name='close-circle-outline'
          size={24}
          color={textColor}
        />
      </TouchableOpacity>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Layout children in a row
    alignItems: 'center', // Align items vertically in the center
    marginVertical: 5, // Vertical margin between items
  },
});

export default NotificationItem;
