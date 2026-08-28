import { useState, useEffect, useRef } from "react";
import SuppliersHeader from "./SuppliersHeader";
import axios from "axios";
import Loader from "../Loader";
import { formatLargeNumber } from "../formatNumber";
import SuppliersForm from "./SuppliersForm";
import SupplierEditForm from "./SupplierEditForm";
import { useReactToPrint } from 'react-to-print';
 import PrintableSuppliersList from "./PrintableSuppliersList ";


function SuppliersList({suppliers, setSuppliers, handleSuppliersSubmit,loadingSupplier,showModalForm, setShowModalForm, fetchSuppliers}) {
  
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

 

  useEffect(() => {
    const filtered = suppliers.filter(
      (supplier) =>
        supplier.name &&
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  }, [searchTerm, suppliers]);

  const showModal = () => {
    setShowModalForm(true);
  };

  const handleEdit = (editedSupplier) => {
    const updatedSuppliers = suppliers.map((supplier) =>
      supplier.id === editedSupplier.id ? editedSupplier : supplier
    );

    setSuppliers(updatedSuppliers);
    setEditingSupplier(null); // Reset editing state
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const editedSupplierData = {
      id: editingSupplier.id,
      name: e.target.elements.supplierName.value,
      debt: e.target.elements.debt.value,
      information: e.target.elements.information.value,
      phoneNumber: e.target.elements.phoneNumber.value,
    };

    try {
      const response = await axios.put(
        `http://https://savdo2026.onrender.com/api/suppliers/${editingSupplier.id}`,
        editedSupplierData
      );

      handleEdit(response.data); // Update the local state with the edited supplier
      setEditingSupplier(null); // Reset editing state
      fetchSuppliers();
    } catch (error) {
      console.error("Error while making PUT request:", error);
    }
  };

  const openDeleteConfirmation = (id) => {
    setDeleteCandidate(id);
    setShowDeleteModal(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteCandidate(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async (id) => {
    closeDeleteConfirmation(); 
    try {
      const response = await axios.delete(`http://https://savdo2026.onrender.com/api/suppliers/${id}`);
      
      if (response.data.success) {
        // Filter out the deleted supplier from the local state
        setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier.id !== id));
      } else {
        console.error('Error deleting supplier:', response.data.error);
      }
    } catch (error) {
      console.error('Error while making DELETE request:', error);
    }
  };

  return (
    <>
      {showModalForm && (
       <SuppliersForm handleSubmit={handleSuppliersSubmit} setShowModalForm={setShowModalForm} />
      )}
       {showDeleteModal && (
        <div className="modal_container">
        <div className="row mt-5">
        <div className="col-4 offset-4">
        <div className="bg-white p-4 mt-5">
        <h2 className="fs-5 text-center mb-3">Haqiqatan ham bu Etkazib beruvchini oʻchirib tashlamoqchimisiz?</h2>
      <div className="d-flex justify-center">
      <button className="btn btn-danger mr-3" onClick={() => handleDelete(deleteCandidate)}>Ha</button>
      <button className="btn btn-primary" onClick={closeDeleteConfirmation}>Yoq</button>
      </div>
        </div>
      </div>
    </div>
    </div>
      )}
      {handlePrint && (
          <div className="card mt-4 p-5 d-none">
            <div className="row mb-3">
            <PrintableSuppliersList suppliers={suppliers} formatLargeNumber={formatLargeNumber}  ref={componentRef} />
            </div>
          </div>
        )}
     
      <div className="main-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <SuppliersHeader
                handlePrint={handlePrint}
                title="Yetkazib beruvchilar ro'yxati"
                filterButtonLabel="Filtr"
                loadExcelButtonLabel="Excel-da yuklab olish"
                addProduct="Yetkazib beruvchilarni qo'shish"
                showModal={showModal}
                onSearchTermChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12">
          {editingSupplier && (
                    <SupplierEditForm handleEditSubmit={handleEditSubmit} editingSupplier={editingSupplier} setEditingSupplier={setEditingSupplier}/>
                  )}
            <div className="card mb-4 table-container">
              <div className="card-body p-5">
              <div className="table-responsive-sm">
                <table className="table table-bordered mt-3 table-hover">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Yetkazib beruvchi</th>
                      <th>Yetkazib beruvchiga qarz</th>
                      <th>Malumot</th>
                      <th>Tel nomeri</th>
                      <th>Tahrirlash</th>
                      <th>O'chirish</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingSupplier ? (
                      <tr>
                        <td>
                          <Loader />
                        </td>
                      </tr>
                    ) : (
                      filteredSuppliers.map((supplier, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{supplier.name.toUpperCase()}</td>
                          <td> - {formatLargeNumber(supplier.debt)} so'm</td>
                          <td>{supplier.information}</td>
                          <td>{supplier.phoneNumber}</td>
                          <td>
                            <button
                              className="button-26 btn-orange"
                              onClick={() => setEditingSupplier(supplier)}
                            >
                              Tahrirlash
                            </button>
                          </td>
                          <td>
                            <button
                              className="button-26 btn-red"
                              onClick={() => openDeleteConfirmation(supplier.id)}
                            >
                              O'chirish
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SuppliersList;


