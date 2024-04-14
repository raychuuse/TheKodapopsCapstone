import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colours } from '../styles/colours';

const NotificationBell = ({
  onPress = () => alert('Notification Bell Pressed'),
  iconName = 'notifications',
  iconSize = 24,
  iconColor = '#ffffff',
  backgroundColor = '#4F12FA42',
  notificationCount = 0,
  countBackgroundColor = Colours.dangerBg,
  countTextColor = '#ffffff',
  style = {},
}) => {
  // Counter dimensions and border based on icon size
  const counterSize = iconSize * 0.4; // Making the counter 40% of the icon size for better visibility
  const borderWidth = iconSize * 0.025; // Border width as 5% of the icon size
  // Adjusting counter position to scale with the icon size
  const counterPosition = iconSize * 0.125; // Positioning the counter at 30% of the icon size from the top left

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
      onPress={onPress}
      style={[styles.button, { backgroundColor }, style]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View style={styles.iconContainer}>
        <MaterialIcons
          name={iconName}
          size={iconSize}
          color={iconColor}
        />
        {renderNotificationCount()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 48,
    minHeight: 48,
  },
  iconContainer: {
    position: 'relative',
  },
  notificationCount: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 1,
  },
  countText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NotificationBell;
