import React, { createContext, useReducer, useContext } from 'react';

// Import Mock Data from a relative path
import { RunMockData } from '../data/RunMockData';

// Create a React context for storing and managing run data
const RunContext = createContext();

/**
 * Reducer function to handle actions that update the state of the run data
 * @param state The current state of the run data
 * @param action The action object that triggers state updates
 */
function runReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_RUN':
      // Handles updates to the top-level run properties
      return { ...state, ...action.payload };
    case 'UPDATE_SIDING':
      // Updates a specific siding by id within the sidings array
      return {
        ...state,
        sidings: state.sidings.map((siding) =>
          siding.id === action.payload.id
            ? { ...siding, ...action.payload.updates }
            : siding
        ),
      };
    case 'UPDATE_BIN_DROP':
    case 'UPDATE_BIN_COLLECT':
      // Determines which bins array (drop or collect) to update
      const binsKey =
        action.type === 'UPDATE_BIN_DROP' ? 'binsDrop' : 'binsCollect';
      return {
        ...state,
        sidings: state.sidings.map((siding) =>
          siding.id === action.sidingId
            ? {
                // Update specific bin details within either binsDrop or binsCollect array
                ...siding,
                [binsKey]: siding[binsKey].map((bin) =>
                  bin.binNumber === action.payload.binNumber
                    ? { ...bin, ...action.payload.updates }
                    : bin
                ),
              }
            : siding
        ),
      };
    case 'ADD_BIN':
      // Adds a new bin to the specified bins array in a siding.
      return {
        ...state,
        sidings: state.sidings.map((siding) =>
          siding.id === action.sidingId
            ? {
                ...siding,
                [action.binsKey]: [...siding[action.binsKey], action.payload],
              }
            : siding
        ),
      };
    case 'REMOVE_BIN':
      // Removes a bin from the specified bins array in a siding.
      return {
        ...state,
        sidings: state.sidings.map((siding) =>
          siding.id === action.sidingId
            ? {
                ...siding,
                [action.binsKey]: siding[action.binsKey].filter(
                  (bin) => bin.binNumber !== action.binNumber
                ),
              }
            : siding
        ),
      };
    default:
      // Throws an error if an action type is not handled
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// Context provider component that makes the run data accessible throughout the component tree
export const RunProvider = ({ children }) => {
  const [state, dispatch] = useReducer(runReducer, RunMockData);

  // Dispatches an action to update the entire run object
  const updateRun = (updates) =>
    dispatch({ type: 'UPDATE_RUN', payload: updates });

  // Dispatches an action to update specific properties of a siding

  const updateSiding = (id, updates) =>
    dispatch({ type: 'UPDATE_SIDING', payload: { id, updates } });

  //Dispatches an action to update specific bin details in drop or collect arrays
  const updateBin = (sidingId, binNumber, updates, isDrop = true) => {
    const type = isDrop ? 'UPDATE_BIN_DROP' : 'UPDATE_BIN_COLLECT';
    dispatch({ type, sidingId, payload: { binNumber, updates } });
  };

  // Retrieves the entire run data from the state
  const getRun = () => state;

  // Retrieves a specific siding by ID from the state
  const getSiding = (id) => state.sidings.find((siding) => siding.id === id);

  // Retrieves bins from a specific siding, either drop or collect
  const getBins = (sidingId, isDrop = true) => {
    const siding = getSiding(sidingId);
    return siding ? (isDrop ? siding.binsDrop : siding.binsCollect) : [];
  };

  // Retrieves a specific bin from a specific siding, either drop or collect
  const getBin = (sidingId, binNumber, isDrop) => {
    const siding = getSiding(sidingId);
    if (!siding) return undefined;
    const binsKey = isDrop ? 'binsDrop' : 'binsCollect';
    return siding[binsKey].find((bin) => bin.binNumber === binNumber);
  };

  // Function to add a new bin to a siding, specifying whether it's a drop or collect bin.
  const addBin = (sidingId, binNumber, isDrop = true) => {
    const binsKey = isDrop ? 'binsDrop' : 'binsCollect';
    // Construct the payload within the function
    const newBin = {
      binNumber: binNumber,
      isFull: false, // Default value
      isBurnt: false, // Default value
    };
    dispatch({ type: 'ADD_BIN', sidingId, binsKey, payload: newBin });
  };

  // Function to remove a bin from a siding, specifying whether it's from the drop or collect array.
  const removeBin = (sidingId, binNumber, isDrop = true) => {
    const binsKey = isDrop ? 'binsDrop' : 'binsCollect';
    dispatch({ type: 'REMOVE_BIN', sidingId, binsKey, binNumber });
  };

  return (
    <RunContext.Provider
      value={{
        state,
        getRun,
        getSiding,
        getBins,
        getBin,
        updateRun,
        updateSiding,
        updateBin,
        addBin,
        removeBin,
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
 *   getBin: (sidingId: number, binNumber: number, isDrop: boolean) => object | undefined,
 *   updateRun: (updates: object) => void,
 *   updateSiding: (id: number, updates: object) => void,
 *   updateBin: (sidingId: number, binNumber: number, updates: object, isDrop: boolean) => void,
 *   addBin: (sidingId: number, binNumber: number, isDrop: boolean) => void,
 *   removeBin: (sidingId: number, binNumber: number, isDrop: boolean) => void
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
 *
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
 * - `addBin`: Adds a new bin to a specific siding.
 *   @param {number} sidingId The ID of the siding where the bin is added.
 *   @param {number} binNumber The number of the new bin.
 *   @param {boolean} isDrop Specifies whether the new bin is in the 'drop' array or 'collect' array.
 *
 * - `removeBin`: Removes a bin from a specific siding.
 *   @param {number} sidingId The ID of the siding where the bin is removed.
 *   @param {number} binNumber The number of the bin to remove.
 *   @param {boolean} isDrop Specifies whether the bin to be removed is from the 'drop' array or 'collect' array.
 *
 * @example
 * const { runData, getRun, updateRun, getSiding, getBins, updateSiding, updateBin, addBin, removeBin } = useRun();
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
    state,
    getRun,
    getSiding,
    getBins,
    getBin,
    updateRun,
    updateSiding,
    updateBin,
    addBin,
    removeBin,
  } = useContext(RunContext);
  return {
    runData: state,
    getRun,
    getSiding,
    getBins,
    getBin,
    updateRun,
    updateSiding,
    updateBin,
    addBin,
    removeBin,
  };
};
