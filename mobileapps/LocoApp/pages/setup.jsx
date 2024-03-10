import React from "react";
import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";

// Import Components
import Button from "../components/button";
import GreetingMessage from "../lib/greetingMessage";
import SettingsItem from "../components/settingsItem";

// Import Styling Components
import { LargeTitle, Title1 } from "../styles/typography";
import { Colours } from "../styles/colours";

const SetupPage = () => {
  return (
    <View style={styles.page}>
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
          <SettingsItem type="train" label="Locomotive" body="Loco #123456" />
        </View>
        {/* Actions */}
        <View style={styles.actions}>
          <Link href="/" asChild>
            <Button title="Log Out" textColor={Colours.textLevel2} backgroundColor="transparent" border />
          </Link>
          <Link href="/dashboard" asChild>
            <Button title="Start" textColor={Colours.textLevel3} style={StyleSheet.create({ flex: 1 })} />
          </Link>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#574294",
    padding: "6%",
  },
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
    width: "80%",
    maxWidth: 500,
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
