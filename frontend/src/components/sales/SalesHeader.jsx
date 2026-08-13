import ButtonOrange from "../ButtonOrange";

function SalesHeader({
  OpenModal,
  title,
  filterButtonLabel,
  loadExcelButtonLabel,
  addProduct,
  itemTable,
  filteredSalesArray,
  setFilteredSalesArray,
  handlePrint
}) {
  return (
    <div className="row">
      <div className="col-md-2 col-12">
        <div className="d-md-flex align-items-center">
          <h3 className="productList" style={{ fontSize: "1.2rem" }}>{title}</h3>
        </div>
      </div>
      <div className="col-md-10 col-12">
        <div className="text-right btnContainer">
          <ButtonOrange onClick={OpenModal}>{addProduct}</ButtonOrange>
          <button className="btn btn-red btn-sm" onClick={handlePrint}>{loadExcelButtonLabel}</button>
        </div>
      </div>
      <div className="col col-12">
        <div className="row">
          <div className="col-md-6 col-12">
            <div className="d-md-flex mr-auto mt-5">
              <div className=" mr-2 d-md-block my-2 d-none  w-sm-100 btn-group">
                <ButtonOrange>{itemTable}</ButtonOrange>
              </div>
              <div className="search-sm mr-1 my-2">
                <input
                  type="search"
                  className="form-control form-control-dark rounded-pill"
                  placeholder=" Qidiruv..."
                  value={filteredSalesArray}
                  onChange= {event => setFilteredSalesArray(event.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-md-flex align-items-center justify-end d-none mt-5">
              <div className="my-2 mr-1">
                <label className="pr-2">Korsatish:</label>
                <div className="d-inline-block btn-group">
                  <button className="btn btn-outline-warning rounded-50 btn-xs">
                    10
                  </button>
                </div>
              </div>
              <div>
                <ButtonOrange>{filterButtonLabel}</ButtonOrange>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesHeader;
