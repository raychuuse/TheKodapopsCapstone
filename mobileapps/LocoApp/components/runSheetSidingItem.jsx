import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import Providers
import { useTheme } from '../styles/themeContext';
import { useRun } from '../context/runContext';
import { useModal } from '../context/modalContext';

// Import Styles
import { Headline, Title2 } from '../styles/typography';

const RunSheetSidingItem = ({ sidingId }) => {
  // Providers
  const { theme } = useTheme();
  const { getSiding } = useRun();
  const { selectedSidingID, updateSelectedSidingID, openSidingModal } =
    useModal();

  // Data
  const sidingData = getSiding(sidingId);

  // Background Color for the Siding, this is base on the siding data
  const backgroundColor = sidingData.isCompleted
    ? theme.spCompleteBG
    : sidingData.id === selectedSidingID
    ? theme.spSelectedBG
    : theme.spPendingBG;
  // Text Color for the Siding, this is base on the siding data
  const TextColor = sidingData.isCompleted
    ? theme.spCompleteText
    : sidingData.id === selectedSidingID
    ? theme.spSelectedText
    : theme.spPendingText;
  // Icon Name for the Siding Icon, this is base on the siding data
  const Icon = sidingData.isCompleted
    ? 'checkbox-marked-circle-outline'
    : sidingData.id === selectedSidingID
    ? 'star-circle-outline'
    : 'checkbox-blank-circle-outline';
  return (
    <TouchableOpacity
      onPress={() => openSidingModal(sidingId)}
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
    >
      <TouchableOpacity onPress={() => updateSelectedSidingID(sidingId)}>
        {/* Siding State Icon */}
        <MaterialCommunityIcons
          name={Icon}
          color={TextColor}
          size={24}
        />
      </TouchableOpacity>
      {/* Siding Name */}
      <Title2 style={{ color: TextColor, marginRight: 'auto' }}>
        {sidingData.name}
      </Title2>
      {/* Bin Details */}
      {sidingData.isCompleted ? (
        <Title2 style={{ color: TextColor, marginRight: 8 }}>Completed</Title2>
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

export default RunSheetSidingItem;
