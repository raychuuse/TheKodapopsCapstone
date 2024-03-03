import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, FlatList } from "react-native";

// Import Components
import GreetingMessage from "../components/greetingMessage";
import Button from "../components/button";
import CustomModal from "../components/modal";
import BinItem from "../components/binItem";
import SelectedSiding from "../components/selectedSiding";
import AddBinCamera from "../components/addBinCamera";

//Import Functions
import { FinishedAlert } from "../lib/alerts";

// Import Styling Components
import { LargeTitle, Title1, Headline, Title3 } from "../components/typography";
import { Colours } from "../components/colours";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const MainPage = () => {
  // Test Bin data
  const BinData = [
    { isFull: 1, binNum: 1224 },
    { isFull: 1, binNum: 2123 },
    { isFull: 0, binNum: 1232 },
    { isFull: 1, binNum: 1234 },
    { isFull: 1, binNum: 5637 },
    { isFull: 0, binNum: 5633 },
    { isFull: 0, binNum: 654 },
    { isFull: 0, binNum: 12 },
    { isFull: 0, binNum: 2345 },
    { isFull: 0, binNum: 7545 },
    { isFull: 0, binNum: 8765 },
    { isFull: 0, binNum: 2334 },
    { isFull: 0, binNum: 4632 },
  ];
  const [addBinVisable, setAddBinVisable] = useState(false);
  return (
    <View style={styles.body}>
      {/* Add Bin Modal */}
      <CustomModal
        isVisible={addBinVisable}
        onClose={() => setAddBinVisable(false)}
        buttonIcon="close-circle-outline"
        style={{ height: "60%", marginTop: 56 }}>
        <AddBinCamera modalCloser={() => setAddBinVisable(false)} />
      </CustomModal>
      {/* Page Headings */}
      <View style={styles.page_heading}>
        <LargeTitle>
          <GreetingMessage />
        </LargeTitle>
        <Title1>John Smith</Title1>
      </View>
      {/* Page Content */}
      <View style={styles.content}>
        {/* Selected Siding */}
        <SelectedSiding sidingName="Old Creek Rd" />
        {/* Bin List */}
        <View style={{ flex: 1, position: "relative" }}>
          {/* Bin List Header */}
          <View
            style={{
              width: "100%",
              position: "absolute",
              paddingHorizontal: 24,
              paddingVertical: 12,
              alignItems: "center",
              flexDirection: "row",
              gap: 16,
              backgroundColor: "rgb(235, 235, 235)",
              zIndex: 100,
              borderRadius: 12,
            }}>
            <Feather name={"download"} size={24} />
            <Title3 style={{ flex: 1 }}>{BinData.length} Bins</Title3>
            <TouchableOpacity onPress={() => setAddBinVisable(true)}>
              <MaterialCommunityIcons name={"line-scan"} size={24} />
            </TouchableOpacity>
          </View>
          {/* Bin List Body */}
          <FlatList
            data={BinData}
            renderItem={({ item }) => (
              <BinItem
                checked={item.isFull}
                binNumber={item.binNum}
                style={styles.binList}
              />
            )}
            style={styles.binList}
            ItemSeparatorComponent={<View style={styles.binListSeparator} />}
            ListFooterComponent={<View style={{ marginVertical: 32 }} />}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <Button
        title="Finished"
        style={StyleSheet.create({ width: "100%" })}
        onPress={FinishedAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  binListSeparator: {
    width: "80%",
    height: 1,
    backgroundColor: Colours.spAtSidingText,
    marginVertical: 10,
    marginLeft: "auto",
    marginRight: "auto",
    opacity: "0.3",
  },
  binList: {
    position: "relative",
    paddingHorizontal: 8,
    paddingTop: 58,
    borderRadius: 16,
    backgroundColor: Colours.bgOverlay,
    zIndex: 0,
  },
  body: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    borderRadius: 32,
    padding: 16,
    paddingTop: 32,
    gap: 16,
    marginTop: 8,
    marginHorizontal: 16,
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

export default MainPage;
