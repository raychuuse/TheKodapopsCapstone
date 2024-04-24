import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import Components
import CustomModal from './modal';
import BinList from './binList';
import { RunMockData } from '../data/RunMockData';

// Import Styles
import { Title1 } from '../styles/typography';
import { useTheme } from '../styles/themeContext';

const ModalSidingDetails = ({
  runData = RunMockData,
  setRunData,
  onClose,
  isVisible = true,
  sidingToViewID = 2,
}) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <CustomModal
      onClose={onClose}
      isVisible={isVisible}
      style={[
        { width: '85%', height: '90%' },
        runData.sidings.find((item) => item.id === sidingToViewID).isCompleted
          ? { backgroundColor: theme.spCompleteBG }
          : null,
        runData.sidings.find((item) => item.id === sidingToViewID).isSelected
          ? { backgroundColor: theme.spSelectedBG }
          : null,
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
            runData.sidings.find((item) => item.id === sidingToViewID)
              .isCompleted
              ? theme.spCompleteBGText
              : runData.sidings.find((item) => item.id === sidingToViewID)
                  .isSelected
              ? theme.spSelectedBGText
              : theme.textLevel2
          }
        />
        <Title1
          style={[
            runData.sidings.find((item) => item.id === sidingToViewID)
              .isCompleted
              ? { color: theme.spCompleteBGText }
              : theme.spPendingText,
            runData.sidings.find((item) => item.id === sidingToViewID)
              .isSelected
              ? { color: theme.spSelectedBGText }
              : theme.textLevel2,
          ]}
        >
          {runData.sidings.find((item) => item.id === sidingToViewID).name}
        </Title1>
        <TouchableOpacity
          style={Styles.closeButton}
          onPress={onClose}
        >
          <MaterialCommunityIcons
            name='close-circle-outline'
            size={36}
            color={
              runData.sidings.find((item) => item.id === sidingToViewID)
                .isCompleted
                ? theme.spCompleteBGText
                : runData.sidings.find((item) => item.id === sidingToViewID)
                    .isSelected
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
          BinData={
            runData.sidings.find((item) => item.id === sidingToViewID).binsDrop
          }
          binListName='binsDrop'
          sidingId={sidingToViewID}
          runData={runData}
          setRunData={setRunData}
        />
        {/* Collect */}
        <BinList
          BinData={
            runData.sidings.find((item) => item.id === sidingToViewID)
              .binsCollect
          }
          binListName='binsCollect'
          sidingId={sidingToViewID}
          runData={runData}
          setRunData={setRunData}
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
