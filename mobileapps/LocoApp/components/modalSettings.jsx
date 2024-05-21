import { View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Import Styles
import { Title1, Title3 } from '../styles/typography';

// Import Componetns
import CustomModal from './modal';
import Button from './button';
import { useTheme } from '../styles/themeContext';
import { lightTheme } from '../styles/themes';
import {useRun} from "../context/runContext";

// Import Colours

const ModalSettings = ({ isVisible, onClose }) => {
  const { theme, toggleTheme } = useTheme();
  const { refreshRunData, onReconnected } = useRun();
  return (
    <CustomModal
      isVisible={isVisible}
      onClose={onClose}
      style={{ width: '80%', maxWidth: 800, height: '70%' }}
    >
      {/* Header */}
      <View style={[styles.HeaderContainer, { borderColor: theme.textLevel2 }]}>
        <MaterialIcons
          name='settings'
          size={28}
          color={theme.textLevel2}
        />
        <Title1>Settings</Title1>
        <Button
          title={theme === lightTheme ? 'Dark Mode' : 'Light Mode'}
          iconName={theme === lightTheme ? 'dark-mode' : 'light-mode'}
          iconColor={theme.textLevel3}
          textColor={theme.textLevel3}
          backgroundColor={theme.bgLevel3}
          border
          borderWidth={1}
          iconSize={18}
          textStyle={{ fontSize: 18 }}
          style={{
            paddingVertical: 8,
            padding: 0,
            minHeight: 0,
            width: 150,
            marginLeft: 'auto',
            marginRight: 16,
            marginBottom: 10,
          }}
          onPress={toggleTheme}
        />
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
              <Title3
                  style={{ flex: 1, textTransform: 'capitalize' }}
                  numberOfLines={1}
              >
                  Refresh Run Data
              </Title3>
              <Button
                  title='Refresh'
                  iconName={'refresh'}
                  iconColor={theme.textLevel3}
                  textColor={theme.textLevel3}
                  backgroundColor={theme.bgLevel3}
                  border
                  borderWidth={1}
                  iconSize={28}
                  style={{ paddingVertical: 4 }}
                  onPress={() => refreshRunData()}
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
              <Title3
                  style={{ flex: 1, textTransform: 'capitalize' }}
                  numberOfLines={1}
              >
                  Send Offline Data
              </Title3>
              <Button
                  title='Send'
                  iconName={'swap-vert'}
                  iconColor={theme.textLevel3}
                  textColor={theme.textLevel3}
                  backgroundColor={theme.bgLevel3}
                  border
                  borderWidth={1}
                  iconSize={28}
                  style={{ paddingVertical: 4 }}
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
          <Title3
            style={{ flex: 1, textTransform: 'capitalize' }}
            numberOfLines={1}
          >
            John Smith
          </Title3>
          <Button
            title='Log Out'
            iconName={'logout'}
            iconColor={theme.textLevel3}
            textColor={theme.textLevel3}
            backgroundColor={theme.bgLevel3}
            border
            borderWidth={1}
            iconSize={28}
            style={{ paddingVertical: 4 }}
            onPress={() => router.replace('/')}
          />
        </View>
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
