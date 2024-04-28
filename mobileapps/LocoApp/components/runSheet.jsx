import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

//Styles
import { Title1 } from '../styles/typography';

// Import Components
import CustomModal from './modal';
import RunSheetSidingItem from './runSheetSidingItem';
import Divider from './divider';

// Import Provider
import { useTheme } from '../styles/themeContext';
import { useRun } from '../context/runContext';

const RunSheet = ({ onClose, isVisible }) => {
  // Providers
  const { theme } = useTheme();
  const { runData } = useRun();

  // List Render Item
  const renderItem = ({ item }) => {
    return <RunSheetSidingItem sidingId={item.id} />;
  };

  return (
    <CustomModal
      isVisible={isVisible}
      onClose={onClose}
      style={{ width: '80%', maxWidth: 800, height: '70%' }}
      buttonIcon=''
    >
      {/* Header */}
      <View style={[Styles.HeaderContainer, { borderColor: theme.textLevel2 }]}>
        <MaterialIcons
          name='route'
          size={28}
          color={theme.textLevel2}
        />
        <Title1>Run Details</Title1>
        <TouchableOpacity
          style={Styles.closeButton}
          onPress={onClose}
        >
          <MaterialCommunityIcons
            name='close-circle-outline'
            size={36}
            color={theme.textLevel2}
          />
        </TouchableOpacity>
      </View>
      {/* Run List */}
      <FlatList
        style={Styles.content}
        data={runData.sidings}
        renderItem={renderItem}
        ItemSeparatorComponent={<Divider style={{ marginVertical: 10 }} />}
      />
    </CustomModal>
  );
};

const Styles = StyleSheet.create({
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
    borderBottomWidth: 2,
    paddingLeft: 6,
    paddingBottom: 6,
  },
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    minWidth: 48,
    minHeight: 48,
  },
  debug: {
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: 'red',
  },
});

export default RunSheet;
