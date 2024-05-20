import { useContext, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Import Component
import Button from './button';
import Modal from './modal';

// Import Style Components
import * as Type from './typography';
import { Colours } from './colours';

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
  options = [],
  style,
  setSelectedItem,
}) => {
  const [selectedOption, setSelectedOption] = useState(startOption);
  const [pickerVisable, setPickerVisable] = useState(false);

  const handleValueChange = (itemValue) => {
      if (setSelectedItem != null )
        setSelectedItem(itemValue);
      setSelectedOption(itemValue);
  };

  return (
      <>
        <Modal
            isVisible={pickerVisable}
            onClose={() => setPickerVisable(!pickerVisable)}
            buttonIcon='check-circle-outline'
            style={{ maxWidth: 400 }}
        >
          <View style={{ gap: 16, width: '100%' }}>
            <Type.Title1 style={{ textAlign: 'center' }}>
              Select {label}
            </Type.Title1>
            <Picker
                selectedValue={selectedOption}
                onValueChange={handleValueChange}
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
                      key={option.id}
                      value={option.id}
                      label={option.label}
                      style={{ width: '100%' }}
                  />
              ))}
            </Picker>
          </View>
        </Modal>
        <View style={[styles.item, style]}>
          <Type.Title3 style={styles.label}>{label}:</Type.Title3>
          <Text
              style={[Type.styles.body, styles.body]}
              numberOfLines={1}
          >
            {options.find((item) => item.id == selectedOption)?.label ?? 'Please Select an Option'}
          </Text>

          <Button
              iconName={type == 'location' ? 'edit-location-alt' : 'edit'}
              iconColor={Colours.textLevel3}
              textColor={Colours.textLevel3}
              backgroundColor={Colours.bgLevel3}
              border
              borderWidth={1}
              iconSize={28}
              style={styles.button}
              onPress={() => setPickerVisable(!pickerVisable)}
          />
        </View>
      </>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    width: '100%',
    gap: 22,
    paddingHorizontal: 16,
    paddingVertical: 4,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  body: {
    flex: 1,
    textTransform: 'capitalize',
  },
  label: {
    textTransform: 'capitalize',
  },
});

export default SettingsItem;
