import { View, StyleSheet } from 'react-native';

// Import Components
import Button from './button';
import NotificationBell from './notificationBell';

const BottomBar = ({
  notifications,
  setNotificationVisable,
  setTutorialVisable,
  setSettingsVisable,
}) => {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        paddingLeft: 16,
        paddingRight: 32,
      }}
    >
      <View style={{ flexDirection: 'row' }}>
        <Button
          iconName='help-outline'
          backgroundColor='transparent'
          iconSize={48}
          iconColor='#fff'
          onPress={() => setTutorialVisable(true)}
        />
      </View>
      <NotificationBell
        backgroundColor='transparent'
        iconSize={48}
        notificationCount={notifications.length}
        onPress={() => setNotificationVisable(true)}
      />
    </View>
  );
};

export default BottomBar;
