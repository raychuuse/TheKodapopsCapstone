import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Import Styles
import { Title1, Title3 } from '../styles/typography';
import { Colours } from '../styles/colours';

// Import Mock Data
import {
  SettingMockData_Run,
  SettingsMockData_Loco,
} from '../data/settingsMockData';

// Import Componetns
import CustomModal from './modal';
import SettingsItem from './settingsItem';
import Button from './button';

const ModalSettings = ({ isVisible, onClose }) => {
  return (
    <CustomModal
      isVisible={isVisible}
      onClose={onClose}
      style={{ width: '80%', maxWidth: 800, height: '70%' }}
    >
      {/* Header */}
      <View style={styles.HeaderContainer}>
        <MaterialIcons
          name='settings'
          size={28}
          color={Colours.textLevel2}
        />
        <Title1>Settings</Title1>
      </View>
      {/* Page Content */}
      <View style={styles.content}>
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
          <Title3
            style={{ flex: 1, textTransform: 'capitalize' }}
            numberOfLines={1}
          >
            John Smith
          </Title3>
          <Button
            iconName={'logout'}
            title='Log Out'
            iconColor={Colours.textLevel3}
            textColor={Colours.textLevel3}
            backgroundColor={Colours.bgLevel3}
            border
            borderWidth={1}
            iconSize={28}
            style={{ paddingVertical: 4 }}
            onPress={() => router.replace('/')}
          />
        </View>
        {/* Locomotive Selector */}
        <SettingsItem
          label='Locomotive'
          options={SettingsMockData_Loco}
          startOption={SettingsMockData_Loco[0].id}
        />
        {/* Run Selector */}
        <SettingsItem
          label='Run'
          options={SettingMockData_Run}
          startOption={SettingMockData_Run[0].id}
        />
      </View>
    </CustomModal>
  );
};

export default ModalSettings;

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
    borderColor: Colours.textLevel2,
    borderBottomWidth: 2,
    paddingLeft: 6,
    paddingBottom: 6,
  },
  debug: {
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: 'red',
  },
});
