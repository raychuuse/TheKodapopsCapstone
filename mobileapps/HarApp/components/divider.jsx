import { View, StyleSheet } from 'react-native';

// Import Style Components
import { Colours } from './colours';

/**
 * Divider Component
 *
 * This component renders a horizontal divider line.
 *
 * @param {Object} props - Component props
 * @param {Object} [props.style] - Additional styles for the divider
 *
 * @returns {JSX.Element} The rendered Divider component
 */
const Divider = ({ style }) => {
  return (
    <View
      style={[
        {
          height: 1, // Height of the divider
          width: '100%', // Full width
          backgroundColor: Colours.spDiv, // Background color from Colours
        },
        style, // Additional styles passed via props
      ]}
    />
  );
};

export default Divider;
