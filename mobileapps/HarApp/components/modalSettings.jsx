import { View, ScrollView, StyleSheet} from 'react-native';

// Import Styles
import { Colours } from './colours';
import {Title1, Subhead, Footnote, Strong, Title2, Title3} from './typography';

// Import components
import SettingsItem from './settingsItem';
import CustomModal from './modal';
import Divider from './divider';
import Button from "./button";
import {MaterialIcons} from "@expo/vector-icons";
import {useBins} from "../context/binContext";

// Mock Data
const farmOptions = [
  { label: 'Green Valley Farm', value: 1 },
  { label: 'Sunshine Plantations', value: 2 },
  { label: 'Riverbend Agriculture', value: 3 },
  { label: 'Crestwood Cane Fields', value: 4 },
];

const sidingOptions = [
  { label: 'Babinda', value: 1 },
  { label: 'Tully', value: 2 },
  { label: 'Innisfail', value: 3 },
  { label: 'Mourilyan', value: 4 },
  { label: 'South Johnstone', value: 5 },
  { label: 'Gordonvale', value: 6 },
  { label: 'Mossman', value: 7 },
  { label: 'Proserpine', value: 8 },
  { label: 'Ayr', value: 9 },
  { label: 'Ingham', value: 10 },
  { label: 'Lucinda', value: 11 },
  { label: 'Bundaberg', value: 12 },
  { label: 'Maryborough', value: 13 },
  { label: 'Isis', value: 14 },
  { label: 'Mackay', value: 15 },
];

const blockOptions = [
  { label: 'Block A - North Field', value: 1 },
  { label: 'Block B - South Field', value: 2 },
  { label: 'Block C - East Field', value: 3 },
  { label: 'Block D - West Field', value: 4 },
];

const subBlockOptions = [
  { label: 'Sub-Block 1', value: 1 },
  { label: 'Sub-Block 2', value: 2 },
  { label: 'Sub-Block 3', value: 3 },
  { label: 'Sub-Block 4', value: 4 },
];

const padOptions = [
  { label: 'Pad 101 - North End', value: 1 },
  { label: 'Pad 102 - Near River', value: 2 },
  { label: 'Pad 103 - Central', value: 3 },
  { label: 'Pad 104 - South End', value: 4 },
];

const burntOptions = [
  { label: 'Yes', value: 1 },
  { label: 'No', value: 2 },
];

/**
 * ModalSettings Component
 *
 * This component renders a modal with settings options for the consignment.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isVisable - Boolean to control the visibility of the modal
 * @param {function} props.setIsVisable - Function to set the visibility of the modal
 *
 * @returns {JSX.Element} The rendered ModalSettings component
 */
const ModalSettings = ({ isVisable, setIsVisable }) => {
  const { onReconnected, refreshSidingData } = useBins();
  return (
      <CustomModal
          isVisible={isVisable}
          onClose={() => setIsVisable(false)}
          style={{width: '80%', maxWidth: 800, height: '70%'}}
      >
        {/* Header */}
        <View style={[styles.HeaderContainer, {borderColor: Colours.textLevel2}]}>
          <MaterialIcons
              name='settings'
              size={28}
              color={Colours.textLevel2}
          />
          <Title1>Settings</Title1>
        </View>
        {/* Page Content */}
        <View style={styles.content}>
          {/* Refresh Data */}
          <View
              style={{
                flexDirection: 'row',
                width: '100%',
                gap: 22,
                paddingHorizontal: 16,
                paddingVertical: 4,
                alignItems: 'center',
              }}
          >
            <Button
                title='Refresh Siding'
                iconName={'refresh'}
                iconColor={Colours.textLevel3}
                textColor={Colours.textLevel3}
                backgroundColor={Colours.bgLevel3}
                border
                borderWidth={1}
                iconSize={28}
                style={{paddingVertical: 4, width: '100%'}}
                onPress={() => refreshSidingData()}
            />
          </View>
          {/* Refresh Data */}
          <View
              style={{
                flexDirection: 'row',
                width: '100%',
                gap: 22,
                paddingHorizontal: 16,
                paddingVertical: 4,
                alignItems: 'center',
              }}
          >
            <Button
                title='Send Offline Data'
                iconName={'swap-vert'}
                iconColor={Colours.textLevel3}
                textColor={Colours.textLevel3}
                backgroundColor={Colours.bgLevel3}
                border
                borderWidth={1}
                iconSize={28}
                style={{paddingVertical: 4, width: '100%'}}
                onPress={() => onReconnected()}
            />
          </View>
          {/* Log Out */}
          <View
              style={{
                flexDirection: 'row',
                width: '100%',
                gap: 22,
                paddingHorizontal: 16,
                paddingVertical: 4,
                alignItems: 'center',
              }}
          >
            <Button
                title='Log Out'
                iconName={'logout'}
                iconColor={Colours.textLevel3}
                textColor={Colours.textLevel3}
                backgroundColor={Colours.bgLevel3}
                border
                borderWidth={1}
                iconSize={28}
                style={{paddingVertical: 4, width: '100%'}}
                onPress={() => router.replace('/')}
            />
          </View>
        </View>
      </CustomModal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    width: '100%',
    gap: 8,
    paddingVertical: 16,
  },
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
});
export default ModalSettings;
