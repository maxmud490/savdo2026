
function SuppliersHeader({title, addProduct,loadExcelButtonLabel, filterButtonLabel, showModal, onSearchTermChange,handlePrint}) {
  return (
    <div className="row">
    <div className="col-md-2 col-12">
      <div className="d-flex align-items-center">
        <h3 style={{ fontSize: "1.2rem" }}>{title}</h3>
      </div>
    </div>
    <div className="col-md-10 col-12">
      <div className="text-md-right text-center text-sm-center">
        <button className="btn btn-orange btn-sm" onClick={showModal}>{addProduct}</button>
        <button className="btn btn-red btn-sm" onClick={handlePrint}>{loadExcelButtonLabel}</button>
      </div>
    </div>
    <div className="col col-12">
      <div className="row">
        <div className="col-6">
          <div className="d-flex mr-auto mt-5">
            <div className=" mr-2 d-block my-2  w-sm-100 btn-group">
              <button className="btn btn-orange btn-sm dNone">Yetkazib beruvchi</button>
            </div>
            <div className="search-sm mr-1 my-2">
              <input
                type="search"
                className="form-control form-control-dark rounded-pill"
                placeholder=" Qidiruv..."
                onChange={onSearchTermChange}
              />
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="d-flex align-items-center justify-end  mt-5">
            <div className="my-2 mr-1">
              <label className="pr-2 dNone">Korsatish:</label>
              <div className="d-inline-block btn-group">
                <button className="btn btn-outline-warning rounded-50 btn-xs dNone">
                  10
                </button>
              </div>
            </div>
            <div>
              <button className="btn btn-orange btn sm dNone">{filterButtonLabel}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default SuppliersHeader