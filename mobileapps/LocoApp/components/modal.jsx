import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../styles/themeContext';
import { selectionAsync } from 'expo-haptics';

const CustomModal = ({
  isVisible,
  onClose,
  children,
  buttonIcon = 'close-circle-outline',
  style,
}) => {
  const { theme } = useTheme();
  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <BlurView
          intensity={100}
          style={styles.blurView}
          tint='dark'
        />
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPressOut={() => {
            onClose();
            selectionAsync();
          }}
        />
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.bgModal },
            style,
          ]}
        >
          {children}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => {
              onClose();
              selectionAsync();
            }}
          >
            <MaterialCommunityIcons
              name={buttonIcon}
              size={56}
              color={theme.modalClose}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    width: '80%',
    borderRadius: 32,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    bottom: -76,
    left: 0,
  },
});

export default CustomModal;
