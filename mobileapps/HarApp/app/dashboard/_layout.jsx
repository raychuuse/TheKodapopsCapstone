import { Slot } from "expo-router";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

// Import Components
import Button from "../../components/button";
import NotificationBell from "../../components/notificationBell";
import CustomModal from "../../components/modal";

// Import Style Components
import { Title1, Subhead } from "../../components/typography";

const Layout = () => {
  const [settingsVisable, setSettingsVisable] = useState(false);
  const [notificationVisable, setNotificationVisable] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      {/* SettingsModals */}
      <CustomModal
        isVisible={settingsVisable}
        onClose={() => setSettingsVisable(false)}
        buttonIcon="check-circle-outline">
        <View style={{ width: "100%", height: "70%", gap: 16 }}>
          <View style={{ marginBottom: 32, gap: 8 }}>
            <Title1>Drop-off Consignment Settings</Title1>
            <Subhead>
              Configure your consignment details for where you will be dropping
              off your loads. Ensure accurate settings for smooth operations at
              the rail siding bins.
            </Subhead>
          </View>
        </View>
      </CustomModal>
      {/* Notification Modal */}
      <CustomModal
        isVisible={notificationVisable}
        onClose={() => setNotificationVisable(false)}>
        <View style={{ width: "100%", height: "70%", gap: 16 }}>
          <View style={{ marginBottom: 32, gap: 8 }}>
            <Title1>Recent Notifications</Title1>
            <Subhead>
              Here's a list of your most recent notifications. Stay up-to-date
              with the latest alerts and updates.
            </Subhead>
          </View>
        </View>
      </CustomModal>
      {/* Page */}
      <Slot />
      {/* Navigation */}
      <View style={styles.nav}>
        <Button
          iconName="settings"
          backgroundColor="transparent"
          iconSize={48}
          iconColor="#fff"
          onPress={() => setSettingsVisable(true)}
        />
        <NotificationBell
          backgroundColor="transparent"
          iconSize={48}
          notificationCount={0}
          onPress={() => setNotificationVisable(true)}
        />
      </View>
      <StatusBar style="light" />
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    width: "100%",

    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 32,
  },
});

export default Layout;
