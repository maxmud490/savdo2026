// SalesEditModal.js

import { useState, useEffect } from "react";
import SalesFormComponent from "./product/SalesFormComponent";


const SalesEditModal = ({
  selectedItem,
  handleCloseModal,
  handleSubmit,
  handleChange,
  salesData,
  // Other necessary props
}) => {
  const [editedItem, setEditedItem] = useState(null);

  useEffect(() => {
    // When the selectedItem changes, update the editedItem state
    setEditedItem(selectedItem);
  }, [selectedItem]);

  // Placeholder function for handling form submission for editing
  const handleEditSubmit = () => {
    // Placeholder function for any necessary validation or processing before submitting
    handleSubmit(editedItem);

    // Close the modal after submitting
    handleCloseModal();
  };

  return (
    <div className="modal_container">
      <SalesFormComponent
        handleCloseModal={handleCloseModal}
        handleSubmit={handleEditSubmit}
        salesData={salesData}
        handleChange={handleChange}
       
      />
    </div>
  );
};

export default SalesEditModal;
