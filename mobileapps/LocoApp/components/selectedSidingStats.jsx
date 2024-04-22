import { TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Components
import Container from './container';
import { Footnote, Headline, Title3 } from '../styles/typography';
import { Colours } from '../styles/colours';

// Import Mock Data
import { RunMockData } from '../data/RunMockData';

export default function SelectedSiddingStats({
  runData = RunMockData,
  selectedSidingID,
  openSidingDetailsModal,
}) {
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
      <TouchableOpacity
        style={{ flex: 2, alignItems: 'center' }}
        onPress={openSidingDetailsModal}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <MaterialIcons
            name='download'
            size={18}
            color={Colours.textLevel3}
          />
          <Headline style={{ marginRight: 9, color: Colours.textLevel3 }}>
            Drop Off
          </Headline>
        </View>
        <Title3>
          {
            runData.sidings.find((item) => item.id === selectedSidingID)
              .binsDrop.length
          }
        </Title3>
      </TouchableOpacity>

      <View
        style={{
          marginHorizontal: 4,
          borderStyle: 'solid',
          borderColor: Colours.textLevel3,
          borderWidth: 0.25,
          height: '80%',
        }}
      />

      {/* Siding */}
      <View style={{ flex: 3, height: '100%', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Footnote style={{ marginLeft: 9, color: Colours.textLevel3 }}>
            Selected Siding
          </Footnote>
          <MaterialIcons
            name='edit-location-alt'
            size={18}
            color={Colours.textLevel3}
          />
        </View>
        <Title3>
          {runData.sidings.find((item) => item.id === selectedSidingID).name}
        </Title3>
        <Footnote style={{ color: Colours.textLevel3 }}>ETA: 12:05 PM</Footnote>
      </View>

      <View
        style={{
          marginHorizontal: 4,
          borderStyle: 'solid',
          borderColor: Colours.textLevel3,
          borderWidth: 0.25,
          height: '80%',
        }}
      />

      {/* Collect */}
      <TouchableOpacity
        style={{ flex: 2, alignItems: 'center' }}
        onPress={openSidingDetailsModal}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Headline style={{ marginLeft: 9, color: Colours.textLevel3 }}>
            Collect
          </Headline>
          <MaterialIcons
            name='upload'
            size={18}
            color={Colours.textLevel3}
          />
        </View>
        <Title3>
          {
            runData.sidings.find((item) => item.id === selectedSidingID)
              .binsCollect.length
          }
        </Title3>
      </TouchableOpacity>
    </Container>
  );
}
