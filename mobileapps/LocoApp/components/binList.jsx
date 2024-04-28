import { View, FlatList } from 'react-native';

// Import Styles
import { Colours } from '../styles/colours';

// Import Components
import SwipeableBinItem from './swipeableBinItem';

const BinList = ({ bins, onBinSelected, type }) => {
  const RenderItem = ({ item }) => {
      return (
    <SwipeableBinItem
      bin={item}
      onBinSelected={onBinSelected}
      type={type}
    />
  )};

  const BinListSeparator = () => (
    <View
      style={{
        width: '80%',
        height: 1,
        backgroundColor: Colours.spAtSidingText,
        marginVertical: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
        opacity: 0.3,
      }}
    />
  );

  return (
    <FlatList
      data={bins}
      renderItem={RenderItem}
      style={{
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: Colours.bgOverlay,
      }}
      ItemSeparatorComponent={BinListSeparator}
      ListFooterComponent={<View style={{ marginVertical: 40 }} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default BinList;
