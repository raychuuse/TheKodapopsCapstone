/**
 * Used to set if a bin is full, Required to rerender the app and set data correctly.
 * @param {number} binNumber
 * @param {number} sidingId
 * @param {object} runData
 * @param {object} setRunData
 * @param {string} binListName
 * @param {boolean} debug
 */
export function SetIsFull(
  binNumber,
  sidingId,
  runData,
  setRunData,
  binListName,
  debug = false
) {
  // Initialise New Run Data bases off old run data
  const newRunData = runData;
  let currentState;

  // Find and set bin to full
  if (binListName === 'binsDrop') {
    // Get Current State
    currentState = newRunData
      .find((item) => item.id === sidingId)
      .binsDrop.find((item) => item.binNumber === binNumber).isFull;

    // Set the inverted State as new state
    newRunData
      .find((item) => item.id === sidingId)
      .binsDrop.find((item) => item.binNumber === binNumber).isFull =
      !currentState;
  } else if (binListName === 'binsCollect') {
    // Get Current State
    currentState = newRunData
      .find((item) => item.id === sidingId)
      .binsCollect.find((item) => item.binNumber === binNumber).isFull;

    // Set the inverted State as new state
    newRunData
      .find((item) => item.id === sidingId)
      .binsCollect.find((item) => item.binNumber === binNumber).isFull =
      !currentState;
  }
  // Apply changes to the state
  setRunData(newRunData);

  // Debug Log
  debug ? console.log(JSON.stringify(runData)) : null;
}

/**
 * Used to set if a bin is burnt, Required to rerender the app and set data correctly.
 * @param {number} binNumber
 * @param {number} sidingId
 * @param {object} runData
 * @param {object} setRunData
 * @param {string} binListName
 * @param {boolean} debug
 */
export function SetIsBurnt(
  binNumber,
  sidingId,
  runData,
  setRunData,
  binListName,
  debug = false
) {
  // Initialise New Run Data bases off old run data
  const newRunData = runData;
  let currentState;

  // Find and set bin to full
  if (binListName === 'binsDrop') {
    // Get Current State
    currentState = newRunData
      .find((item) => item.id === sidingId)
      .binsDrop.find((item) => item.binNumber === binNumber).isBurnt;

    // Set the inverted State as new state
    newRunData
      .find((item) => item.id === sidingId)
      .binsDrop.find((item) => item.binNumber === binNumber).isBurnt =
      !currentState;
  } else if (binListName === 'binsCollect') {
    // Get Current State
    currentState = newRunData
      .find((item) => item.id === sidingId)
      .binsCollect.find((item) => item.binNumber === binNumber).isBurnt;

    // Set the inverted State as new state
    newRunData
      .find((item) => item.id === sidingId)
      .binsCollect.find((item) => item.binNumber === binNumber).isBurnt =
      !currentState;
  }
  // Apply changes to the state
  setRunData(newRunData);

  // Debug Log
  debug ? console.log(JSON.stringify(runData)) : null;
}
