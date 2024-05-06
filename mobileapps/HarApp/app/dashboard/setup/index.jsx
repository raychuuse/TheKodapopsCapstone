import SetupPage from "../../../pages/setup";
import { SafeAreaView } from "react-native";
import { SelectionProvider } from "../../../context/selectionContext";

export default function Page() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SetupPage />
    </SafeAreaView>
  );
}
