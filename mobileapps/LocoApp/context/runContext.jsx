import React, {createContext, useContext, useEffect, useState} from 'react';

// Import Mock Data from a relative path
import {completeStop, getRunsByLocoAndDate, performStopAction} from '../api/runs.api';
import {getCurrentLoadById} from '../api/loco.api';
import {getSidingBreakdown} from '../api/siding.api';
import {consignBin, findBin, updateBinFieldState} from '../api/bins.api.ts';
import NetInfo from '@react-native-community/netinfo';
import {router} from "expo-router";
import {errorToast, showToast} from "../lib/alerts";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create a React context for storing and managing run data
const RunContext = createContext();

let connected = true;
let locoID;
const offlineStopActions = [];
const offlineConsignActions = [];
const offlineBinStateActions = [];

// Context provider component that makes the run data accessible throughout the component tree
export const RunProvider = ({children}) => {
    const [run, setRun] = useState();
    const [loco, setLoco] = useState();

    useEffect(() => {
        AsyncStorage.getItem('offline')
            .then(json => {
                if (json == null) return;
                const arr = JSON.parse(json);
                if (arr[0].length !== 0)
                    offlineStopActions.push(...arr[0]);
                if (arr[1].length !== 0)
                    offlineConsignActions.push(...arr[1]);
                if (arr[2].length !== 0)
                    offlineBinStateActions.push(...arr[2]);
                console.info('Offline data restored: ', arr);
            })
            .catch(err => console.error('Restoring offline data', err));
    }, []);

    const onReconnected = () => {
        if (!connected) return;

        showToast('Syncing Offline Data', 'info');

        const performStopActions = () => {
            if (offlineStopActions.length === 0) return Promise.resolve(true);
            const stopActionPromises = offlineStopActions.map(s => performStopAction(s.binID, s.locoID, s.stopID, s.type));
            return Promise.allSettled(stopActionPromises).then(responses => {
                console.info('StopActions', responses);
                for (let i = responses.length - 1; i >= 0; i--) {
                    const response = responses[i];
                    if (response.status === 'fulfilled')
                        offlineStopActions.splice(i, 1);
                }
                return offlineStopActions.length === 0;
            });
        };

        const performConsignActions = () => {
            if (offlineConsignActions.length === 0) return Promise.resolve(true);
            const consignActionPromises = offlineConsignActions.map(s => consignBin(s.binID, s.full));
            return Promise.allSettled(consignActionPromises).then(responses => {
                console.info('ConsignActions', responses);
                for (let i = responses.length - 1; i >= 0; i--) {
                    const response = responses[i];
                    if (response.status === 'fulfilled')
                        offlineConsignActions.splice(i, 1);
                }
                return offlineConsignActions.length === 0;
            });
        };

        const performBinStateActions = () => {
            if (offlineBinStateActions.length === 0) return Promise.resolve(true);
            const binStateActionPromises = offlineBinStateActions.map(s => updateBinFieldState(s.binID, s.field, s.state));
            return Promise.allSettled(binStateActionPromises).then(responses => {
                console.info('BinStateActions', responses);
                for (let i = responses.length - 1; i >= 0; i--) {
                    const response = responses[i];
                    if (response.status === 'fulfilled')
                        offlineBinStateActions.splice(i, 1);
                }
                return offlineBinStateActions.length === 0;
            });
        };

        console.info('onReconnect');
        performStopActions()
            .then(stopActionComplete => {
                if (!stopActionComplete)
                    errorToast({message: 'Failed to upload bin movements, press send in the settings menu to try again.'});
                return performConsignActions();
            })
            .then(consignComplete => {
                if (!consignComplete)
                    errorToast({message: 'Failed to upload some consignments, press send in the settings menu to try again.'});
                return performBinStateActions();
            })
            .then(binStateComplete => {
                if (!binStateComplete)
                    errorToast({message: 'Failed to upload some bin changes, press send in the settings menu to try again.'});
                persistOfflineData();
                loadData(false);
                showToast('Finished Syncing Offline Data', 'success');
            })
            .catch(err => {
                console.error(err);
                errorToast(err);
            });
    };

    const persistOfflineData = () => {
        AsyncStorage.setItem('offline', JSON.stringify([offlineStopActions, offlineConsignActions, offlineBinStateActions]))
            .then(() => {console.info('Offline data persisted')})
            .catch(err => console.error('Persisting offline data', err));
    };

    const haveOfflineData = () => {
        return offlineStopActions.length !== 0 || offlineConsignActions.length !== 0 || offlineBinStateActions.length !== 0;
    };

    NetInfo.addEventListener(state => {
        if (!connected && state.isConnected && locoID != null) {
            connected = state.isConnected;
            onReconnected();
        } else {
            connected = state.isConnected;
        }
    });

    const onRunStarted = () => {
        if (locoID == null) return;
        loadData(true);
        if (haveOfflineData())
            onReconnected();
    };

    const loadData = (navigate) => {
        let tempRun;
        return getCurrentLoadById(locoID)
            .then(locoResponse => {
                setLoco(locoResponse);
            })
            .then(() => getRunsByLocoAndDate(locoID, new Date(new Date().getTime() + 10 * 3600 * 1000)))
            .then(response => {
                const promises = [];
                for (const stop of response.stops)
                    promises.push(getSidingBreakdown(stop.sidingID, stop.stopID));
                tempRun = response;
                return Promise.allSettled(promises);
            })
            .then(responses => {
                let missed = false;
                for (let i = 0; i < responses.length; i++) {
                    const response = responses[i];
                    if (response.status === 'fulfilled')
                        tempRun.stops[i].bins = responses[i].value;
                    else
                        missed = true;
                }
                if (missed)
                    errorToast({message: 'Failed to retrieve all bins. Please refresh data through the settings menu.'});
                setRun(tempRun);
                if (navigate)
                    router.navigate('/dashboard');
            })
            .catch(err => {
                console.error(err);
                errorToast(err);
            });
    };

    const onCompletePressed = (stop, type) => {
        const complete = type === 'SIDING' ? !stop.collectComplete : !stop.dropOffComplete;
        completeStop(stop.stopID, type === 'SIDING' ? 'COLLECT' : 'DROP_OFF', complete)
            .then(response => {
                if (type === 'SIDING') stop.collectComplete = complete;
                else stop.dropOffComplete = complete;
                updateRun();
            })
            .catch(err => {
                console.error(err);
                errorToast(err);
            });
    };

    const getFromSource = (stop, type) => {
        return type === 'COLLECT' ? stop : loco;
    };

    const getToSource = (stop, type) => {
        return type === 'COLLECT' ? loco : stop;
    }

    const adjustStopState = (bin, stop, type) => {
        if (type === 'COLLECT') {
            if (bin.droppedOffInRun) {
                stop.dropOffCount--;
                bin.droppedOffInRun = false;
            } else {
                stop.collectCount++;
                bin.pickedUpInRun = true;
            }
        } else {
            if (bin.pickedUpInRun) {
                stop.collectCount--;
                bin.pickedUpInRun = false;
            } else {
                stop.dropOffCount++;
                bin.droppedOffInRun = true;
            }
        }

        stop.dropOffComplete = stop.dropOffCount >= stop.dropOffQuantity;
        stop.collectComplete = stop.collectCount >= stop.collectQuantity;
    }

    const handleSuccessfulStopAction = (binID, stop, type, operatingOverRange) => {
        const binIdx = getFromSource(stop, type).bins.findIndex(b => b.binID === binID);
        const bin = getFromSource(stop, type).bins[binIdx];
        if (bin == null) return console.warn('No bin');
        if (!operatingOverRange)
            getFromSource(stop, type).bins.splice(binIdx, 1);

        adjustStopState(bin, stop, type);

        getToSource(stop, type).bins.push(bin);
        getToSource(stop, type).bins.sort((a, b) => {
            if (a.full === b.full)
                return a.droppedOffInRun - b.droppedOffInRun;
            return a.full - b.full;
        });
    };

    const handlePerformStopActionRange = (startIndex, endIndex, stop, type) => {
        const source = type === 'COLLECT' ? stop : loco;

        if (!connected) {
            for (let i = startIndex; i <= endIndex; i++) {
                console.info(i, source.bins[i]);
                offlineStopActions.push({binID: source.bins[i].binID, locoID: locoID, stopID: stop.stopID, type: type});
                const bin = source.bins[i];
                if (bin == null) {
                    console.error('Shouldn\'t be here');
                    continue;
                }
                handleSuccessfulStopAction(bin.binID, stop, type, true);
            }
            getFromSource(stop, type).bins.splice(startIndex, endIndex - startIndex + 1);
            updateLoco();
            updateRun();
            return;
        }

        const promises = [];
        for (let i = startIndex; i <= endIndex; i++) {
            console.info(i, source.bins[i]);
            promises.push(performStopAction(source.bins[i].binID, locoID, stop.stopID, type));
        }

        Promise.allSettled(promises)
            .then(responses => {
                console.info(responses);
                for (let i = startIndex; i < responses.length + startIndex; i++) {
                    const response = responses[i - startIndex];
                    if (response.status === 'rejected') {
                        console.error(response.reason);
                        if (source.bins[i] != null)
                            errorToast({message: `Failed to move bin: ${source.bins[i]?.binID}. Please try again.`});
                        continue;
                    }
                    console.info(i, source.bins[i]);

                    const bin = source.bins[i];
                    if (bin == null) {
                        console.error('Shouldn\'t be here');
                        continue;
                    }
                    handleSuccessfulStopAction(bin.binID, stop, type, true);
                }
                getFromSource(stop, type).bins.splice(startIndex, endIndex - startIndex + 1);
                updateLoco();
                updateRun();
            })
            .catch(err => {
                console.error(err);
                errorToast(err);
            });
    }

    const updateRun = () => {
        setRun({
            ...run,
            stops: run.stops,
        });
    };

    const updateLoco = () => {
        setLoco({
            ...loco,
            bins: loco.bins,
        });
    };

    const handlePerformStopAction = (binID, stop, type) => {
        if (connected) {
            performStopAction(binID, locoID, stop.stopID, type)
                .then(response => {
                    handleSuccessfulStopAction(binID, stop, type, false);
                    updateRun();
                    updateLoco();
                })
                .catch(err => {
                    console.error(err);
                    errorToast(err);
                });
        } else {
            offlineStopActions.push({binID: binID, locoID: locoID, stopID: stop.stopID, type: type});
            console.info('stop-action', offlineStopActions);
            persistOfflineData();
            handleSuccessfulStopAction(binID, stop, type, false);
            updateRun();
            updateLoco();
        }
    };

    const handleSuccessfulUpdateBinState = (bin, field, state, stop, type) => {
        if (field === 'BURNT') bin.burnt = state;
        else if (field === 'MISSING') bin.missing = state;
        else bin.repair = state;

        if (type === 'COLLECT') {
            const index = stop.bins.findIndex(b => b.binID === bin.binID);
            if (index >= 0) {
                if (field === 'MISSING') stop.bins.splice(index, 1);
                else stop.bins[index] = bin;
                updateRun();
            } else {
                console.error('Shouldn\'t be here');
            }
        } else {
            const index = loco.bins.findIndex(b => b.binID === bin.binID);
            if (index >= 0) {
                if (field === 'MISSING') loco.bins.splice(index, 1);
                else loco.bins[index] = bin;
                updateLoco();
            } else {
                console.error('Shouldn\'t be here');
            }
        }
    }

    const handleUpdateBinState = (bin, field, state, stop, type) => {
        if (connected) {
            updateBinFieldState(bin.binID, field, state)
                .then(response => {
                    handleSuccessfulUpdateBinState(bin, field, state, stop, type);
                })
                .catch(err => {
                    console.error(err);
                    errorToast(err);
                });
        } else {
            offlineBinStateActions.push({binID: bin.binID, field: field, state: state});
            console.info(offlineBinStateActions);
            persistOfflineData();
            handleSuccessfulUpdateBinState(bin, field, state, stop, type);
        }
    };

    const handleSuccessfulConsignBin = (bin, stop) => {
        bin.full = !bin.full;
        if (stop != null) {
            const index = stop.bins.findIndex(b => b.binID === bin.binID);
            if (index >= 0) {
                stop.bins[index] = bin;
                updateRun();
            } else {
                console.error('Shouldn\'t be here');
            }
        } else {
            const index = loco.bins.findIndex(b => b.binID === bin.binID);
            if (index >= 0) {
                loco.bins[index] = bin;
                updateLoco();
            } else {
                console.error('Shouldn\'t be here');
            }
        }
    };

    const handleConsignBin = (bin, stop) => {
        if (connected) {
            consignBin(bin.binID, !bin.full)
                .then(response => {
                    handleSuccessfulConsignBin(bin, stop);
                })
                .catch(err => {
                    console.error(err);
                    errorToast(err);
                });
        } else {
            offlineConsignActions.push({binID: bin.binID, full: !bin.full});
            persistOfflineData();
            handleSuccessfulConsignBin(bin, stop);
        }
    };

    const handleFindBin = (code, stop) => {
        if (!connected) {
            errorToast({message: 'Cannot find bin while offline'});
            return;
        }

        findBin(code, stop != null ? stop.sidingID : null, stop == null ? locoID : null)
            .then(bin => {
                if (stop != null) {
                    stop.bins.push(bin);
                    updateRun();
                } else {
                    loco.bins.push(bin);
                    updateLoco();
                }
            })
            .catch(err => {
                console.error(err);
                errorToast(err);
            });
    };

    const refreshRunData = () => {
        if (!connected) return;

        loadData(false);
    };

    const getStop = (stopID) => {
        return run.stops.find(stop => stop.stopID === stopID);
    };

    const getStops = () => {
        return run.stops;
    };

    const getLoco = () => {
        return loco;
    };

    const getLocoID = () => {
        return locoID;
    };

    const setLocoID = (id) => {
        locoID = id;
    };

    return (
        <RunContext.Provider
            value={{
                getStop,
                getStops,
                getLoco,
                onRunStarted,
                getLocoID,
                setLocoID,
                onCompletePressed,
                handlePerformStopAction,
                handlePerformStopActionRange,
                handleUpdateBinState,
                handleFindBin,
                handleConsignBin,
                refreshRunData,
                onReconnected,
            }}
        >
            {children}
        </RunContext.Provider>
    );
};

/**
 * Custom hook for accessing run data and actions. This hook simplifies the process of accessing
 * the global state and functions related to run management, making it easier to use these
 * throughout the application without having to deal with the context directly.
 *
 * @returns {{
 *   runData: object,
 *   getRun: () => object,
 *   getSiding: (id: number) => object | undefined,
 *   getBins: (sidingId: number, isDrop: boolean) => array,
 *   getBin: (sidingId, binNumber, isDrop) => object | undefined
 *   updateRun: (updates: object) => void,
 *   updateSiding: (id: number, updates: object) => void,
 *   updateBin: (sidingId: number, binNumber: number, updates: object, isDrop: boolean) => void
 * }} Returns an object containing:
 * - `runData`: The entire run data state object.
 *
 * - `getRun`: Retrieves the entire current run data.
 *
 * - `getSiding`: Retrieves details about a specific siding by its ID.
 *   @param {number} id The ID of the siding to retrieve.
 *
 * - `getBins`: Retrieves bins from a specific siding, either drop or collect.
 *   @param {number} sidingId The ID of the siding from which to retrieve bins.
 *   @param {boolean} isDrop Specifies whether to retrieve 'drop' bins or 'collect' bins.
 *
 * - `getBin`: Retrieves a specific bin from a specific siding, either drop or collect.
 *   @param {number} sidingId The ID of the siding from which to retrieve the bin.
 *   @param {number} binNumber The number of the bin to retrieve.
 *   @param {boolean} isDrop Specifies whether to retrieve the bin from 'drop' bins or 'collect' bins.
 *
 * - `updateRun`: Updates the global run properties.
 *   @param {object} updates An object containing the updates to apply to the run.
 * - `updateSiding`: Updates specific properties of a siding.
 *   @param {number} id The ID of the siding to update.
 *   @param {object} updates An object containing the updates to apply to the siding.
 *
 * - `updateBin`: Updates specific bin details in drop or collect arrays.
 *   @param {number} sidingId The ID of the siding containing the bin.
 *   @param {number} binNumber The number of the bin to update.
 *   @param {object} updates An object containing the updates to apply to the bin.
 *   @param {boolean} isDrop Specifies whether the bin is in the 'drop' array or 'collect' array.
 *
 * @example
 * const { runData, getRun, updateRun, getSiding, getBins, updateSiding, updateBin } = useRun();
 *
 * Example of using `getSiding`:
 * const siding = getSiding(1);
 * if (siding) {
 *   console.log(siding.name);
 * }
 *
 * This hook abstracts away the complexity of the context API and provides direct access to the state and functions.
 */
export const useRun = () => {
    const {
        getStop,
        getStops,
        getLoco,
        onRunStarted,
        getLocoID,
        setLocoID,
        onCompletePressed,
        handlePerformStopAction,
        handlePerformStopActionRange,
        handleUpdateBinState,
        handleFindBin,
        handleConsignBin,
        refreshRunData,
        onReconnected,
    } = useContext(RunContext);
    return {
        getStop,
        getStops,
        getLoco,
        onRunStarted,
        getLocoID,
        setLocoID,
        onCompletePressed,
        handlePerformStopAction,
        handlePerformStopActionRange,
        handleUpdateBinState,
        handleFindBin,
        handleConsignBin,
        refreshRunData,
        onReconnected,
    };
};
