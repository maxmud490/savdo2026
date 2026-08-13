import PropTypes from 'prop-types';
import ButtonOrange from '../ButtonOrange';



function ProductHeader({
  OpenModal,
  title,
  filterButtonLabel,
  loadExcelButtonLabel,
  addProduct,
  itemTable,
  setSearchProduct,
  searchProduct,
  handlePrint

}) {
  
  return (
    <div className="row">
      <div className="col-md-2 col-12">
        <div className="d-md-flex align-items-center">
          <h3 className='productList' style={{ fontSize: "1.2rem" }}>{title}</h3>
        </div>
      </div>
      <div className="col-md-10 col-12">
        <div className="text-right btnContainer">
          <button 
          className='btn btn-orange btn-sm smallBtn'
          onClick={OpenModal}
          >
            {addProduct}
          </button>
          <button className='btn btn-red btn-sm smallBtn'
           onClick={handlePrint}
          >
            
          {loadExcelButtonLabel}
          </button>
        </div>
      </div>
      <div className="col-12 col-md-12">
        <div className="row">
          <div className="col-md-6 col-12">
            <div className="d-md-flex mr-auto mt-5 d-block">
              <div className=" mr-2 d-block my-2  w-sm-100 btn-group">
                <button className='btn btn-orange btn-sm productBtn'>
                {itemTable}
                </button>
              </div>
              <div className="search-sm mr-1 my-2">
                <input
                  type="search"
                  className="form-control form-control-sm rounded-pill"
                  placeholder=" Qidiruv..."
                  value={searchProduct}
                  onChange={event => setSearchProduct(event.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12">
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
                <ButtonOrange>
                {filterButtonLabel}
                </ButtonOrange>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
ProductHeader.propTypes = {
  OpenModal: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  filterButtonLabel: PropTypes.string.isRequired,
  loadExcelButtonLabel: PropTypes.string.isRequired,
  addProduct: PropTypes.string.isRequired,
  itemTable: PropTypes.string.isRequired,
};

export default ProductHeader;
