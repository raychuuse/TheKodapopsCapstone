import { Slot } from "expo-router";
import { View, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Import Components
import Button from "../../components/button";
import NotificationBell from "../../components/notificationBell";
import CustomModal from "../../components/modal";
import SettingsItem from "../../components/settingsItem";
import Divider from "../../components/divider";

// Import Style Components
import { Title1, Subhead, Body, Footnote, Strong, Title2 } from "../../components/typography";
import { Colours } from "../../components/colours";

const farmOptions = [
  { label: "Green Valley Farm", value: 1 },
  { label: "Sunshine Plantations", value: 2 },
  { label: "Riverbend Agriculture", value: 3 },
  { label: "Crestwood Cane Fields", value: 4 },
];

const sidingOptions = [
  { label: "Babinda", value: 1 },
  { label: "Tully", value: 2 },
  { label: "Innisfail", value: 3 },
  { label: "Mourilyan", value: 4 },
  { label: "South Johnstone", value: 5 },
  { label: "Gordonvale", value: 6 },
  { label: "Mossman", value: 7 },
  { label: "Proserpine", value: 8 },
  { label: "Ayr", value: 9 },
  { label: "Ingham", value: 10 },
  { label: "Lucinda", value: 11 },
  { label: "Bundaberg", value: 12 },
  { label: "Maryborough", value: 13 },
  { label: "Isis", value: 14 },
  { label: "Mackay", value: 15 },
];

const blockOptions = [
  { label: "Block A - North Field", value: 1 },
  { label: "Block B - South Field", value: 2 },
  { label: "Block C - East Field", value: 3 },
  { label: "Block D - West Field", value: 4 },
];

const subBlockOptions = [
  { label: "Sub-Block 1", value: 1 },
  { label: "Sub-Block 2", value: 2 },
  { label: "Sub-Block 3", value: 3 },
  { label: "Sub-Block 4", value: 4 },
];

const padOptions = [
  { label: "Pad 101 - North End", value: 1 },
  { label: "Pad 102 - Near River", value: 2 },
  { label: "Pad 103 - Central", value: 3 },
  { label: "Pad 104 - South End", value: 4 },
];

const burntOptions = [
  { label: "Yes", value: 1 },
  { label: "No", value: 2 },
];

const Layout = () => {
  const [settingsVisable, setSettingsVisable] = useState(false);
  const [notificationVisable, setNotificationVisable] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* SettingsModals */}
      <CustomModal isVisible={settingsVisable} onClose={() => setSettingsVisable(false)} buttonIcon="check-circle-outline">
        <View style={{ width: "100%", gap: 8, maxHeight: 600 }}>
          <Title1 style={{ textAlign: "center", marginBottom: 24 }}>Settings</Title1>
          <ScrollView style={{ maxHeight: 600 }}>
            <Title2 style={{ marginBottom: 16 }}>Consignment Settings</Title2>
            <Subhead>Configure your consignment details for where you will be dropping off your loads.</Subhead>
            <SettingsItem type="location" label="Siding" options={sidingOptions} />
            <Divider style={{ marginVertical: 8 }} />
            <SettingsItem type="select" label="Farm" options={farmOptions} style={{ marginTop: 8 }} />
            <SettingsItem type="select" label="Block" options={blockOptions} style={{ marginTop: 8 }} />
            <SettingsItem type="select" label="Sub" options={subBlockOptions} style={{ marginTop: 8 }} />
            <SettingsItem type="select" label="Pad" options={padOptions} style={{ marginTop: 8 }} />
            <SettingsItem type="select" label="Burnt" options={burntOptions} style={{ marginTop: 8 }} />
            <Footnote style={{ marginTop: 32, color: "#fff", textAlign: "center", backgroundColor: `${Colours.dangerBg}80`, padding: 8, borderRadius: 16, overflow: "hidden" }}>
              <Strong>Warning: </Strong>Ensure accurate settings for smooth operations at the rail siding bins.
            </Footnote>
            <Divider style={{ marginVertical: 16 }} />
          </ScrollView>
        </View>
      </CustomModal>
      {/* Notification Modal */}
      <CustomModal isVisible={notificationVisable} onClose={() => setNotificationVisable(false)}>
        <View style={{ width: "100%", height: "70%", gap: 16 }}>
          <View style={{ marginBottom: 32, gap: 8 }}>
            <Title1>Recent Notifications</Title1>
            <Subhead>Here's a list of your most recent notifications. Stay up-to-date with the latest alerts and updates.</Subhead>
          </View>
        </View>
      </CustomModal>
      {/* Page */}
      <Slot />
      {/* Navigation */}
      <View style={styles.nav}>
        <Button iconName="settings" backgroundColor="transparent" iconSize={48} iconColor="#fff" onPress={() => setSettingsVisable(true)} />
        <NotificationBell backgroundColor="transparent" iconSize={48} notificationCount={0} onPress={() => setNotificationVisable(true)} />
      </View>
      <StatusBar style="light" />
    </GestureHandlerRootView>
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
