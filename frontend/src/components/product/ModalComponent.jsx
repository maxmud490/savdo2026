import PropTypes from "prop-types";
import LoaderButton from "../LoaderButton";

function ModalComponent({
  handleCloseModal,
  handleFormSubmit,
  handleInputChange,
  productData,
  productArray,
  btnLoading,
}) {
  return (
    <>
      <div className="modal_container">
        <form onSubmit={handleFormSubmit}>
          <div className="modal_content p-4">
            <div className="row">
              <div className="col-6">
                <h1>
                  <span style={{ fontSize: "1.2rem" }}>
                    Yangi mahsulot qoshish
                  </span>
                </h1>
              </div>
              <div className="col-6">
                <div className="float-right">
                  <button
                    type="submit"
                    className="btn btn-orange btn-lg mr-5 "
                    style={{ width: "100px" }}
                    disabled={btnLoading}
                  >
                    {btnLoading ? <LoaderButton /> : <span>Saqlash</span>}
                  </button>
                  <span className="close" onClick={handleCloseModal}>
                    &times;
                  </span>
                </div>
              </div>

              <div className="col-8">
                <h6 className="text-orange">Mahsulot nomi</h6>
                <div className="card shadow p-5 mt-1 mb-3">
                  <div className="mb-3">
                    <label className="form-label w-100">
                      Mahsulot nomi <span className="text-orange">*</span>
                      <div className="input-container position-relative">
                        <input
                          name="productName"
                          value={productData.productName}
                          onChange={handleInputChange}
                          type="text"
                          className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                          required
                        />
                        {productArray.some(
                          (product) =>
                            product.productName === productData.productName,
                        ) ? (
                          <div
                            className="
                          message text-center position-absolute top-6 left-60 border border-danger p-2 fw-bold z-50 rounded bg-white
                          "
                          >
                            Bunday maxsulot qo'shilgan
                          </div>
                        ) : null}
                      </div>
                    </label>

                    <div className="mb-3">
                      <label className="form-label w-100">
                        Turkum
                        <select
                          name="turkum"
                          value={productData.turkum}
                          onChange={handleInputChange}
                          className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                        >
                          <option value="">Turkumni tanlang</option>
                          <option value="Qurilish mollari">
                            Qurilish mollari
                          </option>
                          <option value="Elektr jihozlari">
                            Elektr jihozlari
                          </option>
                          <option value="Santexnika">Santexnika</option>
                          <option value="Asbob-uskunalar">
                            Asbob-uskunalar
                          </option>
                          <option value="Bo'yoqlar">Bo'yoqlar</option>
                          <option value="Boshqa">Boshqa</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
                <h6 className="text-orange">Olchov birligi</h6>
                <div className="card shadow p-5 mt-1">
                  <div className=" mb-3">
                    <label className="form-label w-100">
                      Olchov birligi <span className="text-orange">*</span>
                      <input
                        name="olchovBirligi"
                        placeholder=" dona,kg,m"
                        value={productData.olchovBirligi}
                        onChange={handleInputChange}
                        type="text"
                        className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                        required
                      />
                    </label>
                  </div>

                  <div className=" mb-3">
                    <label className="form-label w-100">
                      Oramlar nomi
                      <input
                        name="oramlarNomi"
                        placeholder="quti,paket,o'ram"
                        value={productData.oramlarNomi}
                        onChange={handleInputChange}
                        type="text"
                        className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                      />
                    </label>
                  </div>
                  <div className=" mb-3">
                    <label className="form-label w-100">
                      Oramlar soni
                      <input
                        name="oramlarSoni"
                        value={productData.oramlarSoni}
                        onChange={handleInputChange}
                        className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                        type="text"
                        required
                      />
                    </label>
                  </div>
                  <div className=" mb-3">
                    <label className="form-label w-100">
                      1 o'ramdagi dona soni
                      <input
                        name="donaPerOram"
                        value={productData.donaPerOram || "1"}
                        onChange={handleInputChange}
                        className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                        type="number"
                        min="1"
                        required
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <h6 className="text-orange">Narxi</h6>
                <div className="card shadow p-5 mt-1">
                  <div className=" mb-3">
                    <label className="form-label w-100">
                      Sotish narxi <span className="text-orange">*</span>
                      <input
                        name="sotishNarxi"
                        value={productData.sotishNarxi}
                        onChange={handleInputChange}
                        type="text"
                        className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                        required
                      />
                    </label>
                  </div>

                  <div className=" mb-3">
                    <label className="form-label w-100">
                      Ulgurji narxi
                      <input
                        name="ulgurjiNarxi"
                        value={productData.ulgurjiNarxi}
                        onChange={handleInputChange}
                        type="text"
                        className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                      />
                    </label>
                  </div>
                  <div className=" mb-3">
                    <label className="form-label w-100">
                      Sotib olingan narxi
                      <input
                        name="sotibOlinganNarxi"
                        value={productData.sotibOlinganNarxi}
                        onChange={handleInputChange}
                        type="text"
                        className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
ModalComponent.propTypes = {
  handleCloseModal: PropTypes.func.isRequired,
  handleFormSubmit: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  productData: PropTypes.object.isRequired,
};
export default ModalComponent;
