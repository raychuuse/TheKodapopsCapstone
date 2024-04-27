import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import Components
import CustomModal from './modal';
import BinList from './binList';

// Import Styles
import { Title1 } from '../styles/typography';
import { useTheme } from '../styles/themeContext';

// Import Provider
import { useRun } from '../context/runContext';

const ModalSidingDetails = ({
  onClose,
  isVisible = true,
  sidingToViewID = 2,
}) => {
  // Providers
  const { theme } = useTheme();
  const { getSiding } = useRun();

  // Data
  const siding = getSiding(sidingToViewID);
  return (
    <CustomModal
      onClose={onClose}
      isVisible={isVisible}
      style={[
        { width: '85%', height: '90%' },
        siding.isCompleted && { backgroundColor: theme.spCompleteBG },
        siding.isSelected && { backgroundColor: theme.spSelectedBG },
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
            siding.isCompleted
              ? theme.spCompleteBGText
              : siding.isSelected
              ? theme.spSelectedBGText
              : theme.textLevel2
          }
        />
        <Title1
          style={[
            siding.isCompleted
              ? { color: theme.spCompleteBGText }
              : theme.spPendingText,
            siding.isSelected
              ? { color: theme.spSelectedBGText }
              : theme.textLevel2,
          ]}
        >
          {siding.name}
        </Title1>
        <TouchableOpacity
          style={Styles.closeButton}
          onPress={onClose}
        >
          <MaterialCommunityIcons
            name='close-circle-outline'
            size={36}
            color={
              siding.isCompleted
                ? theme.spCompleteBGText
                : siding.isSelected
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
          BinData={siding.binsDrop}
          binListName='binsDrop'
          sidingId={sidingToViewID}
        />
        {/* Collect */}
        <BinList
          BinData={siding.binsCollect}
          binListName='binsCollect'
          sidingId={sidingToViewID}
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
