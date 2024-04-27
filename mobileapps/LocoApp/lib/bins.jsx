import { useCallback } from 'react';
import { useRun } from '../context/runContext';

/**
 * Custom hook to toggle the 'isFull' status of a bin.
 * @param {number} sidingId
 * @param {number} binNumber
 * @param {boolean} isDrop
 */
export function useSetIsFull() {
  const { updateBin, getBin } = useRun();

  return useCallback(
    (sidingId, binNumber, isDrop) => {
      const bin = getBin(sidingId, binNumber, isDrop);
      console.log(bin);
      if (bin) {
        // Toggle the 'isFull' flag
        const updatedBin = { ...bin, isFull: !bin.isFull };
        updateBin(sidingId, binNumber, updatedBin, isDrop);
      }
    },
    [getBin, updateBin]
  );
}

/**
 * Custom hook to toggle the 'isBurnt' status of a bin.
 * @param {number} sidingId
 * @param {number} binNumber
 * @param {boolean} isDrop
 */
export function useSetIsBurnt() {
  const { updateBin, getBin } = useRun();

  return useCallback(
    (sidingId, binNumber, isDrop) => {
      const bin = getBin(sidingId, binNumber, isDrop);
      if (bin) {
        // Toggle the 'isBurnt' flag
        const updatedBin = { ...bin, isBurnt: !bin.isBurnt };
        updateBin(sidingId, binNumber, updatedBin, isDrop);
      }
    },
    [getBin, updateBin]
  );
}
