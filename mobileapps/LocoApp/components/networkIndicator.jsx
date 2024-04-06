import { View } from "react-native";
import NetInfo from "@react-native-community/netinfo";

// Assets
import SvgSensorsOff from "../assets/sensors_off";
import SvgSensors from "../assets/sensors";

const NetworkIndicator = ({ style }) => {
  const { isConnected } = NetInfo.useNetInfo();

  return <View style={style}>{isConnected ? <SvgSensors /> : <SvgSensorsOff />}</View>;
};

export default NetworkIndicator;
