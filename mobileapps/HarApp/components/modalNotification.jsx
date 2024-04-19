import { View, FlatList } from 'react-native';

// Import Styles
import { Title1, Subhead } from './typography';

// Import Components
import Divider from './divider';
import CustomModal from './modal';
import NotificationItem from './notificationItem';

// Import Libs
import { removeNotification } from '../lib/notification';

const ModalNotifications = ({
  setIsVisable,
  isVisable,
  notifications,
  setNotifications,
}) => {
  const renderNotification = ({ item }) => (
    <NotificationItem
      icon={item.icon}
      label={item.message}
      type={item.type}
      onRemove={() => removeNotification(item.id, setNotifications)}
    />
  );

  return (
    <CustomModal
      isVisible={isVisable}
      onClose={() => setIsVisable(false)}
    >
      <View style={{ width: '100%', height: '70%', gap: 16 }}>
        <View style={{ marginBottom: 32, gap: 8 }}>
          <Title1>Recent Notifications</Title1>
          <Subhead>
            Here's a list of your most recent notifications. Stay up-to-date
            with the latest alerts and updates.
          </Subhead>
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={<Divider />}
          />
        </View>
      </View>
    </CustomModal>
  );
};

export default ModalNotifications;
