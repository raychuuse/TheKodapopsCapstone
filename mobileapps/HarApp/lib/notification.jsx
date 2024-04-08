import * as Haptics from 'expo-haptics';

export const removeNotification = (id, setNotifications) => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  setNotifications((currentNotifications) =>
    currentNotifications.filter((notification) => notification.id !== id)
  );
};
