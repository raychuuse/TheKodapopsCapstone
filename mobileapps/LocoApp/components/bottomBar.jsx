import { View } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

// Styles
import { useTheme } from '../styles/themeContext';

// Components
import NotificationBell from './notificationBell';
import Button from './button';
import RunSheet from './runSheet';
import ModalSettings from './modalSettings';
import ModalNotifications from './modalNotifications';
import ModalTutorial from './modalTutorial';

const BottomBar = ({ notifications, setNotifications }) => {
  const [tutorialVisable, setTutorialVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [routeVisible, setRouteVisible] = useState(false);
  const { theme } = useTheme();
  return (
    <>
      {/* Tutorial Modal */}
      <ModalTutorial
        isVisible={tutorialVisable}
        onClose={() => setTutorialVisible(false)}
      />
      {/* Settings Modal */}
      <ModalSettings
        isVisible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
      {/* Notifications Modal */}
      <ModalNotifications
        isVisible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
        notifications={notifications}
        setNotifications={setNotifications}
      />
      {/* Route Modal */}
      <RunSheet
        isVisible={routeVisible}
        onClose={() => setRouteVisible(false)}
      />
      {/* Nav Bar */}
      <LinearGradient
        colors={theme.containerGradient}
        style={{
          flexDirection: 'row',
          paddingLeft: 32,
          paddingRight: 16,
          paddingTop: 4,
        }}
      >
        {/* Open Notification Modal Button */}
        <NotificationBell
          backgroundColor='transparent'
          iconColor={theme.textLevel3}
          notificationCount={notifications.length}
          iconSize={48}
          onPress={() => setNotificationsVisible(true)}
        />
        <View style={{ marginStart: 'auto', flexDirection: 'row', gap: 8 }}>
          {/* Open Run Details Modal Button */}
          <Button
            backgroundColor='transparent'
            iconName='route'
            iconSize={48}
            iconColor={theme.textLevel3}
            onPress={() => setRouteVisible(true)}
          />
          {/* Open Settings Modal Button */}
          <Button
            backgroundColor='transparent'
            iconName='settings'
            iconSize={48}
            iconColor={theme.textLevel3}
            onPress={() => setSettingsVisible(true)}
          />
          {/* Open Tutorial Modal Button */}
          <Button
            backgroundColor='transparent'
            iconName='help'
            iconSize={48}
            iconColor={theme.textLevel3}
            onPress={() => setTutorialVisible(true)}
          />
        </View>
      </LinearGradient>
    </>
  );
};

export default BottomBar;
