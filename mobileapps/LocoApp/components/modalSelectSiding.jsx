import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import Styles
import { Headline, Subhead, Title1, Title2 } from '../styles/typography';
import { useTheme } from '../styles/themeContext';

// Import Mock Data
import { RunMockData } from '../data/RunMockData';

// Import Componetns
import CustomModal from './modal';
import Divider from './divider';

const ModalSelectSiding = ({ isVisible, onClose, runData = RunMockData }) => {
  const { theme, toggleTheme } = useTheme();

  const SidingListItem = ({ sidingData = RunMockData.sidings[0] }) => {
    // Background Color for the Siding, this is base on the siding data
    const backgroundColor = sidingData.isCompleted
      ? theme.spCompleteBG
      : sidingData.isSelected
      ? theme.spSelectedBG
      : theme.spPendingBG;
    // Text Color for the Siding, this is base on the siding data
    const TextColor = sidingData.isCompleted
      ? theme.spCompleteText
      : sidingData.isSelected
      ? theme.spSelectedText
      : theme.spPendingText;
    // Icon Name for the Siding Icon, this is base on the siding data
    const Icon = sidingData.isCompleted
      ? 'checkbox-marked-circle-outline'
      : sidingData.isSelected
      ? 'star-circle-outline'
      : 'checkbox-blank-circle-outline';
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'row',
          gap: 16,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 10,
          alignItems: 'center',
          backgroundColor: backgroundColor,
        }}
        disabled={sidingData.isCompleted}
      >
        {/* Siding State Icon */}
        <MaterialCommunityIcons
          name={Icon}
          color={TextColor}
          size={24}
        />
        {/* Siding Name */}
        <Title2 style={{ color: TextColor, marginRight: 'auto' }}>
          {sidingData.name}
        </Title2>

        {/* Bin Details */}
        {sidingData.isCompleted ? (
          <Title2 style={{ color: TextColor, marginRight: 8 }}>
            Completed
          </Title2>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              gap: 4,
              marginRight: 8,
              alignItems: 'center',
              height: '100%',
            }}
          >
            {/* Number of Drop Bins */}
            {/* Icon */}
            <MaterialIcons
              name='download'
              size={18}
              color={TextColor}
            />
            {/* Label */}
            <Headline style={{ color: TextColor, width: 14 }}>
              {sidingData.binsDrop.length}
            </Headline>
            {/* Vertical Rule */}
            <View
              style={{
                marginHorizontal: 8,
                borderStyle: 'solid',
                borderColor: TextColor,
                borderWidth: 0.25,
                height: '60%',
              }}
            />
            {/* Number of Collect Bins */}
            {/* Icon */}
            <MaterialIcons
              name='upload'
              size={18}
              color={TextColor}
            />
            {/* Label */}
            <Headline style={{ color: TextColor, width: 14 }}>
              {sidingData.binsCollect.length}
            </Headline>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    return <SidingListItem sidingData={item} />;
  };
  return (
    <CustomModal
      isVisible={isVisible}
      onClose={onClose}
      buttonIcon='check-circle-outline'
      style={{ width: '80%', maxWidth: 800, height: '70%' }}
    >
      {/* Modal Header */}
      <View style={[styles.HeaderContainer, { borderColor: theme.textLevel2 }]}>
        <MaterialIcons
          name='edit-location-alt'
          size={28}
          color={theme.textLevel2}
        />
        <Title1>Select a Siding</Title1>
      </View>
      {/* Modal Content */}
      <FlatList
        style={styles.content}
        data={runData.sidings}
        renderItem={renderItem}
        ItemSeparatorComponent={<Divider style={{ marginVertical: 10 }} />}
      />
    </CustomModal>
  );
};

export default ModalSelectSiding;

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
