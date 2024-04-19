import React from "react";
import { Text, StyleSheet } from "react-native";
import { Colours } from "./colours";

// H1 Component
export const H1 = ({ children, style }) => <Text style={[styles.h1, style]}>{children}</Text>;

// H2 Component
export const H2 = ({ children, style }) => <Text style={[styles.h2, style]}>{children}</Text>;

// H3 Component
export const H3 = ({ children, style }) => <Text style={[styles.h3, style]}>{children}</Text>;

// H4 Component
export const H4 = ({ children, style }) => <Text style={[styles.h4, style]}>{children}</Text>;

// H5 Component
export const H5 = ({ children, style }) => <Text style={[styles.h5, style]}>{children}</Text>;

// H6 Component
export const H6 = ({ children, style }) => <Text style={[styles.h6, style]}>{children}</Text>;

export const LargeTitle = ({ children, style }) => <Text style={[styles.largeTitle, style]}>{children}</Text>;

export const Title1 = ({ children, style }) => <Text style={[styles.title1, style]}>{children}</Text>;

export const Title2 = ({ children, style }) => <Text style={[styles.title3, style]}>{children}</Text>;

export const Title3 = ({ children, style }) => <Text style={[styles.title3, style]}>{children}</Text>;

export const Headline = ({ children, style }) => <Text style={[styles.headline, style]}>{children}</Text>;

export const Body = ({ children, style }) => <Text style={[styles.body, style]}>{children}</Text>;

export const Callout = ({ children, style }) => <Text style={[styles.callout, style]}>{children}</Text>;

export const Subhead = ({ children, style }) => <Text style={[styles.subhead, style]}>{children}</Text>;

export const Footnote = ({ children, style }) => <Text style={[styles.footnote, style]}>{children}</Text>;

export const Caption1 = ({ children, style }) => <Text style={[styles.caption1, style]}>{children}</Text>;

export const Caption2 = ({ children, style }) => <Text style={[styles.caption2, style]}>{children}</Text>;

export const Strong = ({ children, style }) => <Text style={[styles.strong, style]}>{children}</Text>;

// Styles
export const styles = StyleSheet.create({
  strong: { fontWeight: "bold" },
  h1: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 4,
    color: Colours.textLevel1,
  },
  h2: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 4,
    color: Colours.textLevel1,
  },
  h3: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 3,
    color: Colours.textLevel1,
  },
  h4: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 3,
    color: Colours.textLevel1,
  },
  h5: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 2,
    color: Colours.textLevel1,
  },
  h6: {
    fontSize: 14,
    fontWeight: "bold",
    marginVertical: 2,
    color: Colours.textLevel1,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: "bold",
    marginVertical: 2,
    color: Colours.textLevel1,
  },
  title1: {
    fontSize: 28,
    fontWeight: "600",
    marginVertical: 2,
    color: Colours.textLevel2,
  },
  title2: {
    fontSize: 22,
    fontWeight: "600",
    marginVertical: 2,
    color: Colours.textLevel3,
  },
  title3: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 2,
    color: Colours.textLevel3,
  },
  headline: {
    fontSize: 17,
    fontWeight: "500",
    marginVertical: 2,
  },
  body: {
    fontSize: 17,
    marginVertical: 2,
  },
  callout: {
    fontSize: 16,
    marginVertical: 2,
  },
  subhead: {
    fontSize: 15,
    marginVertical: 2,
  },
  footnote: {
    fontSize: 13,
    marginVertical: 2,
  },
  caption1: {
    fontSize: 12,
    marginVertical: 2,
  },
  caption2: {
    fontSize: 11,
    marginVertical: 2,
  },
});
