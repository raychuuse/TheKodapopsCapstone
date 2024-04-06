import React from "react";
import { Modal, StyleSheet, View, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { selectionAsync } from "expo-haptics";

const CustomModal = ({ isVisible, onClose, children, buttonIcon = "close-circle-outline", style }) => {
  return (
    <Modal transparent={true} visible={isVisible} animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPressOut={() => {
          onClose();
          selectionAsync();
        }} // When the user taps outside the modal content, it will close
      >
        <BlurView intensity={100} style={styles.blurView} tint="dark">
          <TouchableOpacity
            activeOpacity={1} // Prevents the press from triggering the BlurView's onPressOut
            style={[styles.modalContent, style]}>
            {children}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                onClose();
                selectionAsync();
              }}>
              <MaterialCommunityIcons name={buttonIcon} size={56} color="white" />
            </TouchableOpacity>
          </TouchableOpacity>
        </BlurView>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 32,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    bottom: -76,
    left: 0,
  },
});

export default CustomModal;
