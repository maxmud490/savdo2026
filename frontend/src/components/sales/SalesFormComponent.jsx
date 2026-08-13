import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";
import EditModal from "../product/EditModal";
import ModalComponent from "../product/ModalComponent";
import AddClientModal from "../clients/AddClientModal";
import Paymet from "./Paymet";
import EditClientModal from "../clients/EditClientModal";

function SalesFormComponent({
  handleCloseModal,
  handleSubmit,
  salesData,
  setSalesData,
  handleChange,
  totalValue,
  salesArray,
  allTotalValue,
  value,
  setValue,
  plasticValue,
  setPlasticValue,
  productArray,
  setSalesArray,
  fetchProductData,
  handleFormSubmit,
  handleInputChange,
  productData,
  btnLoading,
  clientsArray,
  setClientsArray,
  handleSave,
  handleClose,
  saveSales,
  setSaveSales,
  handleCustomer,
  paymet,
  setPaymet,
  formatInputValue,
  totalValues,
  matchedClients,
  clientName,
  clientById,
  inputValues,
  setInputValues,
}) {
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [priceType, setPriceType] = useState("narxi");
  const [saleUnit, setSaleUnit] = useState("dona");
  const [isInputActive, setIsInputActive] = useState(true);
  const [isListVisible, setIsListVisible] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);

  const handleEditClient = () => {
    setShowEditClientModal(true);
  };

  const handleAddClient = () => {
    setShowAddClientModal(true);
  };

  const productModalForm = () => {
    setShowProductModal(true);
  };

  const handlePriceTypeChange = (event) => {
    const nextPriceType = event.target.value;

    setPriceType(nextPriceType);

    const product = productArray.find(
      (item) => item.productName === salesData.productNameValue,
    );

    if (!product) {
      return;
    }

    // Tanlangan narx turi
    const basePrice =
      Number(
        nextPriceType === "ulgurji narxi"
          ? product.ulgurjiNarxi
          : product.sotishNarxi,
      ) || 0;

    // 1 o'ramdagi miqdor
    const perOram = Math.max(1, Number(product.donaPerOram) || 1);

    // Mahsulot o'lchov birligi
    const olchovBirligi = product.olchovBirligi || "dona";

    // O'ram nomi
    const oramlarNomi = product.oramlarNomi || "quti";

    // Hozir tanlangan birlik
    const currentUnit = salesData.saleUnit || saleUnit;

    /*
     * Agar o'ram tanlangan bo'lsa:
     *
     * 1 quti = 10 dona
     * 1 quti narxi = 1 dona narxi × 10
     *
     * 1 qop = 25 kg
     * 1 qop narxi = 1 kg narxi × 25
     *
     * 1 rulon = 100 m
     * 1 rulon narxi = 1 m narxi × 100
     */
    const productPrice =
      currentUnit === oramlarNomi ? basePrice * perOram : basePrice;

    setSalesData((prev) => ({
      ...prev,

      saleUnit: currentUnit,

      productPrice,

      donaPerOram: perOram,

      olchovBirligi,

      oramlarNomi,
    }));
  };

  const handleSaleUnitChange = (event) => {
    const nextUnit = event.target.value;

    setSaleUnit(nextUnit);

    const product = productArray.find(
      (item) => item.productName === salesData.productNameValue,
    );

    if (!product) {
      setSalesData((prev) => ({
        ...prev,
        saleUnit: nextUnit,
      }));
      return;
    }

    const basePrice =
      Number(
        priceType === "ulgurji narxi"
          ? product.ulgurjiNarxi
          : product.sotishNarxi,
      ) || 0;

    const perOram = Math.max(1, Number(product.donaPerOram) || 1);

    const olchovBirligi = product.olchovBirligi || "dona";

    const oramUnit = product.oramlarNomi || "quti";

    const productPrice =
      nextUnit === oramUnit ? basePrice * perOram : basePrice;

    setSalesData((prev) => ({
      ...prev,
      saleUnit: nextUnit,
      productPrice,
      donaPerOram: perOram,
      olchovBirligi,
      oramlarNomi: oramUnit,
    }));
  };

  const selectedProduct = productArray.find(
    (item) => item.productName === salesData.productNameValue,
  );

  const selectedUnit = selectedProduct?.olchovBirligi || "dona";
  const selectedOramName = selectedProduct?.oramlarNomi || "quti";

  const handleOptionClick = (selectedProductName) => {
    const product = productArray.find(
      (item) => item.productName === selectedProductName,
    );

    if (!product) return;

    // Mahsulot o'lchov birligi
    const olchovBirligi = product.olchovBirligi || "dona";

    // O'ram nomi
    const oramlarNomi = product.oramlarNomi || "quti";

    // 1 o'ramdagi miqdor
    const donaPerOram = Math.max(1, Number(product.donaPerOram) || 1);

    // Narx turi
    const basePrice =
      Number(
        priceType === "ulgurji narxi"
          ? product.ulgurjiNarxi
          : product.sotishNarxi,
      ) || 0;

    /*
     * Mahsulot tanlanganda boshlang'ich birlik
     * mahsulotning o'lchov birligi bo'ladi.
     *
     * Masalan:
     * kg  -> kg
     * m   -> m
     * dona -> dona
     */
    const initialSaleUnit = olchovBirligi;

    /*
     * Agar mahsulotning narxi 1 kg / 1 m / 1 dona
     * uchun berilgan bo'lsa, shu narx ishlatiladi.
     */
    const productPrice = basePrice;

    setSaleUnit(initialSaleUnit);

    setSalesData((prev) => ({
      ...prev,

      productNameValue: selectedProductName,

      saleUnit: initialSaleUnit,

      productPrice,

      donaPerOram,

      olchovBirligi,

      oramlarNomi,
    }));

    setIsInputActive(false);
  };

  const handleOptionSalesClick = (selectedClientName) => {
    console.log(`Selected client: ${selectedClientName}`);

    setSalesData((prevSalesData) => ({
      ...prevSalesData,
      clientName: selectedClientName,
    }));
    setIsListVisible(false);
  };

  const buttonDisabled =
    (value.trim() !== "" && plasticValue.trim() !== "") ||
    (value.trim() === "" && plasticValue.trim() === "") ||
    salesArray.length === 0;

  useEffect(() => {
    try {
      setSuggestedProducts([]);
      const filteredProducts = productArray.filter(
        (product) =>
          product.productName.toLowerCase().includes(value.toLowerCase()) &&
          !salesArray.some(
            (salesItem) => salesItem.productNameValue === product.productName,
          ),
      );

      // Set the filtered products as suggestions
      setSuggestedProducts(filteredProducts);
    } catch (error) {
      console.error("Error in useEffect:", error);
      // Handle the error appropriately, e.g., show an error message to the user
    }
  }, [value, productArray, salesArray]);

  function formatLargeNumber(number) {
    if (typeof number !== "undefined" && number !== null) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    return "";
  }

  const handleBlur = () => {
    const productName = salesData.productNameValue.trim();
    const product = productArray.find((p) => p.productName === productName);

    if (!product) return;

    const basePrice =
      Number(
        priceType === "ulgurji narxi"
          ? product.ulgurjiNarxi
          : product.sotishNarxi,
      ) || 0;
    const donaPerOram = Math.max(1, Number(product.donaPerOram) || 1);

    setSalesData((prevData) => ({
      ...prevData,
      saleUnit,
      productPrice: saleUnit === "quti" ? basePrice * donaPerOram : basePrice,
    }));
  };

  useEffect(() => {
    handleBlur();
  }, [salesData.productNameValue, saleUnit, priceType, productArray]);

  const handleRemove = (itemId) => {
    const updatedSalesArray = salesArray.filter((item) => item.id !== itemId);

    setSalesArray(updatedSalesArray);
  };
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleEditProduct = (id) => {
    const productToEdit = productArray.find((product) => product.id === id);
    setEditProduct(productToEdit);
    setShowEditProductModal(true);
  };

  console.log("salesArray", salesArray);
  console.log("productArray", productArray);
  return (
    <>
      {paymet && (
        <Paymet
          formatInputValue={formatInputValue}
          setValue={setValue}
          setPlasticValue={setPlasticValue}
          buttonDisabled={buttonDisabled}
          value={value}
          plasticValue={plasticValue}
          capitalizeFirstLetter={capitalizeFirstLetter}
          matchedClients={matchedClients}
          totalValues={totalValue}
          setPaymet={setPaymet}
          formatLargeNumber={formatLargeNumber}
          clientById={clientById}
          saveSales={saveSales}
          setSaveSales={setSaveSales}
          salesArray={salesArray}
          inputValues={inputValues}
          setInputValues={setInputValues}
          handleClose={handleClose}
        />
      )}
      {showAddClientModal && (
        <AddClientModal
          clientsArray={clientsArray}
          setClientsArray={setClientsArray}
        />
      )}
      {showEditClientModal && (
        <EditClientModal
          handleCloseModal={handleCloseModal}
          handleSubmit={handleSubmit}
          btnLoading={btnLoading}
        />
      )}
      {showProductModal && (
        <ModalComponent
          handleCloseModal={handleCloseModal}
          handleFormSubmit={handleFormSubmit}
          handleInputChange={handleInputChange}
          productData={productData}
          productArray={productArray}
          btnLoading={btnLoading}
        />
      )}
      {showEditProductModal && (
        <EditModal
          handleCloseModal={handleCloseModal}
          editProduct={editProduct}
          setEditProduct={setEditProduct}
          fetchProductData={fetchProductData}
        />
      )}
      <div className="modal_content pb-5">
        <div className="row mt-3">
          <div className="col-md-6  col-12 ">
            <h5 className="d-block fs-5">Yangi sotuv</h5>
            {/* <div>
              {matchedClients.length > 0 && (
              <h1 className="fs-5">
                {capitalizeFirstLetter(clientName)}{" "}
                <span>
                  Qarz: {formatLargeNumber(totalValues.debtValue)} so'm
                </span>
                <strong className="ml-5 fs-6">Mijozning bonuslari: <span className="text-warning">0</span></strong>
              </h1>
            )}</div> */}
          </div>
          <div className="col-md-6 d-flex justify-end items-center pb-4">
            <div>
              <button className="btn btn-sm btn-orange mx-3  dNone">
                Основной склад
              </button>
              <span
                className="text-white px-3 py-1 h-5 rounded-full dNone mt-4 mr-5"
                style={{ backgroundColor: "#b69329" }}
              >
                Tasdiqlanmagan
              </span>
            </div>
            <span onClick={handleClose} className="close mt-0">
              &times;
            </span>
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <button onClick={handleSave} className="btn btn-sm btn-red mr-3 ">
              <FontAwesomeIcon icon={faFloppyDisk} className="mr-1" />
              Saqlash
            </button>
            <button className="btn btn-sm btn-red">
              <FontAwesomeIcon icon={faFloppyDisk} className="mr-1" />
              Saqlash va chekga chiqazish
            </button>
          </div>

          <div className="col-md-6 col-12 text-right">
            <button
              onClick={handleCustomer}
              className="btn btn-red btn-sm rounded-full"
            >
              <FontAwesomeIcon icon={faCreditCard} className="mr-1" />
              Mijoz to'lovi
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row mt-2">
            <div className="col-md-6 col-12">
              <div className="card shadow p-5 mt-1 mb-3">
                <div className="input-group mb-3">
                  <input
                    name="dataValue"
                    value={salesData.dataValue}
                    onChange={handleChange}
                    type="date"
                    className="form-control-sm form-control bg-opacity-0 shadow-none py-2"
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text">Mijoz</span>
                  <div style={{ position: "relative", width: "79%" }}>
                    <input
                      name="clientName"
                      value={salesData.clientName}
                      onChange={handleChange}
                      placeholder="Mijozni ismini kiriting"
                      type="search"
                      autoComplete="off"
                      className="form-control-sm form-control bg-opacity-0 shadow-none product-input py-2"
                      onFocus={() => setIsListVisible(true)}
                      required
                      style={{
                        borderBottom:
                          salesData.productNameValue.length !== 0 &&
                          isListVisible &&
                          "0",
                        transition: "border-bottom 0.3s",
                      }}
                    />
                    {salesData.clientName && isListVisible && (
                      <ul
                        style={{
                          width: "100%",
                          position: "absolute",
                          top: "80%",
                          zIndex: "100",
                          border: "1px solid #f7b37c",
                          borderTop: "none",
                          backgroundColor: "#ffffff",
                          color: "black",
                          listStyle: "none",
                          padding: 0,
                        }}
                      >
                        {clientsArray
                          .filter((salesList) =>
                            salesList.client
                              .toLowerCase()
                              .includes(salesData.clientName.toLowerCase()),
                          )
                          .map((sales, index) => (
                            <li
                              key={index}
                              className={`option p-2 d-flex justify-between ${
                                sales.client === salesData.clientName &&
                                !isListVisible
                                  ? "active-product"
                                  : ""
                              }`}
                              onClick={() =>
                                handleOptionSalesClick(sales.client)
                              }
                            >
                              {sales.client}
                            </li>
                          ))}
                        {clientsArray.filter((salesList) =>
                          salesList.client
                            .toLowerCase()
                            .includes(salesData.clientName.toLowerCase()),
                        ).length === 0 && (
                          <li
                            className="not-found-message"
                            style={{ textAlign: "center", padding: "0.5rem" }}
                          >
                            Mijoz topilmadi.
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                  {salesData.clientName ? (
                    <span
                      onClick={handleEditClient}
                      style={{ color: "#909090" }}
                      className="input-group-text cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faPencil} />
                    </span>
                  ) : (
                    <span
                      className="input-group-text cursor-pointer"
                      style={{ color: "#909090" }}
                      onClick={handleAddClient}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <select
                    className={`py-2 text-white text-center bg-orange w-16 ${
                      priceType === "ulgurji narxi" && "w-24"
                    }`}
                    style={{
                      borderTopLeftRadius: "20px",
                      borderBottomLeftRadius: "20px",
                    }}
                    onChange={handlePriceTypeChange}
                    value={priceType}
                  >
                    <option className="bg-white text-dark" value="narxi">
                      Narxi
                    </option>
                    <option
                      className="bg-white text-dark"
                      value="ulgurji narxi"
                    >
                      Ulgurji narxi
                    </option>
                  </select>
                  <input
                    name="productPrice"
                    value={salesData.productPrice || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    type="text"
                    className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="card shadow p-5 mt-1 mb-3">
                <div className="input-group mb-3">
                  <input
                    name="workman"
                    value={salesData.workman}
                    onChange={handleChange}
                    type="text"
                    placeholder="Mas'ul xodimni tanlang"
                    className="form-control c-pointer form-control-sm shadow-none py-2"
                  />
                </div>

                <div className="input-group mb-3">
                  <span className="input-group-text">Mahsulot</span>
                  <div style={{ position: "relative", width: "73%" }}>
                    <input
                      name="productNameValue"
                      value={salesData.productNameValue}
                      onChange={handleChange}
                      onFocus={() => setIsInputActive(true)}
                      placeholder="Mahsulot nomini kiriting"
                      type="search"
                      autoComplete="off"
                      className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                      style={{
                        borderBottom:
                          salesData.productNameValue.length !== 0 &&
                          isInputActive &&
                          "0",
                        transition: "border-bottom 0.3s",
                      }}
                      required
                    />
                    {salesData.productNameValue && isInputActive && (
                      <ul
                        style={{
                          width: "100%",
                          position: "absolute",
                          top: "80%",
                          zIndex: "1",
                          border: "1px solid #f7b37c",
                          borderTop: "none",
                          backgroundColor: "#ffffff",
                          color: "black",
                          listStyle: "none",
                          padding: 0,
                        }}
                      >
                        {productArray
                          .filter((product) =>
                            product.productName
                              .toLowerCase()
                              .includes(
                                salesData.productNameValue.toLowerCase(),
                              ),
                          )
                          .map((product, index) => (
                            <li
                              key={index}
                              className={`option p-2 d-flex justify-between ${
                                product.productName ===
                                  salesData.productNameValue && !isInputActive
                                  ? "active-product"
                                  : ""
                              }`}
                              onClick={() =>
                                handleOptionClick(product.productName)
                              }
                            >
                              {product.productName}
                              <div className="bg-danger">
                                <span className="text-white p-3">
                                  {(() => {
                                    const stockDona =
                                      product.qoldiqDona !== undefined &&
                                      product.qoldiqDona !== null
                                        ? Number(product.qoldiqDona)
                                        : (Number(product.qoldiq) ||
                                            Number(product.oramlarSoni) ||
                                            0) *
                                          Math.max(
                                            1,
                                            Number(product.donaPerOram) || 1,
                                          );
                                    const perOram = Math.max(
                                      1,
                                      Number(product.donaPerOram) || 1,
                                    );
                                    return `${stockDona} dona ${""}`;
                                  })()}
                                  <FontAwesomeIcon icon={faArrowRight} />{" "}
                                  {Math.floor(
                                    (product.qoldiqDona !== undefined &&
                                    product.qoldiqDona !== null
                                      ? Number(product.qoldiqDona)
                                      : (Number(product.qoldiq) ||
                                          Number(product.oramlarSoni) ||
                                          0) *
                                        Math.max(
                                          1,
                                          Number(product.donaPerOram) || 1,
                                        )) /
                                      Math.max(
                                        1,
                                        Number(product.donaPerOram) || 1,
                                      ),
                                  )}{" "}
                                  quti
                                </span>
                              </div>
                            </li>
                          ))}
                        {productArray.filter((product) =>
                          product.productName
                            .toLowerCase()
                            .includes(salesData.productNameValue.toLowerCase()),
                        ).length === 0 && (
                          <li
                            className="not-found-message"
                            style={{ textAlign: "center", padding: "0.5rem" }}
                          >
                            Topilmadi
                          </li>
                        )}
                      </ul>
                    )}
                  </div>
                  {salesData.productNameValue ? (
                    <span
                      className="input-group-text cursor-pointer"
                      style={{ color: "#909090" }}
                      onClick={() => {
                        const productToEdit = productArray.find(
                          (product) =>
                            product.productName === salesData.productNameValue,
                        );

                        if (productToEdit) {
                          handleEditProduct(productToEdit.id);
                        }
                      }}
                    >
                      <FontAwesomeIcon icon={faPencil} />
                    </span>
                  ) : (
                    <span
                      className="input-group-text cursor-pointer"
                      style={{ color: "#909090" }}
                      onClick={productModalForm}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <span className="input-group-text">Soni</span>

                  <input
                    name="productNumber"
                    value={salesData.productNumber}
                    onChange={handleChange}
                    onBlur={() => setIsInputActive(false)}
                    type="text"
                    autoComplete="off"
                    className="form-control-sm form-control shadow-none product-input py-2"
                    required
                  />

                  <select
                    className={`py-2 px-2 text-white text-center ${
                      saleUnit === "quti" ? "darkOrange" : "bg-orange"
                    }`}
                    style={{
                      borderTopRightRadius: "20px",
                      borderBottomRightRadius: "20px",
                    }}
                    onChange={handleSaleUnitChange}
                    value={saleUnit}
                  >
                    <option className="bg-white text-dark" value="dona">
                      {selectedUnit}
                    </option>

                    <option className="bg-white text-dark" value="quti">
                      {selectedOramName}
                    </option>
                  </select>

                  <br />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="d-flex justify-between">
              <div>
                <button
                  className="btn w-xs-100 my-2 btn-orange btn-sm px-3"
                  type="submit"
                >
                  Qoshish
                </button>
              </div>
              <div>
                <h3 className="fs-3">
                  Jami:
                  {formatLargeNumber(totalValue)}
                </h3>
              </div>
            </div>
          </div>
        </form>
        <div className="row mt-2">
          <div className="col-12">
            <div>
              <h3 className="fs-4">Ro‘yxat</h3>
            </div>
            <div>
              <table className="table table-hover mt-3">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Mahsulot nomi</th>
                    <th scope="col">Soni</th>
                    <th scope="col">O'ramlar soni</th>
                    <th scope="col">Sotish narxi</th>
                    <th scope="col">Jami</th>
                    <th scope="col">O'chirish</th>
                  </tr>
                </thead>
                <tbody>
                  {salesArray.map((salesItem, index) => {
                    const correspondingProduct = productArray.find(
                      (product) =>
                        product.productName === salesItem.productNameValue,
                    );

                    return (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{salesItem.productNameValue}</td>
                        <td>
                          {(() => {
                            const unit =
                              correspondingProduct?.olchovBirligi || "dona";
                            const quantity =
                              Number(salesItem.productNumber) || 0;
                            const perOram = Math.max(
                              1,
                              Number(salesItem.donaPerOram) || 1,
                            );

                            const totalQuantity =
                              salesItem.saleUnit === "quti"
                                ? quantity * perOram
                                : quantity;

                            return `${totalQuantity} ${unit}`;
                          })()}
                        </td>

                        <td>
                          {(() => {
                            const oramName =
                              correspondingProduct?.oramlarNomi || "quti";

                            const quantity =
                              salesItem.saleUnit === "quti"
                                ? Number(salesItem.productNumber) || 0
                                : 0;

                            return `${quantity} ${oramName}`;
                          })()}
                        </td>

                        <td>{formatLargeNumber(salesItem.productPrice)}</td>
                        <td>
                          {formatLargeNumber(
                            Number(salesItem.totalValue) ||
                              (Number(salesItem.productNumber) || 0) *
                                (Number(salesItem.productPrice) || 0),
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleRemove(salesItem.id)}
                            className="c-pointer btn btn-danger btn-sm"
                          >
                            O'chirish
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <h3 className="text-end fs-4">
            Umumiy qiymati:{formatLargeNumber(allTotalValue)}
          </h3>
        </div>
      </div>
    </>
  );
}

export default SalesFormComponent;
