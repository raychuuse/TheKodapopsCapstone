import { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Import Component
import Button from './button';
import Modal from './modal';

// Import Style Components
import * as Type from '../styles/typography';
import { Colours } from '../styles/colours';
import { useTheme } from '../styles/themeContext';

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

  const { theme } = useTheme();

  const handleValueChange = async (itemValue, itemIndex) => {
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
              backgroundColor: theme.bgLevel6,
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
          style={[Type.styles.body, styles.body, { color: theme.body }]}
          numberOfLines={1}
        >
          {options.find((item) => item.id == selectedOption)?.label ??
            'Please Select an Option'}
        </Text>

        <Button
          iconName={type == 'location' ? 'edit-location-alt' : 'edit'}
          iconColor={theme.textLevel3}
          textColor={theme.textLevel3}
          backgroundColor={theme.bgLevel3}
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
