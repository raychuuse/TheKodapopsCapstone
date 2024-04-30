import React, { createContext, useContext, useState } from 'react';

// Create a context
const ModalContext = createContext();

// Context provider component
const ModalProvider = ({ children }) => {
  // State for modals visibility
  const [modalAddBinVisible, setModalAddBinVisible] = useState(false);
  const [modalSidingVisible, setModalSidingVisible] = useState(false);
  const [modalSelectSidingVisible, setModalSelectSidingVisible] =
    useState(false);

  // State for siding IDs
  const [selectedSidingID, setSelectedSidingID] = useState(3);
  const [sidingToViewID, setSidingToViewID] = useState(2);

  // Function to open siding modal and update the ID to view
  const openSidingModal = (id) => {
    setSidingToViewID(id); // Update the ID of the siding to view
    setModalSidingVisible(true); // Open the siding modal
  };
  const closeSidingModal = () => setModalSidingVisible(false);

  // Function to open and close the Select Siding Modal
  const openSelectSidingModal = () => setModalSelectSidingVisible(true);
  const closeSelectSidingModal = () => setModalSelectSidingVisible(false);

  // Function to open and close the Add Bin Modal
  const openAddBinModal = () => setModalAddBinVisible(true);
  const closeAddBinModal = () => setModalAddBinVisible(false);

  // Function to update the selected siding ID
  const updateSelectedSidingID = (id) => setSelectedSidingID(id);

  // All states and functions to expose through context
  const value = {
    modalSidingVisible,
    modalSelectSidingVisible,
    modalAddBinVisible,
    selectedSidingID,
    sidingToViewID,
    openSidingModal,
    closeSidingModal,
    openSelectSidingModal,
    closeSelectSidingModal,
    openAddBinModal,
    closeAddBinModal,
    updateSelectedSidingID,
  };

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};

/**
 * Custom hook for accessing modal state and actions. This hook simplifies the process of accessing
 * the modal visibility states and functions related to modal management, making it easier to manage these
 * throughout the application without having to deal with the context directly.
 *
 * @returns {{
 *   modalSidingVisible: boolean,
 *   modalSelectSidingVisible: boolean,
 *   modalAddBinVisible: boolean,
 *   selectedSidingID: number,
 *   sidingToViewID: number,
 *   openSidingModal: (id: number) => void,
 *   closeSidingModal: () => void,
 *   openSelectSidingModal: () => void,
 *   closeSelectSidingModal: () => void,
 *   openAddBinModal: () => void,
 *   closeAddBinModal: () => void,
 *   updateSelectedSidingID: (id: number) => void,
 * }} Returns an object containing:
 * - `modalSidingVisible`: Indicates if the siding modal is visible.
 * - `modalSelectSidingVisible`: Indicates if the select siding modal is visible.
 * - `modalAddBinVisible`: Indicates if the add bin modal is visible.
 * - `selectedSidingID`: The currently selected siding ID.
 * - `sidingToViewID`: The ID of the siding to view in the modal.
 *
 * - `openSidingModal`: Opens the siding modal and sets the siding ID to be viewed.
 *   @param {number} id The ID of the siding to open in the modal.
 *
 * - `closeSidingModal`: Closes the siding modal.
 *
 * - `openSelectSidingModal`: Opens the select siding modal.
 *
 * - `closeSelectSidingModal`: Closes the select siding modal.
 *
 * - `openAddBinModal`: Opens the add bin modal.
 *
 * - `closeAddBinModal`: Closes the add bin modal.
 *
 * - `updateSelectedSidingID`: Updates the selected siding ID.
 *   @param {number} id The new ID to set as selected.
 *
 * @example
 * ```jsx
 * const { openSidingModal, closeSidingModal, updateSelectedSidingID } = useModal();
 *
 * // Example of using `openSidingModal`:
 * openSidingModal(5); // Opens the modal and sets the siding ID 5 to view
 * ```
 *
 * @note
 * This hook abstracts away the complexity of the context API and provides direct access to the modal state and functions.
 */
const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export { ModalProvider, useModal };
