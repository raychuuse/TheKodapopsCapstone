import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import Components
import CustomModal from './modal';
import BinList from './binList';

// Import Styles
import { Title1 } from '../styles/typography';

// Import Provider
import { useTheme } from '../styles/themeContext';
import { useRun } from '../context/runContext';
import { useModal } from '../context/modalContext';
import React from "react";

const ModalSidingDetails = () => {
  // Providers
  const { theme } = useTheme();
  const { getStop, getLoco } = useRun();
  const {
    sidingToViewID,
    modalSidingVisible,
    closeSidingModal,
    selectedSidingID,
  } = useModal();

  if (sidingToViewID == null) return;

  // Data
  const stop = getStop(sidingToViewID);
  const loco = getLoco();
  const complete = stop.collectComplete && stop.dropOffComplete;

  return (
    <CustomModal
      onClose={closeSidingModal}
      isVisible={modalSidingVisible}
      style={[
        { width: '85%', height: '90%' },
        complete && { backgroundColor: theme.spCompleteBG },
        stop.stopID === selectedSidingID && {
          backgroundColor: theme.spSelectedBG,
        },
      ]}
      buttonIcon=''
    >
      {/* Siding Details */}
      {/* Header */}
      <View style={[Styles.HeaderContainer, { borderColor: theme.textLevel2 }]}>
        <MaterialIcons
          name='pin-drop'
          size={28}
          color={
            complete
              ? theme.spCompleteBGText
              : stop.stopID === selectedSidingID
              ? theme.spSelectedBGText
              : theme.textLevel2
          }
        />
        <Title1
          style={[
            complete
              ? { color: theme.spCompleteBGText }
              : theme.spPendingText,
            stop.stopID === selectedSidingID
              ? { color: theme.spSelectedBGText }
              : theme.textLevel2,
          ]}
        >
          {stop.sidingName}
        </Title1>
        <TouchableOpacity
          style={Styles.closeButton}
          onPress={closeSidingModal}
        >
          <MaterialCommunityIcons
            name='close-circle-outline'
            size={36}
            color={
              complete
                ? theme.spCompleteBGText
                : stop.stopID === selectedSidingID
                ? theme.spSelectedBGText
                : theme.textLevel2
            }
          />
        </TouchableOpacity>
      </View>
      {/* Controls */}

      {/* Bin Lists */}
      <View
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'row',
          gap: 16,
          paddingHorizontal: 8,
          paddingTop: 16,
        }}
      >
        {/* Drop */}
        <BinList
          type={'LOCO'}
          stopID={sidingToViewID}
        />
        {/* Collect */}
        <BinList
          type={'SIDING'}
          stopID={sidingToViewID}
        />
      </View>
    </CustomModal>
  );
};

const Styles = StyleSheet.create({
  HeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 8,
    borderStyle: 'solid',
    borderBottomWidth: 2,
    paddingLeft: 6,
    paddingBottom: 6,
  },
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    minWidth: 48,
    minHeight: 48,
  },
  debug: {
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: 'red',
  },
});

export default ModalSidingDetails;
