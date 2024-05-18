import React, { forwardRef } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colours } from './colours';
import * as Haptics from 'expo-haptics';

/**
 * AltButton Component
 *
 * This component renders a customizable button with an optional icon.
 * It uses `Pressable` for handling press events and supports `forwardRef`.
 *
 * @param {Object} props - Component props
 * @param {string} [props.title=""] - The text to display inside the button
 * @param {string} [props.pressedTitle=props.title] - The text to display when the button is pressed
 * @param {function} [props.onPress=() => alert("Button Pressed")] - Function to call when the button is pressed
 * @param {string} [props.backgroundColor="#4F12FA42"] - The background color of the button
 * @param {string} [props.textColor=Colours.textLevel3] - The color of the button text
 * @param {string} [props.iconPosition="left"] - The position of the icon (left or right)
 * @param {string} [props.iconName=""] - The name of the icon to display
 * @param {number} [props.iconSize=24] - The size of the icon
 * @param {string} [props.iconColor=Colours.textLevel3] - The color of the icon
 * @param {Object} [props.style={}] - Additional styles for the button
 * @param {Object} [props.textStyle={}] - Additional styles for the text
 * @param {boolean} [props.border=false] - Whether the button should have a border
 * @param {number} [props.borderWidth=2] - The width of the border
 * @param {React.Ref} ref - Reference to the button element
 *
 * @returns {JSX.Element} The rendered AltButton component
 */
const AltButton = (
  {
    title = '',
    pressedTitle = title,
    onPress = () => alert('Button Pressed'),
    backgroundColor = '#4F12FA42',
    textColor = Colours.textLevel3,
    iconPosition = 'left',
    iconName = '',
    iconSize = 24,
    iconColor = Colours.textLevel3,
    style = {},
    textStyle = {},
    border = false,
    borderWidth = 2,
  },
  ref
) => {
  // Determine if the icon should be rendered and if title is provided
  const shouldRenderIcon = iconName !== '';
  const shouldRenderTitle = title !== '';

  // Function to render the icon component with adjusted style based on title presence
  const renderIcon = () =>
    shouldRenderIcon ? (
      <MaterialIcons
        name={iconName}
        size={iconSize}
        color={iconColor}
        style={[
          shouldRenderTitle
            ? iconPosition === 'left'
              ? styles.iconLeft
              : styles.iconRight
            : styles.iconNoMargin,
        ]}
      />
    ) : null;

  return (
    <Pressable
      ref={ref} // Reference to the button element
      onPress={() => {
        onPress(); // Call the onPress function
        Haptics.selectionAsync(); // Trigger haptic feedback
      }}
      style={({ pressed }) => [
        styles.button, // Default button styles
        { backgroundColor }, // Background color
        { borderColor: textColor }, // Border color
        { opacity: pressed ? 0.5 : 1 }, // Change opacity when pressed
        border ? { borderStyle: 'solid' } : null, // Border style if border is true
        border ? { borderWidth } : { borderWidth: 0 }, // Border width if border is true
        style, // Additional styles passed via props
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.buttonContent,
            !shouldRenderIcon && styles.buttonContentNoIcon,
          ]}
        >
          {iconPosition === 'left' && renderIcon()}{' '}
          {/* Render icon on the left */}
          {shouldRenderTitle && (
            <Text style={[styles.button_text, { color: textColor }, textStyle]}>
              {pressed ? title : pressedTitle} {/* Change text when pressed */}
            </Text>
          )}
          {iconPosition === 'right' && renderIcon()}{' '}
          {/* Render icon on the right */}
        </View>
      )}
    </Pressable>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  button: {
    flexDirection: 'row', // Layout direction
    justifyContent: 'center', // Center content horizontally
    alignItems: 'center', // Center content vertically
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 16, // Horizontal padding
    borderRadius: 10, // Rounded corners
    backgroundColor: '#4F12FA42', // Default background color
    minWidth: 48, // Minimum width
    minHeight: 48, // Minimum height
  },
  buttonContent: {
    flexDirection: 'row', // Layout direction
    alignItems: 'center', // Center content vertically
    textTransform: 'capitalize', // Capitalize text
  },
  buttonContentNoIcon: {
    justifyContent: 'center', // Center content horizontally
  },
  button_text: {
    fontSize: 20, // Text size
    fontWeight: '600', // Text weight
  },
  iconLeft: {
    marginRight: 8, // Margin right for left icon
  },
  iconRight: {
    marginLeft: 8, // Margin left for right icon
  },
  iconNoMargin: {
    margin: 0, // Remove margin when there's no title
  },
});

// When passing refs in use forwardRef
export default forwardRef(AltButton);
