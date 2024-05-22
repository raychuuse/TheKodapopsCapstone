import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { logOut } from '../api/utils.api';

// Import Components
import AltButton from '../components/altButton';
import GreetingMessage from '../components/greetingMessage';
import SettingsItem from '../components/settingsItem';
import Divider from '../components/divider';

// Import Styling Components
import { Footnote, LargeTitle, Strong, Title1 } from '../components/typography';
import { Colours } from '../components/colours';

// Import Contexts
import { useBins } from '../context/binContext';

import {errorToast, issueAlert} from '../lib/alerts';
import {getSidings} from "../api/siding.api";
import {getBlocks, getFarms, getSubBlocks} from "../api/user.api";
import {burnSiding} from "../api/bins.api";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  { label: 'Yes', id: 1 },
  { label: 'No', id: 2 },
];

const SetupPage = () => {
  const {
    setSelectedSiding,
    setSelectedFarm,
    getSelectedSiding,
    getSelectedFarm,
    onSetup,
  } = useBins();
  const [sidings, setSidings] = useState();
  const [farms, setFarms] = useState();
  const [blocks, setBlocks] = useState();
  const [subBlocks, setSubOptions] = useState();
  const [burnOption, setBurnOption] = useState(2);
  const [fullname, setName] = useState("");

  useEffect(() => {
    async function getName() {
      await AsyncStorage.getItem('fullname')
      .then(name => {
        if (name !== null && name) {
          setName(name);
        }
      })
      .catch(err => {
        setName("Awaiting Cache");
        errorToast(err);
      })
    }

    getName();

    getSidings()
      .then((response) => {
        setSidings(response);
      })
      .catch((err) => {
        console.error(err);
        errorToast(err);
      });

    getFarms()
      .then((response) => {
        setFarms(response);
      })
      .catch((err) => {
        console.error(err);
        errorToast(err);
      });
  }, []);

  const onSidingSelected = (selectedSidingID) => {
    if (selectedSidingID === 0) return setSelectedSiding(null);
    const siding = sidings.find((s) => s.sidingID === selectedSidingID);
    setSelectedSiding(siding);
  };

  const onFarmSelected = (selectedFarmID) => {
    if (selectedFarmID == 0) return setSelectedFarm(null);
    selectedFarmID = Number.parseInt(selectedFarmID);
    const farm = farms.find((f) => f.farmID === selectedFarmID);
    setSelectedFarm(farm);
    getBlocks(farm.farmID)
      .then((response) => {
        setBlocks(response);
      })
      .catch((err) => {
        console.error(err);
        errorToast(err);
      });
  };

  const onBlockSelected = (selectedBlockID) => {
    if (getSelectedFarm() == null) return;

    getSubBlocks(getSelectedFarm().farmID, selectedBlockID)
      .then((response) => {
        setSubOptions(response);
      })
      .catch((err) => {
        console.error(err);
        errorToast(err);
      });
  };

  const onBurnOptionSelected = (burn) => {
    console.info(burn);
    setBurnOption(burn);
  };

  const onDonePressed = () => {
    if (getSelectedFarm() == null || getSelectedSiding() == null) {
      issueAlert('Select a siding and a farm to begin consigning.');
      return;
    }
    console.info(burnOption);
    if (burnOption === 1) {
      burnSiding(getSelectedSiding().sidingID)
        .then((response) => {
          onSetup();
          router.navigate('/dashboard');
        })
        .catch((err) => {
          console.error(err);
          errorToast({
            message: 'Unable to burn siding, try again or set burn to No',
          });
        });
    } else {
      onSetup();
      router.navigate('/dashboard');
    }
  };

  

  const onLogoutPressed = async () => {
    // only comment, handling failed cache?
    try {
      logOut();
    }
    catch (err) {
      errorToast(err);
    }
    finally {
      router.navigate('/');
    }
  };

  return (
    <View style={styles.body}>
      {/* Page Headings */}
      <View style={styles.page_heading}>
        <LargeTitle>
          <GreetingMessage />
        </LargeTitle>
        <Title1>{fullname}</Title1>
      </View>
      {/* Page Content */}
      <View style={styles.content}>
        <SettingsItem
          type='location'
          label='Siding'
          startOption={getSelectedSiding()?.sidingID}
          options={sidings?.map((s) => {
            return { id: s.sidingID, label: s.sidingName };
          })}
          setSelectedItem={onSidingSelected}
        />
        <Divider />
        <SettingsItem
          type='select'
          label='Farm'
          startOption={getSelectedFarm()?.farmID}
          options={farms?.map((s) => {
            return { id: s.farmID, label: s.farmName };
          })}
          setSelectedItem={onFarmSelected}
        />
        {blocks != null && (
          <SettingsItem
            type='select'
            label='Block'
            options={blocks?.map((s) => {
              return { id: s.blockID, label: s.blockName };
            })}
            setSelectedItem={onBlockSelected}
          />
        )}
        {subBlocks != null && (
          <SettingsItem
            type='select'
            label='Sub'
            options={subBlocks?.map((s) => {
              return { id: s.subBlockID, label: s.subBlockName };
            })}
          />
        )}
        {/* <SettingsItem type="select" label="Pad" options={padOptions} /> */}
        <SettingsItem
          type='select'
          label='Burnt'
          startOption={2}
          options={burntOptions}
          setSelectedItem={onBurnOptionSelected}
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
          onPress={onLogoutPressed}
        />
        <AltButton
          title='Start'
          textColor={Colours.textLevel3}
          style={StyleSheet.create({ flex: 1 })}
          onPress={onDonePressed}
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
