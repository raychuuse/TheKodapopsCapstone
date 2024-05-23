import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import Styles
import { Headline, Title1, Title2 } from '../styles/typography';

// Import Componetns
import CustomModal from './modal';
import Divider from './divider';

// Import Providers
import { useTheme } from '../styles/themeContext';
import { useModal } from '../context/modalContext';
import { useRun } from '../context/runContext';

const ModalSelectSiding = () => {
  const { theme } = useTheme();
  const { getStops } = useRun();
  const {
    modalSelectSidingVisible,
    closeSelectSidingModal,
    selectedSidingID,
    updateSelectedSidingID,
  } = useModal();

  const SidingListItem = ({ stop }) => {
    const complete = stop.collectComplete && stop.dropOffComplete;
    // Background Color for the Siding, this is base on the siding data
    const backgroundColor = complete
      ? theme.spCompleteBG
      : stop.stopID == selectedSidingID
      ? theme.spSelectedBG
      : theme.spPendingBG;
    // Text Color for the Siding, this is base on the siding data
    const TextColor = complete
      ? theme.spCompleteText
      : stop.stopID == selectedSidingID
      ? theme.spSelectedText
      : theme.spPendingText;
    // Icon Name for the Siding Icon, this is base on the siding data
    const Icon = complete
      ? 'checkbox-marked-circle-outline'
      : stop.stopID == selectedSidingID
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
        onPress={() => updateSelectedSidingID(stop.stopID)}
        disabled={stop.isCompleted}
      >
        {/* Siding State Icon */}
        <MaterialCommunityIcons
          name={Icon}
          color={TextColor}
          size={24}
        />
        {/* Siding Name */}
        <Title2 style={{ color: TextColor, marginRight: 'auto' }}>
          {stop.sidingName}
        </Title2>

        {/* Bin Details */}
        {stop.isCompleted ? (
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
              {stop.dropOffQuantity}
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
              {stop.collectQuantity}
            </Headline>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    return <SidingListItem stop={item} />;
  };

  return (
    <CustomModal
      isVisible={modalSelectSidingVisible}
      onClose={closeSelectSidingModal}
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
        <Title1>Select a Stop</Title1>
      </View>
      {/* Modal Content */}
      <FlatList
        style={styles.content}
        data={getStops()}
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
