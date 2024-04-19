import { View, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Import Libs
import { removeNotification } from '../lib/notification';

// Import Styles
import { Title1, Title3 } from '../styles/typography';
import { Colours } from '../styles/colours';

// Import Mock Data
import { NotificationsMockData } from '../data/NotificationsMockData';

// Import Componetns
import CustomModal from './modal';
import NotificationItem from './notificationItem';
import Divider from './divider';

const ModalNotifications = ({
  isVisible,
  onClose,
  setNotifications,
  notifications = NotificationsMockData,
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
      isVisible={isVisible}
      onClose={onClose}
      style={{ width: '80%', maxWidth: 800, height: '70%' }}
    >
      {/* Header */}
      <View style={styles.HeaderContainer}>
        <MaterialIcons
          name='notifications'
          size={28}
          color={Colours.textLevel2}
        />
        <Title1>Notifications</Title1>

        {/* Notification Counter */}
        {notifications.length > 0 ? (
          <Title3
            style={{
              marginLeft: 'auto',
              marginRight: 16,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
              color: '#fff',
              backgroundColor: Colours.dangerBg,
            }}
          >
            {notifications.length} Unread
          </Title3>
        ) : null}
      </View>
      {/* Page Content */}
      <FlatList
        style={{ width: '100%' }}
        contentContainerStyle={styles.content}
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={<Divider />}
      />
    </CustomModal>
  );
};

export default ModalNotifications;

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
