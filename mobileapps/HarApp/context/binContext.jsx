import React, { createContext, useState, useContext, useEffect } from 'react';
import { consignBin, findBin, updateBinFieldState } from '../api/bins.api';
import {getBinsFromSiding}  from '../api/siding.api'
import NetInfo from "@react-native-community/netinfo";
import {errorToast, showToast} from "../lib/alerts";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * initialBinData represents the initial state of bins in an array format. Each bin object contains the bin number,
 * whether it is full, and whether it has been burnt.
 *
 * @type {Array<Object>}
 * @property {boolean} isFull - Indicates whether the bin is full.
 * @property {number} binNum - A unique identifier for the bin.
 * @property {boolean} isBurnt - Indicates whether the bin is burnt.
 */
const initialBinData = [
  { isFull: false, binNum: 2141, isBurnt: false, isRepairNeeded: false, isMissing: false},
  { isFull: true, binNum: 2123, isBurnt: true, isRepairNeeded: false, isMissing: false},
  { isFull: false, binNum: 1232, isBurnt: false, isRepairNeeded: false, isMissing: false},
  { isFull: true, binNum: 1234, isBurnt: false, isRepairNeeded: false, isMissing: false},
  { isFull: true, binNum: 5637, isBurnt: false, isRepairNeeded: false, isMissing: false},
  { isFull: false, binNum: 5633, isBurnt: false, isRepairNeeded: false, isMissing: false},
  { isFull: false, binNum: 654, isBurnt: false, isRepairNeeded: false, isMissing: false},
  { isFull: false, binNum: 12, isBurnt: false, isRepairNeeded: false, isMissing: false},
  { isFull: false, binNum: 2345, isBurnt: false, isRepairNeeded: false, isMissing: false},
  { isFull: false, binNum: 7545, isBurnt: false, isRepairNeeded: false, isMissing: false},
  { isFull: false, binNum: 8765, isBurnt: false, isRepairNeeded: false, isMissing: false},
  { isFull: false, binNum: 2334, isBurnt: false, isRepairNeeded: false, isMissing: false},
  { isFull: false, binNum: 4632, isBurnt: false, isRepairNeeded: false, isMissing: false},
];

/**
 * exceptionBinData represents initial state of exception bins, while this could be empty for proof of concept, initial
 * values are stored within. This is particularly useful for offline and queues of flagged bins in sending one json
 *
 * @type {Array<Object>}
 * @property {number} binNum - A unique identifier for the bin.
 * @property {boolean} isRepairNeeded - Indicates whether the bin is in need of repair.
 * @property {boolean} isMissing - Indicates whether the bin is missing.
 */
const initialExceptionBinData = [
  {binNum: 999997, isRepairNeeded: false, isMissing: false},
  {binNum: 999998, isRepairNeeded: false, isMissing: false}
]

/**
 * createContext creates a context for the bin data, which includes the bin array and functions for interacting with this data.
 *
 * @type {Object}
 * @property {Array<Object>} binData - Current state of all bins.
 * @property {Function} setBinData - Function to replace the entire bin data array.
 * @property {Function} updateBin - Function to update specific properties of a specific bin.
 * @property {Function} getBinData - Function to retrieve the data of a specific bin.
 * @property {Function} setBinFull - Function to update the 'isFull' property of a specific bin.
 * @property {Function} setBinBurnt - Function to update the 'isBurnt' property of a specific bin.
 * @property {Function} setBinMissing - Function to update the 'isMissing' property of a specific bin.
 * @property {Function} setBinToRepair - Function to update the 'isRepairNeeded' property of a specific bin.
 */

const BinContext = createContext({
  onSetup: () => {},
  getOnMainPage: () => {},
  setOnMainPage: () => {},
  getSelectedSiding: () => {},
  setSelectedSiding: () => {},
  getSelectedFarm: () => {},
  setSelectedFarm: () => {},
  getBins: () => {},
  handleConsignBin: () => {},
  handleConsignRange: () => {},
  handleUpdateBinState: () => {},
  handleFindBin: () => {},
  refreshSidingData: () => {},
  onReconnected: () => {},
  loadData: () => {},
});

/**
 * BinProvider is a React component that provides a context for managing and accessing bin data across the application.
 * It encapsulates the state and functions for manipulating this state, making it accessible to any component within its tree.
 *
 * @component
 * @param {Object} props - The props object for this provider, typically containing children components.
 * @param {ReactNode} props.children - The children nodes that this provider will wrap, giving them access to the bin context.
 * @returns {ReactNode} A Provider component that passes down bin data and manipulation functions to its children.
 */
let connected = true;

let selectedSiding;
let selectedFarm;

const offlineConsignActions = [];
const offlineBinStateActions = [];

export const BinProvider = ({ children }) => {
  const [bins, setBins] = useState();
  const [onMainPage, setOnMainPage] = useState(false); // I suck

  useEffect(() => {
    AsyncStorage.getItem('offline')
        .then(json => {
          if (json == null) return;
          const arr = JSON.parse(json);
          if (arr[0].length !== 0)
            offlineConsignActions.push(...arr[0]);
          if (arr[1].length !== 0)
            offlineBinStateActions.push(...arr[1]);
          console.info('Offline data restored: ', arr);
        })
        .catch(err => console.error('Restoring offline data', err));
  }, []);

  const getOnMainPage = () => {
      return onMainPage;
  };

  const getBins = () => {
      return bins;
  };

  const getSelectedSiding = () => {
      return selectedSiding;
  };

  const setSelectedSiding = (siding) => {
    selectedSiding = siding;
  };

  const getSelectedFarm = () => {
      return selectedFarm;
  };

  const setSelectedFarm = (farm) => {
    selectedFarm = farm;
  };

  const onSetup = () => {
      setOnMainPage(true);
      loadData();
      if (haveOfflineData())
        onReconnected();
  };

  const loadData = () => {
      console.info('tent', selectedSiding);
      if (selectedSiding == null) return;
      getBinsFromSiding(selectedSiding.sidingID)
          .then(response => {
              setBins(response);
          })
          .catch(err => {
              console.error(err);
              errorToast(err)
          });
  };

  NetInfo.addEventListener(state => {
      if (!connected && state.isConnected) {
        connected = state.isConnected;
        onReconnected();
      } else {
        connected = state.isConnected;
      }
  });

  const onReconnected = () => {
      if (!connected || selectedSiding == null) return;
      showToast('Syncing Offline Data', 'info');

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
      return performConsignActions()
          .then(consignComplete => {
              if (!consignComplete)
                errorToast({message: 'Failed to upload some consignments, press send in the settings menu to try again.'});
              return performBinStateActions();
          })
          .then(binStateComplete => {
              if (!binStateComplete)
                errorToast({message: 'Failed to upload some bin changes, press send in the settings menu to try again.'});
              persistOfflineData();
              loadData();
              showToast('Finished Syncing Offline Data', 'success');
          })
          .catch(err => {
              console.error(err);
              errorToast(err);
          });
  };

  const haveOfflineData = () => {
    return offlineConsignActions.length !== 0 || offlineBinStateActions.length !== 0;
  };

  const persistOfflineData = () => {
    AsyncStorage.setItem('offline', JSON.stringify([offlineConsignActions, offlineBinStateActions]))
        .then(() => {console.info('Offline data persisted')})
        .catch(err => console.error('Persisting offline data', err));
  };

  const handleConsignRange = (startIndex, endIndex) => {
      if (!connected) {
          for (let i = startIndex; i <= endIndex; i++) {
              const bin = bins[i];
              if (bin == null) {
                  console.error('Shouldn\'t be here');
                  continue;
              }
              offlineConsignActions.push({binID: bin.binID, full: !bin.full});
              persistOfflineData();
              handleSuccessfulConsignBin(bin);
          }
          setBins([...bins]);
          return;
      }

      // I'm lazy
      const promises = [];
      for (let i = startIndex; i <= endIndex; i++) {
          promises.push(consignBin(bins[i].binID, !bins[i].full));
      }

      Promise.allSettled(promises)
          .then(responses => {
              for (let i = 0 + startIndex; i < responses.length + startIndex; i++) {
                  const response = responses[i - startIndex];
                  if (response.status === 'rejected') {
                      console.error(response.reason);
                      if (bins[i] != null)
                        errorToast({message: `Failed to consign bin: ${bins[i]?.binID}. Please try again.`});
                      continue;
                  }

                  const bin = bins[i];
                  if (bin == null) {
                      console.error('Shouldn\'t be here');
                      continue;
                  }
                  handleSuccessfulConsignBin(bin);
              }
              setBins([...bins]);
          })
          .catch(err => {
              console.error(err);
              errorToast(err);
          });
  };

  const handleConsignBin = (bin) => {
    if (!connected) {
        offlineConsignActions.push({binID: bin.binID, full: !bin.full});
        persistOfflineData();
        if (handleSuccessfulConsignBin(bin))
            setBins([...bins]);
        return;
    }
    consignBin(bin.binID, !bin.full)
        .then(response => {
            if (handleSuccessfulConsignBin(bin))
                setBins([...bins]);
        })
        .catch(err => {
          console.error(err);
          errorToast(err);
        });
  };

  const handleSuccessfulConsignBin = (bin) => {
      bin.full = !bin.full;
      const index = bins.findIndex(b => b.binID === bin.binID);
      if (index >= 0) {
          bins[index] = bin;
          return true;
      }
      return false;
  };

  const handleUpdateBinState = (bin, field, state) => {
      if (!connected) {
          offlineBinStateActions.push({binID: bin.binID, field: field, state: state});
          persistOfflineData();
          handleSuccessfulUpdateBinState(bin, field, state);
          return;
      }

      updateBinFieldState(bin.binID, field, state)
          .then(response => {
              handleSuccessfulUpdateBinState(bin, field, state);
          })
          .catch(err => {
              console.error(err);
              errorToast(err);
          });
  };

  const handleSuccessfulUpdateBinState = (bin, field, state) => {
      if (field === 'BURNT') bin.burnt = state;
      else if (field === 'MISSING') bin.missing = state;
      else bin.repair = state;

      const index = bins.findIndex(b => b.binID === bin.binID);
      if (index >= 0) {
          if (field === 'MISSING') bins.splice(index, 1);
          else bins[index] = bin;

          setBins([...bins]);
      } else {
          // rip
          console.error('Shouldn\'t be here');
      }
  };

  const handleFindBin = (code) => {
      if (!connected) return;

      findBin(code, 1)
          .then(bin => {
              bins.push(bin);
          })
          .catch(err => {
              console.error(err);
              errorToast(err);
          });
  };

    const refreshSidingData = () => {
        if (!connected) return;

        loadData();
    };

  return (
    <BinContext.Provider
      value={{
        onSetup,
        getOnMainPage,
        setOnMainPage,
        getSelectedSiding,
        setSelectedSiding,
        getSelectedFarm,
        setSelectedFarm,
        getBins,
        loadData,
        handleConsignBin,
        handleConsignRange,
        handleUpdateBinState,
        handleFindBin,
        refreshSidingData,
        onReconnected,
      }}
    >
      {children}
    </BinContext.Provider>
  );
};

/**
 * useBins is a custom hook that provides access to the bin data and manipulation functions within the React component tree.
 *
 * This hook is central to interacting with the bin data, facilitating both retrieval and update operations.
 *
 * @hook
 * @returns {{binData, exceptionBinData, setBinData, setExceptionBinData,updateBin, getBinData, getExceptionBinData, setBinFull, setBinBurnt, setBinToRepair, setBinMissing, createBin, flagBin}} The context object containing bin data and utility functions.
 */

export const useBins = () => useContext(BinContext);
