import React from "react";
import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";

// Import Components
import Button from "../components/button";
import GreetingMessage from "../components/greetingMessage";
import SettingsItem from "../components/settingsItem";
import Divider from "../components/divider";

// Import Styling Components
import { LargeTitle, Title1 } from "../components/typography";
import { Colours } from "../components/colours";

const SetupPage = () => {
  return (
    <View style={styles.body}>
      {/* Page Headings */}
      <View style={styles.page_heading}>
        <LargeTitle>
          <GreetingMessage />
        </LargeTitle>
        <Title1>John Smith</Title1>
      </View>
      {/* Page Content */}
      <View style={styles.content}>
        <SettingsItem type="location" label="Siding" body="Old Creek RD" />
        <Divider />
        <SettingsItem type="select" label="Farm" body="Farm 3" />
        <SettingsItem type="select" label="Block" body="4" />
        <SettingsItem type="select" label="Sub" body="A" />
        <SettingsItem type="select" label="Pad" body="12B" />
        <Divider />
      </View>
      {/* Actions */}
      <View style={styles.actions}>
        <Link href="/" asChild>
          <Button
            title="Log Out"
            textColor={Colours.textLevel2}
            backgroundColor="transparent"
            border
          />
        </Link>
        <Link href="/dashboard" asChild>
          <Button
            title="Start"
            textColor={Colours.textLevel3}
            style={StyleSheet.create({ flex: 1 })}
          />
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    borderRadius: 32,
    padding: 16,
    paddingTop: 32,
    marginTop: 8,
    marginHorizontal: 16,
    gap: 16,
  },
  nav: {
    width: "100%",

    flexDirection: "row",
    justifyContent: "space-between",
  },
  actions: {
    width: "100%",

    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  content: {
    flex: 1,
    width: "100%",
    gap: 8,
  },
  page_heading: {
    alignItems: "center",
    width: "100%",
  },
});

export default SetupPage;
