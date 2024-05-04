import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

// Import Components
import GreetingMessage from '../components/greetingMessage';
import Button from '../components/button';
import CustomModal from '../components/modal';
import SidingSelector from '../components/SidingSelector';
import AddBinCamera from '../components/addBinCamera';
import NetworkIndicator from '../components/networkIndicator';
import { Alert } from 'react-native';

//Import Functions
import { FinishedAlert } from '../lib/alerts';

// Import Styling Components
import { LargeTitle, Title1 } from '../components/typography';
import { Colours } from '../components/colours';
import BinList from '../components/binList';
import { useBins } from '../context/binContext';


// Import Contexts
import { useAuth } from '../context/authContext';
import { useSelections } from '../context/selectionContext';

const MainPage = () => {
  const { binData } = useBins();

  const {getSiding, setSelectionData} = useSelections();
  const setupPageRef = "dashboard/setup";

  const {signOut, sendJsonMessage, readyState, lastJsonMessage, mockMode} = useAuth();
  const [addBinVisable, setAddBinVisable] = useState(false);

  const handleDone = () => {
    if (!mockMode) {
      // Checks etc before
      FinishedAlert(null, null);
    }
    else {
      FinishedAlert({Siding: getSiding(), Farm: "", Block:"", Sub: "", Pad: "", Burnt: "Neutral"},setSelectionData);
    }
  }
  return (
    <View style={styles.body}>
      {/* Add Bin Modal */}
      <CustomModal
        isVisible={addBinVisable}
        onClose={() => setAddBinVisable(false)}
        buttonIcon='close-circle-outline'
        style={{ height: '60%', marginTop: 56 }}
      >
        <AddBinCamera modalCloser={() => setAddBinVisable(false)} />
      </CustomModal>
      {/* Page Headings */}
      <View style={styles.page_heading}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%',
            position: 'relative',
          }}
        >
          <NetworkIndicator
            style={{ position: 'absolute', left: 0, top: -16 }}
          />
          <LargeTitle>
            <GreetingMessage />
          </LargeTitle>
        </View>
        <Title1>John Smith</Title1>
      </View>
      {/* Page Content */}
      <View style={styles.content}>
        {/* Selected Siding */}
        <SidingSelector sidingName= {getSiding()}/>
        {/* Bin List */}
        <BinList
          BinData={binData}
          openAddBinModal={setAddBinVisable}
        />
      </View>
      <Button
        title='Done'
        style={StyleSheet.create({ width: '100%' })}
        onPress={handleDone}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  binList: {
    position: 'relative',
    paddingHorizontal: 8,
    paddingTop: 72,
    borderRadius: 16,
    backgroundColor: Colours.bgOverlay,
    zIndex: 0,
  },
  body: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    borderRadius: 32,
    padding: 16,
    paddingTop: 32,
    gap: 16,
    marginTop: 8,
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
    width: '100%',
    gap: 8,
  },
  page_heading: {
    alignItems: 'center',
    width: '100%',
  },
});

export default MainPage;
