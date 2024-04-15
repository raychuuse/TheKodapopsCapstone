export const NotificationsMockData = [
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
];
