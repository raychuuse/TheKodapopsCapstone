import React from 'react';
import { Modal, StyleSheet, View, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { selectionAsync } from 'expo-haptics';

/**
 * CustomModal Component
 *
 * This component renders a customizable modal with a blur background and a close button.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isVisible - Boolean to control the visibility of the modal
 * @param {function} props.onClose - Function to call when the modal is closed
 * @param {JSX.Element} props.children - The content to display inside the modal
 * @param {string} [props.buttonIcon='close-circle-outline'] - The icon for the close button
 * @param {Object} [props.style] - Additional styles for the modal content
 *
 * @returns {JSX.Element} The rendered CustomModal component
 */
const CustomModal = ({
  isVisible,
  onClose,
  children,
  buttonIcon = 'close-circle-outline',
  style,
}) => {
  return (
    <Modal
      transparent={true} // Make the background transparent
      visible={isVisible} // Control modal visibility
      animationType='fade' // Fade animation for the modal
      onRequestClose={onClose} // Handle back button press on Android
    >
      <View style={styles.container}>
        {/* Blur view for the background */}
        <BlurView
          intensity={100} // Blur intensity
          style={styles.blurView}
          tint='dark' // Dark tint for the blur
        />
        {/* Touchable backdrop to close the modal */}
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPressOut={() => {
            onClose(); // Close the modal
            selectionAsync(); // Trigger haptic feedback
          }}
        />
        {/* Modal content */}
        <View style={[styles.modalContent, style]}>
          {/* Render modal children */}
          {children}
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              onClose(); // Close the modal
              selectionAsync(); // Trigger haptic feedback
            }}
          >
            <MaterialCommunityIcons
              name={buttonIcon} // Icon name
              size={56} // Icon size
              color='white' // Icon color
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take up full screen
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  modalBackdrop: {
    position: 'absolute', // Position absolutely
    top: 0, // Top of the screen
    left: 0, // Left of the screen
    width: '100%', // Full width
    height: '100%', // Full height
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  blurView: {
    position: 'absolute', // Position absolutely
    width: '100%', // Full width
    height: '100%', // Full height
  },
  modalContent: {
    width: '80%', // Width of the modal content
    backgroundColor: 'white', // Background color
    borderRadius: 32, // Rounded corners
    padding: 20, // Padding inside the modal
    alignItems: 'center', // Center content horizontally
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 3.84, // Shadow radius
    elevation: 5, // Elevation for Android shadow
  },
  closeButton: {
    position: 'absolute', // Position absolutely
    bottom: -76, // Position below the modal content
    left: 0, // Align to the left
  },
});

export default CustomModal;
