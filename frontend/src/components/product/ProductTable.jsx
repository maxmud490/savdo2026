import { useState } from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import EditModal from "./EditModal";
import ConfirmDelete from "./ConfirmDelete";
import PropTypes from "prop-types";


function ProductTable({ productArray, deleteItem, loading, fetchProductData,filteredProduct,setSearchProduct,searchProduct, handlePrint, salesArray}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  

  const openDeleteModal = (id) => {
    setItemIdToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setItemIdToDelete(null);
  };

  const confirmDelete = () => {
    if (itemIdToDelete) {
      deleteItem(itemIdToDelete);
      closeDeleteModal();
    }
  };
  
const handleEditProduct = (id) => {
  // MongoDB'dan kelayotgan productda _id bor.
  // Eski ma'lumotlarda id bo'lishi mumkin.
  const productToEdit = productArray.find(
    (product) => (product._id || product.id) === id
  );

  console.log("=================================");
  console.log("✏️ EDIT BOSILDI");
  console.log("🆔 KELGAN ID:", id);
  console.log("📦 TOPILGAN PRODUCT:", productToEdit);
  console.log("=================================");

  if (!productToEdit) {
    console.error("❌ Mahsulot topilmadi!");
    return;
  }

  // Tanlangan mahsulotni editProduct ichiga joylaymiz
  setEditProduct(productToEdit);

  // Edit modalni ochamiz
  setShowEditProductModal(true);
};


  const handleCloseModal = () => {
    // Implement the logic to close the modal
    setShowEditProductModal(false);
  };

  return (
    <>
    <div className="row">
      <div className="col-md-12 col-12">
        <div className="card mb-4 table-container">
          <div className="card-body p-md-5 p-0">
            <h3 style={{ fontSize: "1.2rem" }}>Mahsulotlar royxati</h3>
            <div className="table-responsive-sm">
            <table className="table table-borderless table-md  mt-3 fw-bold 
            ">
              <TableHeader
              
              />
              <tbody>
              <TableBody
              setSearchProduct={setSearchProduct}
              searchProduct={searchProduct}
                productArray={productArray}
                openDeleteModal={openDeleteModal}
                loading={loading}
                handleEditProduct={handleEditProduct}
                filteredProduct={filteredProduct}
                handlePrint={handlePrint}
                salesArray={salesArray}
              />
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && (
        <div className="modal_container">
          <ConfirmDelete
            confirmDelete={confirmDelete}
            closeDeleteModal={closeDeleteModal}
          />
        </div>
      )}
        <>
          {showEditProductModal && (
            <EditModal
              handleCloseModal={handleCloseModal}
              editProduct={editProduct}
              setEditProduct={setEditProduct}
              fetchProductData={fetchProductData}
            />
          )}
        </>
      
    </div>
    </>
  );
}
ProductTable.propTypes = {
  productArray: PropTypes.array.isRequired, // Ensure productArray is an array and is required
  deleteItem: PropTypes.func.isRequired,
};
export default ProductTable;
