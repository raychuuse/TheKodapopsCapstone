import { View, FlatList } from 'react-native';

// Import Styles
import { Title1, Subhead } from './typography';

// Import Components
import Divider from './divider';
import CustomModal from './modal';
import NotificationItem from './notificationItem';

// Import Libs
import { removeNotification } from '../lib/notification';

/**
 * ModalNotifications Component
 *
 * This component renders a modal that displays a list of recent notifications.
 *
 * @param {Object} props - Component props
 * @param {function} props.setIsVisable - Function to set the visibility of the modal
 * @param {boolean} props.isVisable - Boolean to control the visibility of the modal
 * @param {Array} props.notifications - Array of notifications to display
 * @param {function} props.setNotifications - Function to update the list of notifications
 *
 * @returns {JSX.Element} The rendered ModalNotifications component
 */
const ModalNotifications = ({
  setIsVisable,
  isVisable,
  notifications,
  setNotifications,
}) => {
  /**
   * Function to render each notification item
   * @param {Object} param0 - Object containing the notification item
   * @param {Object} param0.item - The notification item to render
   *
   * @returns {JSX.Element} The rendered NotificationItem component
   */
  const renderNotification = ({ item }) => (
    <NotificationItem
      icon={item.icon} // Icon for the notification
      label={item.message} // Message for the notification
      type={item.type} // Type of the notification
      onRemove={() => removeNotification(item.id, setNotifications)} // Handler to remove the notification
    />
  );

  return (
    <CustomModal
      isVisible={isVisable} // Control modal visibility
      onClose={() => setIsVisable(false)} // Close modal handler
    >
      <View style={{ width: '100%', height: '70%', gap: 16 }}>
        <View style={{ marginBottom: 32, gap: 8 }}>
          <Title1>Recent Notifications</Title1>
          <Subhead>
            Here's a list of your most recent notifications. Stay up-to-date
            with the latest alerts and updates.
          </Subhead>
          {/* List of notifications */}
          <FlatList
            data={notifications} // Data for the list
            renderItem={renderNotification} // Function to render each item
            keyExtractor={(item) => item.id} // Key extractor for each item
            ItemSeparatorComponent={<Divider />} // Divider component between items
          />
        </View>
      </View>
    </CustomModal>
  );
};

export default ModalNotifications;
