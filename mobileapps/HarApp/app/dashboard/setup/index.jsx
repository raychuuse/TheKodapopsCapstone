import SetupPage from "../../../pages/setup";
import { SafeAreaView } from "react-native";
import Toast, {ErrorToast, InfoToast, SuccessToast} from "react-native-toast-message";

export default function Page() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SetupPage />
      <Toast
          position={'bottom'}
          config={{
            success: (props) => (
                <SuccessToast
                    {...props}
                    text1Style={{fontSize: 18}}
                />
            ),
            error: (props) => (
                <ErrorToast
                    {...props}
                    text1Style={{fontSize: 18}}
                />
            ),
            info: (props) => (
                <InfoToast
                    {...props}
                    text1Style={{fontSize: 18}}
                />
            ),
          }}
      />
    </SafeAreaView>
  );
}
