import { View, FlatList } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Import Styles
import { Colours } from '../styles/colours';
import { Title2 } from '../styles/typography';
import { useTheme } from '../styles/themeContext';

// Import Components
import SwipeableBinItem from './swipeableBinItem';

const BinList = ({ BinData, setRunData, runData, sidingId, binListName }) => {
  const { theme, toggleTheme } = useTheme();
  const RenderItem = ({ item }) => (
    <SwipeableBinItem
      binData={item}
      binListName={binListName}
      sidingId={sidingId}
      runData={runData}
      setRunData={setRunData}
    />
  );

  const BinListSeparator = () => (
    <View
      style={{
        width: '80%',
        height: 1,
        backgroundColor: theme.spAtSidingText,
        marginVertical: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        opacity: 0.3,
      }}
    />
  );

  return (
    <GestureHandlerRootView
      style={{ flex: 1, width: '100%', position: 'relative' }}
    >
      {/* List Header */}
      <View
        style={[
          {
            height: 56,
            width: '100%',
            position: 'absolute',
            zIndex: 1,
            borderRadius: 10,
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
            paddingHorizontal: 8,
          },
          runData.sidings.find((item) => item.id === sidingId).isCompleted
            ? { backgroundColor: theme.spComplete }
            : runData.sidings.find((item) => item.id === sidingId).isSelected
            ? { backgroundColor: theme.spSelected }
            : { backgroundColor: theme.spPending },
        ]}
      >
        <Title2>
          {binListName == 'binsDrop'
            ? 'Drop Off:'
            : binListName == 'binsCollect'
            ? 'Collect:'
            : null}
        </Title2>
        <Title2>{BinData.length}</Title2>
        <Title2>{BinData.length > 1 ? 'Bins' : 'Bin'} at Siding</Title2>
      </View>
      {/* Bin List */}
      <FlatList
        data={BinData}
        style={{
          width: '100%',
          backgroundColor: theme.bgOverlay,
          borderRadius: 10,
          height: '100%',
          padding: 8,
          marginTop: 16,
        }}
        renderItem={RenderItem}
        ItemSeparatorComponent={BinListSeparator}
        ListHeaderComponent={<View style={{ marginTop: 40 }} />}
        ListFooterComponent={<View style={{ marginTop: 18 }} />}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      />
    </GestureHandlerRootView>
  );
};

export default BinList;
