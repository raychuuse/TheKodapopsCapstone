import React, { createContext, useState, useContext, useEffect } from 'react';
import { consignBin, findBin, updateBinFieldState } from '../api/bins.api';
import {getBinsFromSiding}  from '../api/siding.api'
import NetInfo from "@react-native-community/netinfo";

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
  binData: initialBinData,
  exceptionBinData: initialExceptionBinData,
  setBinData: () => {},
  setExceptionBinData: () => {},
  updateBin: () => {},
  updateExceptionBin: () => {},
  getBinData: () => {},
  getExceptionBinData: () => {},
  setBinFull: () => {},
  setBinBurnt: () => {},
  setBinToRepair: () => {},
  setBinMissing: () => {},
  deleteBin: () => {},
  setBurn: () => {},
  checkRepair: () => {},
  getBins: () => {},
  handleConsignBin: () => {},
  handleConsignRange: () => {},
  handleUpdateBinState: () => {},
  handleFindBin: () => {},
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
const offlineConsignActions = [];
const offlineBinStateActions = [];

export const BinProvider = ({ children }) => {
  const [binData, _setBinData] = useState(initialBinData);
  const [exceptionBinData, _setExceptionBinData] = useState(initialExceptionBinData);
  const [bins, setBins] = useState();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
      getBinsFromSiding(1)
          .then(response => {
              setBins(response);
          })
          .catch(err => {
              console.error(err);
          });
  };

  NetInfo.addEventListener(state => {
      console.info('Connected', state.isConnected);
      if (!connected && state.isConnected)
          onReconnected();
      connected = state.isConnected;
  });

  const onReconnected = () => {
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
      return performConsignActions()
          .then(consignComplete => {
              if (!consignComplete) throw new Error("Consign actions failed");
              return performBinStateActions();
          })
          .then(binStateComplete => {
              if (!binStateComplete) throw new Error("Bin state actions failed");
              loadData();
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

  const getBins = () => {
    return bins;
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
          });
  };

  const handleConsignBin = (bin) => {
    if (!connected) {
        offlineConsignActions.push({binID: bin.binID, full: !bin.full});
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
          handleSuccessfulUpdateBinState(bin, field, state);
          return;
      }

      updateBinFieldState(bin.binID, field, state)
          .then(response => {
              handleSuccessfulUpdateBinState(bin, field, state);
          })
          .catch(err => {
              console.error(err);
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
          });
  };

  /**
   * Replaces the current bin data with a new array of bin data.
   * This function should be used when you need to refresh the entire list of bins or set an entirely new state.
   *
   * @param {Array<Object>} newData - The new data that will replace the current bin data array. Each object should
   * contain at least the properties `isFull`, `binNum`, and `isBurnt`.
   */
  const setBinData = (newData) => {
    _setBinData(newData);
  };

  /**
   * Same as prior function but for the exception data
   *
   * @param {Array<Object>} newData - The new data that will replace the current exception bin data array. Each object should
   * contain at least the properties `binNum`, `isRepairNeeded`, and `isMissing`.
   */
    const setExceptionBinData = (newData) => {
      _setExceptionBinData(newData);
    };

  /**
   * updateBin updates specific properties of a bin identified by its bin number. This is a general-purpose function
   * that can be used to update any property of a bin.
   *
   * @function
   * @param {number} binNum - The unique identifier of the bin to be updated.
   * @param {Object} updates - An object containing the properties to update and their new values.
   */
  const updateBin = (binNum, updates) => {
    const updatedData = binData.map((bin) =>
      bin.binNum === binNum ? { ...bin, ...updates } : bin
    );
    setBinData(updatedData);
  };


  /**
   * updateExceptionBin does the same as the former, but for missing and repair bins that have been flagged. Note
   * the update bin functionality uses a ternary function in mind of existent bins.
   *
   * @function
   * @param {number} binNum - The unique identifier of the bin to be updated.
   * @param {Object} updates - An object containing the properties to update and their new values.
   */
  const updateExceptionBin = (binNum, updates) => {
    const updatedData = exceptionBinData.map((bin) =>
      bin.binNum === binNum ? { ...bin, ...updates } : bin
    );
    setExceptionBinData(updatedData);
  };

  /**
   * setBinBurnt is a specific function to set the 'isBurnt' status of a bin. It uses the `updateBin` function to change the status.
   *
   * @function
   * @param {number} binNum - The unique identifier of the bin to update.
   * @param {boolean} isBurnt - The new 'isBurnt' status to be set for the bin.
   */
  const setBinBurnt = (binNum, isBurnt) => {
    updateBin(binNum, { isBurnt });
  };

  /**
   * setBinFull is a specific function to set the 'isFull' status of a bin. It uses the `updateBin` function to change the status.
   *
   * @function
   * @param {number} binNum - The unique identifier of the bin to update.
   * @param {boolean} isFull - The new 'isFull' status to be set for the bin.
   */
  const setBinFull = (binNum, isFull) => {
    updateBin(binNum, { isFull });
  };

  /**
   * setBinMissing is a specific function to set the 'isMissing' status of a bin. It uses the `updateExceptionBin` function to change the status.
   *
   * @function
   * @param {number} binNum - The unique identifier of the bin to update.
   * @param {boolean} isMissing - The new 'isMissing' status to be set for the bin.
   */
  const setBinMissing = (binNum, isMissing) => {
    updateBin(binNum, { isMissing });
  };

  /**
   * setBinToRepair is a specific function to set the 'isRepairNeeded' status of a bin. It uses the `updateBin` function to change the status.
   *
   * @function
   * @param {number} binNum - The unique identifier of the bin to update.
   * @param {boolean} isRe - The new 'isRepairNeeded' status to be set for the bin.
   */
  const setBinToRepair = (binNum, isRepairNeeded) => {
    updateBin(binNum, { isRepairNeeded });
  };

  /**
   * getBinData retrieves the data for a specific bin, identified by its bin number.
   * This function searches the current bin data array and returns the corresponding bin object.
   *
   * @function
   * @param {number} binNum - The unique identifier of the bin whose data is to be retrieved.
   * @returns {Object|null} The bin object if found, or null if there is no bin with the given identifier.
   */
  const getBinData = (binNum) => {
    return binData.find((bin) => bin.binNum === binNum);
  };

  /**
   * getExceptionBinData does the same as 'getBinData' but for the exception cases, i.e. missing and repair needing bins.
   *
   * @function
   * @param {number} binNum - The unique identifier of the bin whose data is to be retrieved.
   * @returns {Object|null} The bin object if found, or null if there is no flagged bin with the given identifier.
   */
  const getExceptionBinData = (binNum) => {
    return exceptionBinData.find((bin) => bin.binNum === binNum);
  };

  const checkRepair = (binNum) => {
    const val = exceptionBinData.find((bin) => bin.binNum === binNum)
    if (!val) {
      return false;
    }
    else {
      return val.isRepairNeeded;
    }
  };

  const deleteBin = (binNum) => {
    var filtered = binData.filter(function(func) { return func.binNum != binNum; });
    setBinData(filtered);
  }

  /**
   * Adds a new bin to the current bin data array.
   * This function allows dynamically adding new bins with specific attributes to the bin list.
   *
   * @param {Object} newBin - The new bin object to add to the bin data. It should contain properties like `isFull`, `binNum`, and `isBurnt`.
   */
  const createBin = (newBin) => {
    setBinData((prevBins) => [...prevBins, newBin]);
  };

 /**
   * flagBin is the same as 'CreateBin' but for dynamically adding to a flagged bin list.
   *
   * @param {Object} flaggedBin - The bin object to add to the bin exception data.
   * It should contain properties like `binNum`, `setBinMissing`
   */
 const flagBin = (bin) => {
  setBinData(binData.map((bin) => {bin.isBurnt = bool; return bin}));
};

const setBurn = (bool) => {
  setBinData(binData.map((bin) => {bin.isBurnt = bool; return bin}));
}

  return (
    <BinContext.Provider
      value={{
        binData,
        setBinData,
        setExceptionBinData,
        updateBin,
        updateExceptionBin,
        getBinData,
        getExceptionBinData,
        setBinFull,
        setBinBurnt,
        setBinToRepair,
        setBinMissing,
        createBin,
        flagBin,
        deleteBin,
        setBurn,
        checkRepair,
        getBins,
        handleConsignBin,
        handleConsignRange,
        handleUpdateBinState,
        handleFindBin
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
