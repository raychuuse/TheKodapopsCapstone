import { useContext, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Import Component
import Button from './button';
import Modal from './modal';

// Import Style Components
import * as Type from './typography';
import { Colours } from './colours';
import {useSelections } from '../context/selectionContext';

const SettingsItem = ({
  type = '',
  startOption = 0,
  label = "label",
  options = [{ label: 'Label', value: 0 }],
  style
}) => {
  const [selectedOption, setSelectedOption] = useState(startOption);
  const [pickerVisable, setPickerVisable] = useState(false);
  const {updateSiding, updateFarm, updateBlock, updateSub, updatePad, updateBurnt} = useSelections();


  const changeData = (values) => {
    newVal = getCurItem(values);
    switch (label) {
      case "Siding":
        updateSiding(newVal);
      case "Farm":
        updateFarm(newVal);
      case "Block":
        updateBlock(newVal);
      case "Sub":
        updateSub(newVal);
      case "Pad":
        updatePad(newVal);
      case "Burnt":
        updateBurnt(newVal);
  }
}

  const getCurItem = (values) => {
    return (values.find((item) => item.value == selectedOption)?.label);
  }
  return (
    <>
      <Modal
        isVisible={pickerVisable}
        onClose={() => {
          setPickerVisable(!pickerVisable);
          // Make it so this modal isnt needed
          changeData(options);}}
        buttonIcon='check-circle-outline'
      >
        <View style={{ gap: 16, width: '100%' }}>
          <Type.Title1 style={{ textAlign: 'center' }}>
            Select {label}
          </Type.Title1>
          <Picker
            selectedValue={selectedOption}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedOption(itemValue)
            }
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
              key = {option.value}
              value={option.value}
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
          {getCurItem(options)}
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
          onPress={() => {
            setPickerVisable(!pickerVisable);
          }}
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
