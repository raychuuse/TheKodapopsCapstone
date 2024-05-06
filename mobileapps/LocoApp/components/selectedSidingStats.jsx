import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Components
import Container from './container';
import { Footnote, Headline, Title3 } from '../styles/typography';

// Import Style
import { useTheme } from '../styles/themeContext';
import { useRun } from '../context/runContext';
import { useModal } from '../context/modalContext';

export default function SelectedSiddingStats() {
  // Porviders
  const { theme } = useTheme();
  const { getStop } = useRun();
  const { openSelectSidingModal, selectedSidingID, openSidingModal } =
    useModal();

  if (selectedSidingID == null) return;
  // Data
  const stop = getStop(selectedSidingID);

  return (
    <Container
      style={{
        flex: 2,
        marginLeft: 256,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      {/* Drop Off */}
      {/* Displays the number of bins to drop off at the selected siding */}
      <TouchableOpacity
        style={{ flex: 2, alignItems: 'center' }}
        onPress={() => openSidingModal(selectedSidingID)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <MaterialIcons
            name='download'
            size={18}
            color={theme.textLevel3}
          />
          <Headline style={{ marginRight: 9, color: theme.textLevel3 }}>
            Drop Off
          </Headline>
        </View>
        <Title3>{stop.dropOffQuantity}</Title3>
      </TouchableOpacity>

      {/* Vertical Rule */}
      <View
        style={{
          marginHorizontal: 4,
          borderStyle: 'solid',
          borderColor: theme.textLevel3,
          borderWidth: 0.25,
          height: '80%',
        }}
      />

      {/* Selected Siding */}
      {/* Show the name and ETA for the Selected Siding */}
      <TouchableOpacity
        onPress={openSelectSidingModal}
        style={{ flex: 3, height: '100%', alignItems: 'center' }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Footnote style={{ marginLeft: 9, color: theme.textLevel3 }}>
            Selected Siding
          </Footnote>
          <MaterialIcons
            name='edit-location-alt'
            size={18}
            color={theme.textLevel3}
          />
        </View>
        <Title3>{stop.sidingName}</Title3>
        {/* <Footnote style={{ color: theme.textLevel3 }}>ETA: 12:05 PM</Footnote> */}
      </TouchableOpacity>

      {/* Vertical Rule */}
      <View
        style={{
          marginHorizontal: 4,
          borderStyle: 'solid',
          borderColor: theme.textLevel3,
          borderWidth: 0.25,
          height: '80%',
        }}
      />

      {/* Collect Bins */}
      {/* Displays the number of bins to collect from the selected siding */}
      <TouchableOpacity
        style={{ flex: 2, alignItems: 'center' }}
        onPress={() => openSidingModal(selectedSidingID)}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Headline style={{ marginLeft: 9, color: theme.textLevel3 }}>
            Collect
          </Headline>
          <MaterialIcons
            name='upload'
            size={18}
            color={theme.textLevel3}
          />
        </View>
        <Title3>{stop.collectQuantity}</Title3>
      </TouchableOpacity>
    </Container>
  );
}
