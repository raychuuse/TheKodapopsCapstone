import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

// Import Components
import AltButton from '../components/altButton';
import GreetingMessage from '../components/greetingMessage';
import SettingsItem from '../components/settingsItem';
import Divider from '../components/divider';

// Import Styling Components
import { Footnote, LargeTitle, Strong, Title1 } from '../components/typography';
import { Colours } from '../components/colours';

// Import Contexts
import { useAuth } from '../context/authContext';
import { useSelections } from '../context/selectionContext';
import { useBins } from '../context/binContext';
import { issueAlert } from '../lib/alerts';

const initialFarmOptions = [
  { label: 'Green Valley Farm', value: 1 },
  { label: 'Sunshine Plantations', value: 2 },
  { label: 'Riverbend Agriculture', value: 3 },
  { label: 'Crestwood Cane Fields', value: 4 },
];

const initialSidingOptions = [
  { label: 'Babinda', value: 1 },
  { label: 'Tully', value: 2 },
  { label: 'Innisfail', value: 3 },
  { label: 'Mourilyan', value: 4 },
  { label: 'South Johnstone', value: 5 },
  { label: 'Gordonvale', value: 6 },
  { label: 'Mossman', value: 7 },
  { label: 'Proserpine', value: 8 },
  { label: 'Ayr', value: 9 },
  { label: 'Ingham', value: 10 },
  { label: 'Lucinda', value: 11 },
  { label: 'Bundaberg', value: 12 },
  { label: 'Maryborough', value: 13 },
  { label: 'Isis', value: 14 },
  { label: 'Mackay', value: 15 },
];

const initialBlockOptions = [
  { label: 'Block A - North Field', value: 1 },
  { label: 'Block B - South Field', value: 2 },
  { label: 'Block C - East Field', value: 3 },
  { label: 'Block D - West Field', value: 4 },
];

const initialSubBlockOptions = [
  { label: 'Sub-Block 1', value: 1 },
  { label: 'Sub-Block 2', value: 2 },
  { label: 'Sub-Block 3', value: 3 },
  { label: 'Sub-Block 4', value: 4 },
];

const initialPadOptions = [
  { label: 'Pad 101 - North End', value: 1 },
  { label: 'Pad 102 - Near River', value: 2 },
  { label: 'Pad 103 - Central', value: 3 },
  { label: 'Pad 104 - South End', value: 4 },
];

// Doesn't change with api, only two options
const burntOptions = [
  { label: 'Yes', value: 1 },
  { label: 'No', value: 2 },
];

const SetupPage = () => {
  const loginRef = '/';
  const dashboardRef = '/dashboard';
  const { signOut, lastJsonMessage, mockMode, setMockMode } = useAuth();
  const [farmOptions, setFarmOptions] = useState(initialFarmOptions);
  const [sidingOptions, setSidingOptions] = useState(initialSidingOptions);
  const [blockOptions, setBlockOptions] = useState(initialBlockOptions);
  const [subBlockOptions, setSubOptions] = useState(initialSubBlockOptions);
  const [padOptions, setPadOptions] = useState(initialPadOptions);
  const { setBurn } = useBins();
  const { getSiding, getFarm } = useSelections();

  const handleLogout = () => {
    if (mockMode) {
      router.navigate(loginRef);
      return;
    }
    try {
      signOut();
    } catch (err) {
      console.log(err);
    }
    router.navigate(loginRef);
  };

  const handleStart = () => {
    siding = getSiding();
    if (siding == '' || siding == null) {
      issueAlert('It is required that a siding option is selected.');
      return;
    }
    /*
    const burnOption = getBurnt();
    if (burnOption != "neutral") {
        setBurn(burnOption == "Yes");
    }*/
    if (mockMode) {
      router.navigate(dashboardRef);
      return;
    }
    try {
      // Checking logic, is farming selected/ not invalid? etc
      // If all checks pass, proceed
      router.navigate(dashboardRef);
    } catch (err) {
      console.log(err);
    }
  };

  // Re-renders everytime lastJsonMessage changes, i.e. when a message is received
  useEffect(() => {
    if (lastJsonMessage) {
      if (!mockMode) {
        if (!lastJsonMessage.notification) {
          // Handle other events
        } else {
          if (lastJsonMessage.query == 'Siding') {
            // data is a stringified json, use as needed
            setSidingOptions(lastJsonMessage.data);
          }
          // repeat for each, note sub-logic in dependencies
        }
      }
    }
  }, [lastJsonMessage]);

  return (
    <View style={styles.body}>
      {/* Page Headings */}
      <View style={styles.page_heading}>
        <LargeTitle>
          <GreetingMessage />
        </LargeTitle>
        <Title1>John Smith</Title1>
      </View>
      {/* Page Content */}
      <View style={styles.content}>
        <SettingsItem
          type='location'
          label='Siding'
          options={sidingOptions}
        />
        <Divider />
        <SettingsItem
          type='select'
          label='Farm'
          options={farmOptions}
        />
        <SettingsItem
          type='select'
          label='Block'
          options={blockOptions}
        />
        <SettingsItem
          type='select'
          label='Sub'
          options={subBlockOptions}
        />
        {/* <SettingsItem type="select" label="Pad" options={padOptions} /> */}
        <SettingsItem
          type='select'
          label='Burnt'
          options={burntOptions}
        />
        <Divider />
      </View>
      <Footnote
        style={{
          color: '#fff',
          textAlign: 'center',
          backgroundColor: `${Colours.dangerBg}80`,
          padding: 8,
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        <Strong>Warning: </Strong>Ensure accurate settings for smooth operations
        at the rail siding bins.
      </Footnote>
      {/* Actions */}
      <View style={styles.actions}>
        <AltButton
          title='Log Out'
          textColor={Colours.textLevel2}
          backgroundColor='transparent'
          border
          onPress={handleLogout}
        />
        <AltButton
          title='Start'
          textColor={Colours.textLevel3}
          style={StyleSheet.create({ flex: 1 })}
          onPress={handleStart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    borderRadius: 32,
    padding: 16,
    paddingTop: 32,
    marginTop: 8,
    marginHorizontal: 16,
    gap: 16,
  },
  nav: {
    width: '100%',

    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actions: {
    width: '100%',

    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
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

export default SetupPage;
