import {React, forwardRef} from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../styles/themeContext';

const Button = ({
  title = '',
  onPress = () => alert('Button Pressed'),
  backgroundColor,
  textColor,
  iconPosition = 'left',
  iconName = '',
  iconSize = 24,
  iconColor,
  style = {},
  textStyle = {},
  border = false,
  borderWidth = 2,
}, ref) => {
  // Determine if the icon should be rendered and if title is provided
  const shouldRenderIcon = iconName !== '';
  const shouldRenderTitle = title !== '';
  const { theme, toggleTheme } = useTheme();

  backgroundColor = backgroundColor || theme.bgButton;
  textColor = textColor || theme.textButton;
  iconColor = iconColor || theme.textButton;

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
      ref = {ref}
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor },
        { borderColor: textColor },
        border ? { borderStyle: 'solid' } : {},
        border ? { borderWidth } : { borderWidth: 0 },
        style,
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <View
        style={[
          styles.buttonContent,
          !shouldRenderIcon && styles.buttonContentNoIcon,
        ]}
      >
        {iconPosition === 'left' && renderIcon()}
        {shouldRenderTitle && (
          <Text style={[styles.button_text, { color: textColor }, textStyle]}>
            {title}
          </Text>
        )}
        {iconPosition === 'right' && renderIcon()}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 48,
    minHeight: 48,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    textTransform: 'capitalize',
  },
  buttonContentNoIcon: {
    justifyContent: 'center',
  },
  button_text: {
    fontSize: 20,
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  iconNoMargin: {
    margin: 0, // Remove margin when there's no title
  },
});

export default forwardRef(Button);
