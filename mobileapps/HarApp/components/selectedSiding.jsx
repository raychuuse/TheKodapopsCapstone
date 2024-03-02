// Import Components
import { View } from "react-native";
import Divider from "../components/divider";

// Import Style Components
import { Headline } from "../components/typography";
import { EvilIcons } from "@expo/vector-icons";

const SelectedSiding = ({ sidingName = "Selected Siding" }) => {
  return (
    <>
      <Divider />
      <View
        style={{
          flexDirection: "row",
          gap: 24,
          alignItems: "center",
        }}>
        <View
          style={{
            flexDirection: "row",
            gap: 4,
            alignItems: "center",
          }}>
          <EvilIcons name={"location"} size={24} />
          <Headline>Siding:</Headline>
        </View>
        <Headline>{sidingName}</Headline>
      </View>
      <Divider />
    </>
  );
};

export default SelectedSiding;
