import { View } from 'react-native';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

// Styles
import { Colours } from '../styles/colours';

// Components
import NotificationBell from './notificationBell';
import Button from './button';
import CustomModal from './modal';
import RunSheet from './runSheet';

const BottomBar = () => {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [routeVisible, setRouteVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  return (
    <>
      {/* Settings Modal */}
      <CustomModal
        isVisible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        style={{ width: '80%', maxWidth: 800, height: '70%' }}
      ></CustomModal>
      {/* Notifications Modal */}
      <CustomModal
        isVisible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
        style={{ width: '80%', maxWidth: 800, height: '70%' }}
      ></CustomModal>
      {/* Route Modal */}
      <CustomModal
        isVisible={routeVisible}
        onClose={() => setRouteVisible(false)}
        style={{ width: '85%', height: '90%' }}
        buttonIcon=''
      >
        <RunSheet onClose={() => setRouteVisible(false)} />
      </CustomModal>
      {/* Help Modal */}
      <CustomModal
        isVisible={helpVisible}
        onClose={() => setHelpVisible(false)}
        style={{ width: '80%', maxWidth: 800, height: '70%' }}
      ></CustomModal>
      {/* Nav Bar */}
      <LinearGradient
        colors={['rgba(225,225,225,0.7)', 'rgba(225,225,225,0.4)']}
        style={{
          flexDirection: 'row',
          paddingLeft: 32,
          paddingRight: 16,
          paddingTop: 4,
        }}
      >
        <NotificationBell
          backgroundColor='transparent'
          iconColor={Colours.textLevel3}
          notificationCount={5}
          iconSize={48}
          onPress={() => setNotificationsVisible(true)}
        />
        <View style={{ marginStart: 'auto', flexDirection: 'row', gap: 8 }}>
          <Button
            backgroundColor='transparent'
            iconName='route'
            iconSize={48}
            onPress={() => setRouteVisible(true)}
          />
          <Button
            backgroundColor='transparent'
            iconName='settings'
            iconSize={48}
            onPress={() => setSettingsVisible(true)}
          />
          <Button
            backgroundColor='transparent'
            iconName='help'
            iconSize={48}
            onPress={() => setHelpVisible(true)}
          />
        </View>
      </LinearGradient>
    </>
  );
};

export default BottomBar;
