import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * NotificationBell Component
 *
 * This component renders a notification bell icon with a badge showing the number of notifications.
 *
 * @param {Object} props - Component props
 * @param {function} [props.onPress=() => alert("Notification Bell Pressed")] - Function to call when the bell is pressed
 * @param {string} [props.iconName="notifications"] - The name of the icon to display
 * @param {number} [props.iconSize=24] - The size of the icon
 * @param {string} [props.iconColor="#ffffff"] - The color of the icon
 * @param {string} [props.backgroundColor="#4F12FA42"] - The background color of the button
 * @param {number} [props.notificationCount=0] - The number of notifications to display in the badge
 * @param {string} [props.countBackgroundColor="#ff0000"] - The background color of the notification count badge
 * @param {string} [props.countTextColor="#ffffff"] - The text color of the notification count badge
 * @param {Object} [props.style={}] - Additional styles for the button
 *
 * @returns {JSX.Element} The rendered NotificationBell component
 */
const NotificationBell = ({
  onPress = () => alert('Notification Bell Pressed'),
  iconName = 'notifications',
  iconSize = 24,
  iconColor = '#ffffff',
  backgroundColor = '#4F12FA42',
  notificationCount = 0,
  countBackgroundColor = '#ff0000',
  countTextColor = '#ffffff',
  style = {},
}) => {
  // Counter dimensions and border based on icon size
  const counterSize = iconSize * 0.4; // Making the counter 40% of the icon size for better visibility
  const borderWidth = iconSize * 0.025; // Border width as 2.5% of the icon size
  // Adjusting counter position to scale with the icon size
  const counterPosition = iconSize * 0.125; // Positioning the counter at 12.5% of the icon size from the top right

  /**
   * Render the notification count badge if there are notifications
   * @returns {JSX.Element|null} The rendered notification count badge or null
   */
  const renderNotificationCount = () =>
    notificationCount > 0 && (
      <View
        style={[
          styles.notificationCount,
          {
            width: counterSize,
            height: counterSize,
            borderRadius: counterSize / 2,
            backgroundColor: countBackgroundColor,
            borderWidth: borderWidth,
            borderColor: '#ffffff', // Counter border color
            top: -counterPosition,
            right: -counterPosition,
          },
        ]}
      >
        <Text
          style={[
            styles.countText,
            { color: countTextColor, fontSize: counterSize / 2 },
          ]}
        >
          {Math.min(99, notificationCount)}{' '}
          {/* Limiting displayed count to 99 */}
        </Text>
      </View>
    );

  return (
    <TouchableOpacity
      onPress={onPress} // Handle press event
      style={[styles.button, { backgroundColor }, style]} // Apply styles
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touchable area
    >
      <View style={styles.iconContainer}>
        {/* Bell icon */}
        <MaterialIcons
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
        {renderNotificationCount()} {/* Render notification count badge */}
      </View>
    </TouchableOpacity>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  button: {
    justifyContent: 'center', // Center content horizontally
    alignItems: 'center', // Center content vertically
    minWidth: 48, // Minimum width of the button
    minHeight: 48, // Minimum height of the button
  },
  iconContainer: {
    position: 'relative', // Positioning context for the notification count badge
  },
  notificationCount: {
    position: 'absolute', // Absolute positioning for the badge
    justifyContent: 'center', // Center content horizontally
    alignItems: 'center', // Center content vertically
    padding: 1, // Padding inside the badge
  },
  countText: {
    fontWeight: 'bold', // Bold text for the count
    textAlign: 'center', // Center text inside the badge
  },
});

export default NotificationBell;
