import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colours } from './colours';
import * as Haptics from 'expo-haptics';

/**
 * Button Component
 *
 * This component renders a customizable button with an optional icon.
 *
 * @param {Object} props - Component props
 * @param {string} [props.title=""] - The text to display inside the button
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
 * @param {Object} [props.innerRef] - Reference to the button element
 * @param {boolean} [props.isDisabled=false] - Whether the button is disabled
 *
 * @returns {JSX.Element} The rendered Button component
 */
const Button = (
  {
    title = '',
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
    innerRef,
    isDisabled = false,
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
    <TouchableOpacity
      disabled={isDisabled} // Disable the button if isDisabled is true
      ref={ref} // Reference to the button element
      onPress={() => {
        onPress(); // Call the onPress function
        Haptics.selectionAsync(); // Trigger haptic feedback
      }}
      style={[
        styles.button, // Default button styles
        { backgroundColor }, // Background color
        { borderColor: textColor }, // Border color
        border ? { borderStyle: 'solid' } : null, // Border style if border is true
        border ? { borderWidth } : { borderWidth: 0 }, // Border width if border is true
        style, // Additional styles passed via props
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increase touchable area
    >
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
            {title}
          </Text>
        )}{' '}
        {/* Render button text */}
        {iconPosition === 'right' && renderIcon()}{' '}
        {/* Render icon on the right */}
      </View>
    </TouchableOpacity>
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
export default React.forwardRef(Button);
