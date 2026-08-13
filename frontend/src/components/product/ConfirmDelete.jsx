

function ConfrirmDelete({confirmDelete, closeDeleteModal }) {
  return (
    <div className="row mt-5">
              <div className="col-4 offset-4">
              <div className="bg-white p-4 mt-5">
              <h2 className="fs-5 text-center mb-3">Haqiqatan ham bu mahsulotni oʻchirib tashlamoqchimisiz?</h2>
            <div className="d-flex justify-center">
            <button className="btn btn-danger mr-3" onClick={confirmDelete}>Ha</button>
            <button className="btn btn-primary" onClick={closeDeleteModal}>Yoq</button>
            </div>
              </div>
            </div>
          </div>
  )
}

export default ConfrirmDelete