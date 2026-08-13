

function ConfirmDeleteSales({ handleConfirmDelete, handleCloseDeleteModal }) {
  return (
   <div className="modal_container">
       <div className="row mt-5">
      <div className="col-4 offset-4">
        <div className="bg-white p-4 mt-5">
          <h2 className="fs-5 text-center mb-3">Haqiqatan ham bu sotuvni oʻchirib tashlamoqchimisiz?</h2>
          <div className="d-flex justify-center">
            <button className="btn btn-danger mr-3" onClick={handleConfirmDelete}>
              Ha
            </button>
            <button className="btn btn-primary" onClick={handleCloseDeleteModal}>
              Yoq
            </button>
          </div>
        </div>
      </div>
    </div>
   </div>
  );
}

export default ConfirmDeleteSales;
