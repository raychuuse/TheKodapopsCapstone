import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

//Styles
import { Title1 } from '../styles/typography';
import { Colours } from '../styles/colours';
import RunSheetAccordion from './runSheetAccordion';

const data = [
  {
    name: 'Siding #1',
    drop: 11,
    collect: 11,
    isComplete: true,
    isSelected: false,
    renderContent: () => <Text>Dynamic Content 1</Text>,
  },
  {
    name: 'Siding #2',
    drop: 22,
    collect: 22,
    isComplete: true,
    isSelected: false,
    renderContent: () => <Text>Dynamic Content 2</Text>,
  },
  {
    name: 'Siding #3',
    drop: 33,
    collect: 33,
    isComplete: false,
    isSelected: true,
    renderContent: () => <Text>Dynamic Content 3</Text>,
  },
  {
    name: 'Siding #4',
    drop: 44,
    collect: 44,
    isComplete: false,
    isSelected: false,
    renderContent: () => <Text>Dynamic Content 4</Text>,
  },
  // Add more items as needed
];

const RunSheet = ({ onClose }) => {
  return (
    <>
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
        data={data}
      />
    </>
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
