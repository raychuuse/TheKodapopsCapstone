import { createContext, useState, useContext} from 'react';

// initial dummy values
const initialValues = {Siding: "", Farm: "", Block:"", Sub: "", Pad: "", Burnt: "Neutral"};

export const SelectionContext = createContext({
    selectionData: initialValues,
    setSelectionData: () => {},
    updateSelection: () => {},
    getSiding: () => {},
    getFarm: () => {},
    getBlock: () => {},
    getSub: () => {},
    getPad: () => {},
    getBurnt: () => {},
    updateSiding: () => {},
    updateFarm: () => {},
    updateBlock: () => {},
    updateSub: () => {},
    updatePad: () => {},
    updateBurnt: () => {},
    resetSelectData: () => {},
    getFarmID: () => {},
    setFarmID: () => {},
    getBlockID: () => {},
    setBlockID: () => {},
});

// Need a way to transport data from child components to parents can use asyncStorage (esp for peristence), 
// in this case will just reload 
export const SelectionProvider = ({ children }) => {
    // Refactored to one set of data
    const [selectionData, _setSelectionData] = useState(initialValues);
    const [farmID, _setFarmID] = useState("");
    const [blockID, _setBlockID] = useState("");
    const setSelectionData = (newData) => {
        _setSelectionData(newData);
    }

    const updateSelection = (update) => {
        setSelectionData({ ...selectionData, ...update });
    }

    const getFarmID = () => {
        return farmID;
    }

    const setFarmID = (ID) => {
        _setFarmID(ID);
    }

    const getBlockID = () => {
        return blockID;
    }

    const setBlockID = (ID) => {
        _setBlockID(ID);
    }

    const getSiding = () => {
        return selectionData.Siding;
    }

    const getFarm = () => {
        return selectionData.Farm;
    }

    const getBlock = () => {
        return selectionData.Block;
    }

    const getSub = () => {
        return selectionData.Sub;
    }

    const getPad = () => {
        return selectionData.Pad;
    }

    const getBurnt = () => {
        return selectionData.Burnt;
    }

    // Functionality seperate since it's only one property difference, and ts isn't in use
    const updateSiding = (newVal) => {
        _selectionData = selectionData;
        _selectionData.Siding = newVal;
        setSelectionData(_selectionData);
    }

    const updateFarm = (newVal) => {
        _selectionData = selectionData;
        _selectionData.Farm = newVal;
        setSelectionData(_selectionData);
    }

    const updateBlock = (newVal) => {
        _selectionData = selectionData;
        _selectionData.Block = newVal;
        setSelectionData(_selectionData);
    }

    const updateSub = (newVal) => {
        _selectionData = selectionData;
        _selectionData.Sub = newVal;
        setSelectionData(_selectionData);
    }

    const updatePad = (newVal) => {
        _selectionData = selectionData;
        _selectionData.Pad = newVal;
        setSelectionData(_selectionData);
    }

    const updateBurnt = (newVal) => {
        _selectionData = selectionData;
        _selectionData.Burnt = newVal;
        setSelectionData(_selectionData);
    }

    const resetSelectData = () => {
        _setSelectionData(initialValues);
    }

  return (
    <SelectionContext.Provider value={
        {selectionData,
        setSelectionData,
        updateSelection,
        getSiding,
        getFarm,
        getBlock,
        getSub,
        getPad,
        getBurnt,
        updateSiding,
        updateFarm,
        updateBlock,
        updateSub,
        updatePad,
        updateBurnt,
        getFarmID,
        setFarmID,
        getBlockID,
        setBlockID,
        resetSelectData}}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelections = () => useContext(SelectionContext);