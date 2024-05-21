import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Link, router} from 'expo-router';

// Import Components
import Button from '../components/button';
import GreetingMessage from '../lib/greetingMessage';
import SettingsItem from '../components/settingsItem';

// Import Styling Components
import { LargeTitle, Title1 } from '../styles/typography';
import { useTheme } from '../styles/themeContext';
import {Colours} from '../styles/colours';

// Import Mock Data
import {getAllLocos} from "../api/loco.api";
import {useRun} from "../context/runContext";
import {errorToast} from "../lib/alerts";

const SetupPage = () => {
    const [locos, setLocos] = useState();
    const {getLocoID, setLocoID, onRunStarted} = useRun();

    useEffect(() => {
        getAllLocos()
            .then(response => {
                setLocos(response);
            })
            .catch(err => {
                console.error(err);
                errorToast(err);
            });
    }, []);

    const onLocoSelected = (locoID) => {
        setLocoID(locoID);
    }

    const onStartPressed = () => {
        const loco = locos?.find(l => l.locoID === getLocoID());
        if (loco == null) return;
        onRunStarted();
    }

    return (
        <View style={styles.page}>
            <View style={styles.body}>
                {/* Page Headings */}
                <View style={styles.page_heading}>
                    <LargeTitle>
                        <GreetingMessage/>
                    </LargeTitle>
                    <Title1>John Smith</Title1>
                </View>
                {/* Page Content */}
                <View style={styles.content}>
                    {/* Locomotive Selector */}
                    {locos != undefined && <SettingsItem
                        label='Locomotive'
                        options={locos?.map(loco => {
                            return {id: loco.locoID, label: loco.locoName};
                        })}
                        setSelectedItem={onLocoSelected}
                    />}
                </View>
                {/* Actions */}
                <View style={styles.actions}>
                    <Link
                        href='/'
                        asChild
                    >
                        <Button
                            title='Log Out'
                            textColor={Colours.textLevel2}
                            backgroundColor='transparent'
                            border
                        />
                    </Link>
                    <Button
                        title='Start'
                        textColor={Colours.textLevel3}
                        style={StyleSheet.create({flex: 1})}
                        onPress={onStartPressed}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6%',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 32,
    padding: 16,
    paddingTop: 32,
    marginTop: 8,
    marginHorizontal: 16,
    gap: 16,
    width: '80%',
    maxWidth: 500,
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
