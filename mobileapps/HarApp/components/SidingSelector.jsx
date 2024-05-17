// Import Components
import { View } from 'react-native';
import Divider from './divider';

// Import Style Components
import { Headline } from './typography';
import { EvilIcons } from '@expo/vector-icons';

/**
 * SidingSelector Component
 *
 * This component displays the currently selected siding. It includes
 * a location icon and the name of the siding passed as a prop.
 *
 * @param {string} sidingName - The name of the selected siding. Defaults to "Selected Siding".
 *
 * @returns {JSX.Element} The rendered SidingSelector component.
 */
const SidingSelector = ({ sidingName = 'Selected Siding' }) => {
  return (
    <>
      {/* Divider Component to separate sections */}
      <Divider />

      {/* Container for the Siding Selector */}
      <View
        style={{
          flexDirection: 'row', // Layout direction
          gap: 24, // Space between elements
          alignItems: 'center', // Align items vertically in the center
        }}
      >
        {/* Sub-container for the icon and label */}
        <View
          style={{
            flexDirection: 'row', // Layout direction
            gap: 4, // Space between icon and label
            alignItems: 'center', // Align items vertically in the center
          }}
        >
          {/* Location icon */}
          <EvilIcons
            name={'location'}
            size={24}
          />

          {/* Label for the Siding */}
          <Headline>Siding:</Headline>
        </View>

        {/* Display the name of the selected siding */}
        <Headline>{sidingName}</Headline>
      </View>

      {/* Divider Component to separate sections */}
      <Divider />
    </>
  );
};

export default SidingSelector;
