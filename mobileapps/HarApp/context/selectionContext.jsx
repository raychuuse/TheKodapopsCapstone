import { createContext, useState, useContext} from 'react';

// initial dummy values
const initialValues = ["Babinda", "Green Valley Farm", "", "", "", "No"];

export const selectionContext = createContext({updateSelection: () => {}});

// Need a way to transport data from child components to parents can use asyncStorage (esp for peristence), 
// in this case will just reload 
export const selectionProvider = ({ children }) => {
    const [selectedFarm, selectFarm] = useState(initialValues[0])
    const [selectedSiding, selectSiding] = useState(initialValues[1])
    const [selectedBlock, selectBlock] = useState(initialValues[2])
    const [selectedSub, selectSub] = useState(initialValues[3])
    const [selectedPad, selectPad] = useState(initialValues[4])
    const [selectedAsBurnt, selectBurnt] = useState(initialValues[5]);

    // Updates selections based on child changes
    // Note val is not 1 or 2, but the name of the element
    const updateSelection = (type, newVal) => {
        switch (type) {
            case "Siding":
                selectSiding(newVal);
            case "Farm":
                selectFarm(newVal);
            case "Block":
                selectBlock(newVal);
            case "Sub":
                selectSub(newVal);
            case "Pad":
                selectPad(newVal);
            case "Burnt":
                selectBurnt(newVal);
        }
    }



    // if just needing to recieve data, use if (lastJsonMessage)
    const selectedValues = {
        selectedSiding,
        selectedFarm,
        selectedBlock,
        selectedSub,
        selectedPad,
        selectedAsBurnt,
        updateSelection
  };

  return (
    <selectionContext.Provider value={selectedValues}>
      {children}
    </selectionContext.Provider>
  );
};

export const useSelections = () => useContext(selectionContext);