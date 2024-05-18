import { View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Assets
import SvgSensorsOff from '../assets/sensors_off';
import SvgSensors from '../assets/sensors';

/**
 * NetworkIndicator Component
 *
 * This component displays an SVG icon indicating the network connection status.
 * It shows a different icon based on whether the device is connected to the internet or not.
 *
 * @param {Object} props - Component props
 * @param {Object} [props.style] - Additional styles for the component
 *
 * @returns {JSX.Element} The rendered NetworkIndicator component
 */
const NetworkIndicator = ({ style }) => {
  const { isConnected } = NetInfo.useNetInfo(); // Get network connection status

  return (
    <View style={style}>
      {/* Display the appropriate SVG icon based on connection status */}
      {isConnected ? <SvgSensors /> : <SvgSensorsOff />}
    </View>
  );
};

export default NetworkIndicator;
