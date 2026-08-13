

function SupplierEditForm({handleEditSubmit, editingSupplier, setEditingSupplier }) {
  return (
    <div className="modal_container">
    <div className="row ">
      <div className="col-4 offset-4">
        <div className="bg-white p-4 mt-4">
          <div className="d-flex align-center justify-between pb-3">
            <h1 className="fs-5">
              Yangi yetkazib beruvchini tahrirlash
            </h1>
            <span
              onClick={() => setEditingSupplier(null)}
              className="cursor-pointer fs-4"
            >
              x
            </span>
          </div>
          <hr />
          <form onSubmit={handleEditSubmit}>
            <div className="mt-3 mb-3">
              <label className="w-100">
                Yetkazib beruvchi *
                <input
                  type="text"
                  className="form-control"
                  name="supplierName"
                  required
                  defaultValue={editingSupplier.name}
                />
              </label>
            </div>
            <div className="mb-3">
              <label className="w-100">
                Yetkazib beruvchiga qarz
                <input
                  type="number"
                  className="form-control"
                  name="debt"
                  required
                  defaultValue={editingSupplier.debt}
                />
              </label>
            </div>
            <div className="mb-3">
              <label className="w-100">
                Ma'lumot
                <textarea
                  type="text"
                  className="form-control"
                  name="information"
                  defaultValue={editingSupplier.information}
                />
              </label>
            </div>
            <div className="mb-3">
              <label className="w-100">
                Telefon raqami
                <input
                  type="tel"
                  className="form-control"
                  name="phoneNumber"
                  defaultValue={editingSupplier.phoneNumber}
                />
              </label>
            </div>
            <div>
              <button
                className=" btn btn-orange"
                type="submit"
              >
                Tahrirlash
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  )
}

export default SupplierEditForm