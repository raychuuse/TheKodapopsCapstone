import React, {createContext, useContext, useEffect, useReducer, useState} from 'react';

// Import Mock Data from a relative path
import {RunMockData} from '../data/RunMockData';
import {getRunsByLocoAndDate, performStopAction} from '../api/runs.api';
import {getCurrentLoadById} from '../api/loco.api';
import {getSidingBreakdown} from '../api/siding.api';
import {consignBin, findBin, updateBinFieldState} from '../api/bins.api.ts';
import NetInfo from '@react-native-community/netinfo';
import {router} from "expo-router";

// Create a React context for storing and managing run data
const RunContext = createContext();

let connected = true;
const offlineStopActions = [];
const offlineConsignActions = [];
const offlineBinStateActions = [];

// Context provider component that makes the run data accessible throughout the component tree
export const RunProvider = ({children}) => {
    const [run, setRun] = useState();
    const [loco, setLoco] = useState();
    const [locoID, setLocoID] = useState();

    const onReconnected = () => {
        const performStopActions = () => {
            if (offlineStopActions.length === 0) return Promise.resolve(true);
            const stopActionPromises = offlineStopActions.map(s => performStopAction(s.binID, s.locoID, s.stopID, s.type));
            return Promise.allSettled(stopActionPromises).then(responses => {
                console.info('StopActions', responses);
                return responsesGood(responses);
            });
        };

        const performConsignActions = () => {
            if (offlineConsignActions.length === 0) return Promise.resolve(true);
            const consignActionPromises = offlineConsignActions.map(s => consignBin(s.binID, s.full));
            return Promise.allSettled(consignActionPromises).then(responses => {
                console.info('ConsignActions', responses);
                return responsesGood(responses);
            });
        };

        const performBinStateActions = () => {
            if (offlineBinStateActions.length === 0) return Promise.resolve(true);
            const binStateActionPromises = offlineBinStateActions.map(s => updateBinFieldState(s.binID, s.field, s.state));
            return Promise.allSettled(binStateActionPromises).then(responses => {
                console.info('BinStateActions', responses);
                return responsesGood(responses);
            });
        };

        console.info('onReconnect');
        performStopActions()
            .then(stopActionComplete => {
                if (!stopActionComplete) throw new Error("Stop actions failed");
                return performConsignActions();
            })
            .then(consignComplete => {
                if (!consignComplete) throw new Error("Consign actions failed");
                return performBinStateActions();
            })
            .then(binStateComplete => {
                if (!binStateComplete) throw new Error("Bin state actions failed");
                loadData(false);
            })
            .catch(err => {
                console.error(err);
            });
    };

    const responsesGood = (responses) => {
        let good = false;
        for (const response of responses)
            if (response.status === 'fulfilled')
                good = true;
        return good;
    }

    NetInfo.addEventListener(state => {
        if (!connected && state.isConnected)
            onReconnected();
        connected = state.isConnected;
    });

    const onRunStarted = () => {
        if (locoID == null) return;
        loadData(true);
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
                for (let i = 0; i < responses.length; i++) {
                    tempRun.stops[i].bins = responses[i].value;
                }
                setRun(tempRun);
                if (navigate)
                    router.navigate('/dashboard');
                console.info('Setting everything');
            })
            .catch(err => {
                console.error(err);
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
        console.info(stop.dropOffComplete, stop.dropOffCount, stop.dropOffQuantity);
        console.info(stop.collectComplete, stop.collectCount, stop.collectQuantity);
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
                offlineStopActions.push({binID: source.bins[i].binID, locoID: 1, stopID: stop.stopID, type: type});
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
            promises.push(performStopAction(source.bins[i].binID, 1, stop.stopID, type));
        }

        Promise.allSettled(promises)
            .then(responses => {
                console.info(responses);
                for (let i = startIndex; i < responses.length + startIndex; i++) {
                    const response = responses[i - startIndex];
                    if (response.status === 'rejected') {
                        console.error(response.reason);
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
            performStopAction(binID, 1, stop.stopID, type)
                .then(response => {
                    handleSuccessfulStopAction(binID, stop, type, false);
                    updateRun();
                    updateLoco();
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            offlineStopActions.push({binID: binID, locoID: 1, stopID: stop.stopID, type: type});
            console.info('stop-action', offlineStopActions);
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
                });
        } else {
            offlineBinStateActions.push({binID: bin.binID, field: field, state: state});
            console.info(offlineBinStateActions);
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
                });
        } else {
            offlineConsignActions.push({binID: bin.binID, full: !bin.full});
            console.info(offlineConsignActions);
                onReconnected();
            handleSuccessfulConsignBin(bin, stop);
        }
    };

    const handleFindBin = (code, stop) => {
        findBin(code, stop != null ? stop.sidingID : null, stop == null ? 1 : null)
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
            });
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
    }

    return (
        <RunContext.Provider
            value={{
                getStop,
                getStops,
                getLoco,
                onRunStarted,
                getLocoID,
                setLocoID,
                handlePerformStopAction,
                handlePerformStopActionRange,
                handleUpdateBinState,
                handleFindBin,
                handleConsignBin,
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
        handlePerformStopAction,
        handlePerformStopActionRange,
        handleUpdateBinState,
        handleFindBin,
        handleConsignBin,
    } = useContext(RunContext);
    return {
        getStop,
        getStops,
        getLoco,
        onRunStarted,
        getLocoID,
        setLocoID,
        handlePerformStopAction,
        handlePerformStopActionRange,
        handleUpdateBinState,
        handleFindBin,
        handleConsignBin,
    };
};
