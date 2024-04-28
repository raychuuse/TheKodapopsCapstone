import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Your custom Colours and Type objects

import { Headline } from '../styles/typography';
import { useTheme } from '../styles/themeContext';

const NotificationItem = ({ icon, label, onRemove, type = 'default' }) => {
  const { theme, toggleTheme } = useTheme();

  // Get the color based on the type, default to 'default' if not specified
  const textColor = theme.types[type] || theme.types.default;

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={textColor}
      />
      <Headline style={{ color: textColor, flex: 1, paddingLeft: 14 }}>
        {label}
      </Headline>
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default NotificationItem;
