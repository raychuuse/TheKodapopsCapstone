import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//Styles
import { Title1 } from '../styles/typography';
import { Colours } from '../styles/colours';
import RunSheetAccordion from './runSheetAccordion';

const RunSheet = ({ runData, setRunData, onClose }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Header */}
      <View style={Styles.HeaderContainer}>
        <MaterialIcons
          name='route'
          size={28}
          color={Colours.textLevel2}
        />
        <Title1>Run Details</Title1>
        <TouchableOpacity
          style={Styles.closeButton}
          onPress={onClose}
        >
          <MaterialCommunityIcons
            name='close-circle-outline'
            size={36}
            color={Colours.textLevel2}
          />
        </TouchableOpacity>
      </View>
      {/* Run List */}
      <RunSheetAccordion
        style={Styles.RunListContainer}
        runData={runData}
        setRunData={setRunData}
      />
    </GestureHandlerRootView>
  );
};

const Styles = StyleSheet.create({
  RunListContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
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

export default RunSheet;
