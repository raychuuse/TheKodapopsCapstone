import { useState } from 'react';
import { FlatList } from 'react-native';

// Components
import RunSheetAccordionItem from './runSheetAccordionItem';
import Devider from './divider';

const RunSheetAccordion = ({ runData, setRunData, style }) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const renderItem = ({ item, index }) => (
    <RunSheetAccordionItem
      sidingData={item}
      runData={runData}
      setRunData={setRunData}
      isExpanded={expandedId === index}
      onToggle={() => handleToggle(index)}
    />
  );

  return (
    <FlatList
      style={{ width: '100%' }}
      contentContainerStyle={style}
      data={runData}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      extraData={expandedId} // Important for refreshing the list when state changes
      ItemSeparatorComponent={<Devider style={{ marginVertical: 8 }} />}
    />
  );
};

export default RunSheetAccordion;
