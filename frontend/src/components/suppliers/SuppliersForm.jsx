

function SuppliersForm({handleSubmit, setShowModalForm}) {
  return (
    <div className="modal_container">
    <div className="row ">
      <div className="col-4 offset-4">
        <div className="bg-white p-4 mt-4">
          <div className="d-flex align-center justify-between pb-3">
            <h1 className="fs-5">Yangi yetkazib beruvchi qo'shish</h1>
            <span
              onClick={() => setShowModalForm(false)}
              className="cursor-pointer fs-4"
            >
              x
            </span>
          </div>
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="mt-3 mb-3">
              <label className="w-100">
                Yetkazib beruvchi *
                <input
                  type="text"
                  className="form-control"
                  name="supplierName"
                  required
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
                />
              </label>
            </div>
            <div>
              <button className=" btn btn-red" type="submit">
                Qo'shish
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  )
}

export default SuppliersForm