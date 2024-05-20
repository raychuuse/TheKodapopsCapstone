import { useContext, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Import Component
import Button from './button';
import Modal from './modal';

// Import Style Components
import * as Type from './typography';
import { Colours } from './colours';
import { useSelections } from '../context/selectionContext';

/**
 * SettingsItem Component
 *
 * This component renders a settings item that allows the user to select from a list of options.
 * It includes a label, a text display of the selected option, and a button to open a modal with a picker.
 *
 * @param {Object} props - Component props
 * @param {string} [props.type] - The type of the button icon
 * @param {number} [props.startOption=0] - The initial selected option
 * @param {string} [props.label="label"] - The label for the settings item
 * @param {Array} [props.options=[{ label: 'Label', value: 0 }]] - The list of options for the picker
 * @param {Object} [props.style] - Additional styles for the component
 * @param {boolean} [props.isDisabled=false] - Boolean indicating if the button is disabled
 *
 * @returns {JSX.Element} The rendered SettingsItem component
 */
const SettingsItem = ({
  type = '',
  startOption = 0,
  label = 'label',
  options = [{ label: 'Label', value: 0 }],
  style,
  isDisabled = false,
}) => {
  const [selectedOption, setSelectedOption] = useState(startOption); // State for the selected option
  const [pickerVisible, setPickerVisible] = useState(false); // State for the visibility of the picker modal

  // Context to get and update selections
  const {
    updateSiding,
    updateFarm,
    updateBlock,
    updateSub,
    updatePad,
    updateBurnt,
    getSiding,
    getFarm,
    getBlock,
    getSub,
    getPad,
    getBurnt,
    setFarmID,
    setBlockID,
  } = useSelections();

  /**
   * Change data based on the selected option
   * @param {Array} values - The list of options
   */
  const changeData = (values) => {
    const newVal = getCurItem(values);
    switch (label) {
      case 'Siding':
        updateSiding(newVal);
        break;
      case 'Farm':
        updateFarm(newVal);
        setFarmID(selectedOption);
        break;
      case 'Block':
        updateBlock(newVal);
        setBlockID(selectedOption);
        break;
      case 'Sub':
        updateSub(newVal);
        break;
      case 'Pad':
        updatePad(newVal);
        break;
      case 'Burnt':
        updateBurnt(newVal);
        break;
    }
  };

  /**
   * Get the current item based on the selected option
   * @param {Array} values - The list of options
   * @returns {string} The label of the selected option
   */
  const getCurItem = (values) => {
    return values.find((item) => item.value == selectedOption)?.label;
  };

  return (
    <>
      {/* Modal to select the option */}
      <Modal
        isVisible={pickerVisible}
        onClose={() => {
          setPickerVisible(!pickerVisible);
          changeData(options);
        }}
        buttonIcon='check-circle-outline'
      >
        <View style={{ gap: 16, width: '100%' }}>
          <Type.Title1 style={{ textAlign: 'center' }}>
            Select {label}
          </Type.Title1>
          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue) => setSelectedOption(itemValue)}
            style={{
              borderRadius: 16,
              backgroundColor: Colours.bgLevel6,
              width: '100%',
            }}
          >
            <Picker.Item
              value={0}
              label='Please Select an Option'
              style={{ width: '100%' }}
            />
            {options.map((option) => (
              <Picker.Item
                key={option.value}
                value={option.value}
                label={option.label}
                style={{ width: '100%' }}
              />
            ))}
          </Picker>
        </View>
      </Modal>

      {/* Main view for the settings item */}
      <View style={[styles.item, style]}>
        {/* Label */}
        <Type.Title3 style={styles.label}>{label}:</Type.Title3>

        {/* Display the selected option */}
        <Text
          style={[Type.styles.body, styles.body]}
          numberOfLines={1}
        >
          {label == 'Siding' ? getSiding() : getCurItem(options)}
        </Text>

        {/* Button to open the picker modal */}
        <Button
          iconName={type == 'location' ? 'edit-location-alt' : 'edit'}
          iconColor={Colours.textLevel3}
          textColor={Colours.textLevel3}
          backgroundColor={Colours.bgLevel3}
          border
          borderWidth={1}
          iconSize={28}
          style={styles.button}
          onPress={() => setPickerVisible(!pickerVisible)}
          isDisabled={isDisabled}
        />
      </View>
    </>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  item: {
    flexDirection: 'row', // Layout children in a row
    width: '100%', // Full width
    gap: 22, // Space between elements
    paddingHorizontal: 16, // Horizontal padding
    paddingVertical: 4, // Vertical padding
    alignItems: 'center', // Align items to center
  },
  button: {
    paddingHorizontal: 4, // Horizontal padding
    paddingVertical: 4, // Vertical padding
  },
  body: {
    flex: 1, // Flex to fill available space
    textTransform: 'capitalize', // Capitalize text
  },
  label: {
    textTransform: 'capitalize', // Capitalize text
  },
});

export default SettingsItem;
