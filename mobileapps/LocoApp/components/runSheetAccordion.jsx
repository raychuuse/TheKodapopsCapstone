import { useState } from 'react';
import { FlatList } from 'react-native';

// Components
import RunSheetAccordionItem from './runSheetAccordionItem';
import Devider from './divider';

const RunSheetAccordion = ({ run, setRun, style }) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = (id) => {
    setExpandedId((prevId) => (prevId === id ? null : id));
  };

  const renderItem = ({ item, index }) => (
    <RunSheetAccordionItem
      stop={item}
      run={run}
      setRun={setRun}
      isExpanded={expandedId === index}
      onToggle={() => handleToggle(index)}
    />
  );

  return (
    <FlatList
      style={{ width: '100%' }}
      contentContainerStyle={style}
      data={run.stops}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      extraData={expandedId} // Important for refreshing the list when state changes
      ItemSeparatorComponent={<Devider style={{ marginVertical: 8 }} />}
    />
  );
};

export default RunSheetAccordion;
