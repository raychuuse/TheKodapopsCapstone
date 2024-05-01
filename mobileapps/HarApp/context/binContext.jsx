import React, { createContext, useState, useContext } from 'react';

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
  { isFull: false, binNum: 2141, isBurnt: false},
  { isFull: true, binNum: 2123, isBurnt: true},
  { isFull: false, binNum: 1232, isBurnt: false},
  { isFull: true, binNum: 1234, isBurnt: false},
  { isFull: true, binNum: 5637, isBurnt: false},
  { isFull: false, binNum: 5633, isBurnt: false},
  { isFull: false, binNum: 654, isBurnt: false},
  { isFull: false, binNum: 12, isBurnt: false},
  { isFull: false, binNum: 2345, isBurnt: false},
  { isFull: false, binNum: 7545, isBurnt: false},
  { isFull: false, binNum: 8765, isBurnt: false},
  { isFull: false, binNum: 2334, isBurnt: false},
  { isFull: false, binNum: 4632, isBurnt: false},
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
  setBinMissing: () => {}
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
export const BinProvider = ({ children }) => {
  const [binData, _setBinData] = useState(initialBinData);
  const [exceptionBinData, _setExceptionBinData] = useState(initialExceptionBinData);
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
    updateExceptionBin(binNum, { isMissing });
  };

  /**
   * setBinToRepair is a specific function to set the 'isRepairNeeded' status of a bin. It uses the `updateBin` function to change the status.
   *
   * @function
   * @param {number} binNum - The unique identifier of the bin to update.
   * @param {boolean} isRe - The new 'isRepairNeeded' status to be set for the bin.
   */
  const setBinToRepair = (binNum, isRepairNeeded) => {
    updateExceptionBin(binNum, { isRepairNeeded });
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
 const flagBin = (flaggedBin) => {
  setBinData((prevBins) => [...prevBins, flaggedBin]);
};

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
        flagBin
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
