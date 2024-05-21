import { useState } from "react";
import MainPage from "../../pages/main";
import { SafeAreaView, View } from "react-native";
import { BlurView } from "expo-blur";
import Toast, {ErrorToast, InfoToast, SuccessToast} from "react-native-toast-message";

export default function Page() {
  const [hasModal, setHasModal] = useState(false);
  return (
    <>
      <BlurView
        intensity={100}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          zIndex: 100,
          display: hasModal ? "flex" : "none",
        }}
      />
      <SafeAreaView style={{ flex: 1, zIndex: 0 }}>
        <MainPage />
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
    </>
  );
}
