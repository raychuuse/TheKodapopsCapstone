import { View, ScrollView } from 'react-native';

// Import Styles
import { Colours } from './colours';
import { Title1, Subhead, Footnote, Strong, Title2 } from './typography';

// Import components
import SettingsItem from './settingsItem';
import CustomModal from './modal';
import Divider from './divider';

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
  return (
    <CustomModal
      isVisible={isVisable} // Control modal visibility
      onClose={() => setIsVisable(false)} // Close modal handler
      buttonIcon='check-circle-outline' // Icon for the modal close button
    >
      <View style={{ width: '100%', gap: 8, maxHeight: 600 }}>
        <Title1 style={{ textAlign: 'center', marginBottom: 24 }}>
          Settings
        </Title1>
        <ScrollView
          style={{
            maxHeight: 600, // Maximum height for the ScrollView
            backgroundColor: Colours.bgLevel6, // Background color
            padding: 8, // Padding inside the ScrollView
            borderRadius: 10, // Rounded corners
          }}
        >
          <Title2 style={{ marginBottom: 16 }}>Consignment Settings</Title2>
          <Subhead>
            Configure your consignment details for where you will be dropping
            off your loads.
          </Subhead>
          <SettingsItem
            type='location' // Type of settings item
            label='Siding' // Label for the settings item
            options={sidingOptions} // Options for the picker
          />
          <Divider style={{ marginVertical: 8 }} />
          <SettingsItem
            type='select'
            label='Farm'
            options={farmOptions}
            style={{ marginTop: 8 }}
          />
          <SettingsItem
            type='select'
            label='Block'
            options={blockOptions}
            style={{ marginTop: 8 }}
          />
          <SettingsItem
            type='select'
            label='Sub'
            options={subBlockOptions}
            style={{ marginTop: 8 }}
          />
          <SettingsItem
            type='select'
            label='Pad'
            options={padOptions}
            style={{ marginTop: 8 }}
          />
          <SettingsItem
            type='select'
            label='Burnt'
            options={burntOptions}
            style={{ marginTop: 8 }}
          />
          <Footnote
            style={{
              marginTop: 32,
              color: '#fff', // Text color
              textAlign: 'center', // Center align text
              backgroundColor: `${Colours.dangerBg}80`, // Background color with transparency
              padding: 8, // Padding inside the footnote
              borderRadius: 16, // Rounded corners
              overflow: 'hidden', // Hide overflow content
            }}
          >
            <Strong>Warning: </Strong>Ensure accurate settings for smooth
            operations at the rail siding bins.
          </Footnote>
          <Divider style={{ marginVertical: 16 }} />
        </ScrollView>
      </View>
    </CustomModal>
  );
};

export default ModalSettings;
