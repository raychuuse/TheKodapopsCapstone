import { View, StyleSheet } from 'react-native';

// Import Components
import Button from './button';
import NotificationBell from './notificationBell';
import { useBins } from '../context/binContext';

/**
 * BottomBar Component
 *
 * This component renders a bottom bar with buttons for notifications, tutorial, and settings.
 *
 * @param {Object} props - Component props
 * @param {Array} props.notifications - Array of notifications to display the count
 * @param {function} props.setNotificationVisable - Function to set the visibility of the notifications modal
 * @param {function} props.setTutorialVisable - Function to set the visibility of the tutorial modal
 * @param {function} props.setSettingsVisable - Function to set the visibility of the settings modal
 *
 * @returns {JSX.Element} The rendered BottomBar component
 */
const BottomBar = ({
  notifications,
  setNotificationVisable,
  setTutorialVisable,
  setSettingsVisable,
}) => {
  const { getOnMainPage } = useBins();

  return (
    <View
      style={{
        width: '100%', // Full width of the container
        flexDirection: 'row', // Layout children in a row
        justifyContent: 'space-between', // Space out children evenly
        paddingVertical: 16, // Vertical padding
        paddingLeft: 16, // Left padding
        paddingRight: 32, // Right padding
      }}
    >
      <View style={{ flexDirection: 'row', gap: 16, width: '100%' }}>
        {/* Open Settings Modal Button */}
        {getOnMainPage() && (
          <Button
            backgroundColor='transparent'
            iconName='settings'
            iconSize={48}
            iconColor={'#fff'}
            onPress={() => setSettingsVisable(true)}
          />
        )}
        <Button
          iconName='help-outline' // Icon for the button
          backgroundColor='transparent' // Transparent background
          iconSize={48} // Icon size
          iconColor='#fff' // Icon color
          onPress={() => setTutorialVisable(true)} // Show tutorial modal
          style={{ marginLeft: 'auto' }}
        />

        <NotificationBell
          backgroundColor='transparent' // Transparent background
          iconSize={48} // Icon size
          notificationCount={notifications.length} // Number of notifications
          onPress={() => setNotificationVisable(true)} // Show notifications modal
        />
      </View>
    </View>
  );
};

export default BottomBar;
