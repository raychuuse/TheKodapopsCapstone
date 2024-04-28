// Import Mock Data
import { RunMockData } from '../data/RunMockData';

/**
 * Used to set if a bin is full, Required to rerender the app and set data correctly.
 * @param {number} binID
 * @param {number} sidingId
 * @param {object} run
 * @param {object} setRun
 * @param {string} binListName
 * @param {boolean} debug
 */
export function SetIsFull(
  binID,
  sidingId,
  run,
  setRun,
  binListName,
  debug = false
) {
  // Initialise New Run Data bases off old run data
  const newRunData = run;
  let currentState;

  // Find and set bin to full
  if (binListName === 'binsDrop') {
    // Get Current State
    currentState = newRunData.sidings
      .find((item) => item.id === sidingId)
      .binsDrop.find((item) => item.binNumber === binID).isFull;

    // Set the inverted State as new state
    newRunData.sidings
      .find((item) => item.id === sidingId)
      .binsDrop.find((item) => item.binNumber === binID).isFull =
      !currentState;
  } else if (binListName === 'binsCollect') {
    // Get Current State
    currentState = newRunData.sidings
      .find((item) => item.id === sidingId)
      .binsCollect.find((item) => item.binNumber === binID).isFull;

    // Set the inverted State as new state
    newRunData.sidings
      .find((item) => item.id === sidingId)
      .binsCollect.find((item) => item.binNumber === binID).isFull =
      !currentState;
  }
  // Apply changes to the state
  setRun(newRunData);

  // Debug Log
  debug ? console.log(JSON.stringify(run)) : null;
}

/**
 * Used to set if a bin is burnt, Required to rerender the app and set data correctly.
 * @param {number} binID
 * @param {number} sidingId
 * @param {RunMockData} run
 * @param {object} setRun
 * @param {string} binListName
 * @param {boolean} debug
 */
export function SetIsBurnt(
  binID,
  sidingId,
  run,
  setRun,
  binListName,
  debug = false
) {
  // Initialise New Run Data bases off old run data
  const newRunData = run;
  let currentState;

  // Find and set bin to full
  if (binListName === 'binsDrop') {
    // Get Current State
    currentState = newRunData.sidings
      .find((item = RunMockData) => item.id === sidingId)
      .binsDrop.find((item) => item.binNumber === binID).isBurnt;

    // Set the inverted State as new state
    newRunData.sidings
      .find((item) => item.id === sidingId)
      .binsDrop.find((item) => item.binNumber === binID).isBurnt =
      !currentState;
  } else if (binListName === 'binsCollect') {
    // Get Current State
    currentState = newRunData.sidings
      .find((item) => item.id === sidingId)
      .binsCollect.find((item) => item.binNumber === binID).isBurnt;

    // Set the inverted State as new state
    newRunData.sidings
      .find((item) => item.id === sidingId)
      .binsCollect.find((item) => item.binNumber === binID).isBurnt =
      !currentState;
  }
  // Apply changes to the state
  setRun(newRunData);

  // Debug Log
  debug ? console.log(JSON.stringify(run)) : null;
}
