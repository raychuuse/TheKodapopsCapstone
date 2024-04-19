import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import Components
import ModalSettings from '../../components/modalSettings';
import ModalNotifications from '../../components/modalNotification';
import ModalTutorial from '../../components/modalTutorial';
import BottomBar from '../../components/bottomBar';

// Mock Data
const notificationsData = [
  {
    id: '1',
    type: 'important',
    title: 'Locomotive ETA',
    message: 'Locomotive #1234 ETA to pickup point is 15 minutes.',
    timestamp: '2024-04-08 10:00',
    icon: 'train',
  },
  {
    id: '2',
    type: 'default',
    title: 'Bin Dropped Off',
    message:
      'Bin #5678 has been successfully dropped off at the collection point.',
    timestamp: '2024-04-08 09:45',
    icon: 'tray-arrow-down',
  },
  {
    id: '3',
    type: 'default',
    title: 'Bins Collected',
    message: 'Bins #5678, #5679 have been collected by Locomotive #1234.',
    timestamp: '2024-04-08 11:30',
    icon: 'tray-arrow-up',
  },
  {
    id: '4',
    type: 'danger',
    title: 'Error Notification',
    message: 'Error with Bin #5680: Weight exceeds maximum limit.',
    timestamp: '2024-04-08 12:15',
    icon: 'alert-box-outline',
  },
  // More notifications as needed...
];

const Layout = () => {
  const [settingsVisable, setSettingsVisable] = useState(false);
  const [notificationVisable, setNotificationVisable] = useState(false);
  const [tutorialVisable, setTutorialVisable] = useState(false);

  const [notifications, setNotifications] = useState(notificationsData);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* SettingsModals */}
      <ModalSettings
        isVisable={settingsVisable}
        setIsVisable={setSettingsVisable}
      />
      {/* Notification Modal */}
      <ModalNotifications
        isVisable={notificationVisable}
        setIsVisable={setNotificationVisable}
        notifications={notifications}
        setNotifications={setNotifications}
      />
      {/* Help Modal */}
      <ModalTutorial
        isVisable={tutorialVisable}
        setIsVisable={setTutorialVisable}
      />
      {/* Page */}
      <Slot />
      {/* Navigation */}
      <BottomBar
        notifications={notifications}
        setNotificationVisable={setNotificationVisable}
        setSettingsVisable={setSettingsVisable}
        setTutorialVisable={setTutorialVisable}
      />
      <StatusBar style='light' />
    </GestureHandlerRootView>
  );
};

export default Layout;
