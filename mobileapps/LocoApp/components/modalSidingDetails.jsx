import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import Components
import CustomModal from './modal';
import BinList from './binList';
import { RunMockData } from '../data/RunMockData';

// Import Styles
import { Title1 } from '../styles/typography';
import { Colours } from '../styles/colours';

const ModalSidingDetails = ({
  runData = RunMockData,
  setRunData,
  onClose,
  isVisible = true,
  sidingToViewID = 2,
}) => {
  // const sidingData = runData.sidings.filter((item) => item.id === sidingID);
  return (
    <CustomModal
      onClose={onClose}
      isVisible={isVisible}
      style={[
        { width: '85%', height: '90%' },
        runData.sidings.find((item) => item.id === sidingToViewID).isCompleted
          ? { backgroundColor: Colours.spCompleteBG }
          : null,
        runData.sidings.find((item) => item.id === sidingToViewID).isSelected
          ? { backgroundColor: Colours.spSelectedBG }
          : null,
      ]}
      buttonIcon=''
    >
      {/* Siding Details */}
      {/* Header */}
      <View style={Styles.HeaderContainer}>
        <MaterialIcons
          name='pin-drop'
          size={28}
          color={
            runData.sidings.find((item) => item.id === sidingToViewID)
              .isCompleted
              ? Colours.spCompleteBGText
              : runData.sidings.find((item) => item.id === sidingToViewID)
                  .isSelected
              ? Colours.spSelectedBGText
              : Colours.textLevel2
          }
        />
        <Title1
          style={[
            runData.sidings.find((item) => item.id === sidingToViewID)
              .isCompleted
              ? { color: Colours.spCompleteBGText }
              : Colours.spPendingText,
            runData.sidings.find((item) => item.id === sidingToViewID)
              .isSelected
              ? { color: Colours.spSelectedBGText }
              : Colours.textLevel2,
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
                ? Colours.spCompleteBGText
                : runData.sidings.find((item) => item.id === sidingToViewID)
                    .isSelected
                ? Colours.spSelectedBGText
                : Colours.textLevel2
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
    borderColor: Colours.textLevel2,
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
