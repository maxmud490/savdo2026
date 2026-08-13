/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import SalesFormComponent from "./SalesFormComponent";
import Loader from "../Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import ConfirmDeleteSales from "./ConfirmDeleteSales";
import SalesHeader from "./SalesHeader";
import SalesInfoTable from "./SalesInfoTable";
import PrintableClientList from "./PrintableClientList";
import { useReactToPrint } from "react-to-print";
import Paymet from "./Paymet";
import SalesPaymet from "./SalesPaymet";

function SalesList({
  handleSalesModal,
  clientData,
  salesOpenModal,
  handleCloseModal,
  handleClickClient,
  handleSubmit,
  salesData,
  setButtonDisabled,
  handleChange,
  totalValue,
  salesArray,
  allTotalValue,
  showClientModal,
  setShowClientModal,
  setSalesData,
  setSalesArray,
  value,
  setValue,
  plasticValue,
  setPlasticValue,
  handleDelete,
  productArray,
  loading,
  buttonDisabled,
  fetchProductData,
  handleFormSubmit,
  handleInputChange,
  productData,
  btnLoading,
  clientsArray,
  setClientsArray,
  saveSales,
  setSaveSales,
  inputValues,
  setInputValues,
  handleSave,
  handleClose,
  handleGet,
}) {
  const [isOpenMap, setIsOpenMap] = useState({});
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [filteredSalesArray, setFilteredSalesArray] = useState("");
  const [showProductId, setShowProductId] = useState(null);
  const [isOpenShowProduct, setIsOpenShowProduct] = useState(false);
  const [paymet, setPaymet] = useState(false);
  const [salesPaymet, setSalesPaymet] = useState(false);
  const [clientById, setClientById] = useState(null);
  
  // ✅ YANGI STATE - TOTAL VALUES
  const [totalValues, setTotalValues] = useState({
    productPrice: 0,
    selectedValue: 0,
  });

  const componentRef = useRef(null);

const handlePrint = useReactToPrint({
  contentRef: componentRef,
  documentTitle: "Sotuvlar royxati",
});

  const handleCustomer = () => {
    setPaymet(true);
  };

  const handleUpdateSales = (id) => {
    const selectedClient = saveSales.find((item) => item.id === id);
    setClientById(selectedClient);
    setSalesPaymet(true);
  };

  const filteredArray =
    saveSales?.filter((sales) => {
      const clientName = sales?.clientName
        ? sales.clientName.toUpperCase()
        : "";
      const filterValue = filteredSalesArray
        ? filteredSalesArray.toUpperCase()
        : "";

      return clientName.includes(filterValue);
    }) || [];

    

  // ✅ YANGI useEffect - TOTAL VALUES NI HISOBLASH
 useEffect(() => {
  const dataToCalculate =
    filteredSalesArray
      ? saveSales.filter((sales) => {
          const clientName = sales?.clientName
            ? sales.clientName.toUpperCase()
            : "";

          const filterValue = filteredSalesArray.toUpperCase();

          return clientName.includes(filterValue);
        })
      : saveSales;

  const result = dataToCalculate.reduce(
    (total, client) => {
      const productPrice =
        parseFloat(client?.productPrice) || 0;

      const selectedValue =
        parseFloat(client?.selectedValue) || 0;

      return {
        productPrice:
          total.productPrice + productPrice,

        selectedValue:
          total.selectedValue + selectedValue,
      };
    },
    {
      productPrice: 0,
      selectedValue: 0,
    }
  );

  setTotalValues(result);
}, [saveSales, filteredSalesArray]);
  function formatLargeNumber(number) {
    if (typeof number !== "undefined" && number !== null) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    return "";
  }

  const toggleDropdown = (id) => {
    setIsOpenMap((prevIsOpenMap) => ({
      ...prevIsOpenMap,
      [id]: !prevIsOpenMap[id],
    }));
  };

  const handleActionClick = (productId, action) => {
    if (action === "show") {
      setShowProductId(productId);
      setIsOpenShowProduct(true);
    } else if (action === "delete") {
      setIsOpenDeleteModal(true);
      setItemToDelete(productId);
    }
    setIsOpenMap((prevIsOpenMap) => ({
      ...prevIsOpenMap,
      [productId]: false,
    }));
  };

  const handleConfirmDelete = () => {
    handleDelete(itemToDelete);
    setIsOpenDeleteModal(false);
    setItemToDelete(null);
  };

  const capitalizeFirstLetter = (str) => {
    if (str && typeof str === "string" && str.length > 0) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
    return str;
  };

  const formatInputValue = (inputValue) => {
    const formattedValue = inputValue.replace(/[^\d]/g, "");
    return formattedValue;
  };

  const matchedClients = saveSales.filter(
    (item) => item.clientName === salesData.clientName
  );

  const newArray = filteredArray.map((item) => {
    if (item.savedData) {
      return item.savedData;
    }
    return item;
  });

  console.log(newArray);

  return (
    <>
    <PrintableClientList
  ref={componentRef}
  clientData={newArray}
  formatLargeNumber={formatLargeNumber}
  clientValues={totalValues.selectedValue}
  plasticValues={0}
/>
      {salesPaymet && (
        <SalesPaymet
          capitalizeFirstLetter={capitalizeFirstLetter}
          formatLargeNumber={formatLargeNumber}
          clientById={clientById}
          saveSales={saveSales}
          setSaveSales={setSaveSales}
          setSalesPaymet={setSalesPaymet}
          handleGet={handleGet}
        />
      )}

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
          saveSales={saveSales}
          setSaveSales={setSaveSales}
          setInputValues={setInputValues}
          handleClose={handleClose}
        />
      )}

      {isOpenShowProduct ? (
        <SalesInfoTable
          showProductId={showProductId}
          isOpenShowProduct={isOpenShowProduct}
          clientData={clientData}
          saveSales={saveSales}
          setIsOpenShowProduct={setIsOpenShowProduct}
        />
      ) : (
        <div className="main-content">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <SalesHeader
                  title="Sotuvlar ro'yxati"
                  filterButtonLabel="Filtr"
                  loadExcelButtonLabel="PDF"
                  handlePrint={handlePrint}
                  addProduct="Yangi sotuv"
                  itemTable="Sotuvlar ro'yxati"
                  OpenModal={handleSalesModal}
                  filteredSalesArray={filteredSalesArray}
                  setFilteredSalesArray={setFilteredSalesArray}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 col-12">
                <div className="card mb-4 table-container">
                  <div className="card-body p-md-5 p-0">
                    <h3 style={{ fontSize: "1.2rem" }}>Sotuvlar royxati</h3>
                    <div className="table-responsive-sm">
                      <table className="table mt-3 fw-bold">
                        <thead>
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Mijoz</th>
                            <th scope="col">Sotuv</th>
                            <th scope="col">Sotuv holati</th>
                            <th scope="col">To'lov holati</th>
                            <th scope="col">Mas'ul xodim</th>
                            <th scope="col">Jami narxi</th>
                            <th scope="col">To'lov</th>
                            <th scope="col">Naqd to'lov</th>
                            <th scope="col">Bank kartasi orqali to'lov</th>
                            <th scope="col">Qarzga</th>
                            <th scope="col">Chegirma</th>
                    
                            <th scope="col">Sotilgan vaqti</th>
                            <th scope="col">Setting</th>
                          </tr>
                        </thead>

                        <tbody>
                          {saveSales.length === 0 ? (
                            <tr>
                              <td className="text-center" colSpan="12">
                                Malumot topilmadi.
                              </td>
                            </tr>
                          ) : loading ? (
                            <tr>
                              <td colSpan="12">
                                <Loader />
                              </td>
                            </tr>
                          ) : (
                            newArray.map((item, index) => (
                              <tr key={index} className="text-nowrap py-4">
                                <th className="py-4" scope="row">
                                  {index + 1}
                                </th>
                                <td className="text-primary fs-5 pt-3 py-4 fs-6">
                                  {capitalizeFirstLetter(item.clientName)}
                                </td>
                                <td className="text-primary py-4">
                                  {index + 1}
                                </td>
                                <td className="py-4">
                                  <span
                                    className={
                                      item.selectedValue
                                        ? "bg-success fs-sm rounded-full text-white px-2 fw-normal"
                                        : "bg-f fs-sm rounded-full text-white px-2 fw-normal "
                                    }
                                  >
                                    {item.selectedValue
                                      ? "Tasdiqlangan"
                                      : "Tasdiqlanmagan"}
                                  </span>
                                </td>

                                <td className="py-4">
                                  <span
                                    onClick={() => {
                                      !item.selectedValue &&
                                        handleUpdateSales(item.id);
                                    }}
                                    className={
                                      item.selectedValue
                                        ? "cursor-pointer fs-sm bg-danger text-white px-2 fw-normal"
                                        : "cursor-pointer fs-sm bg-orange text-white px-2 fw-normal"
                                    }
                                  >
                                    {item.selectedValue
                                      ? "To'lovni ko'rish"
                                      : "To'lovni tasdiqlash"}
                                  </span>
                                </td>
                                <td className="text-primary py-4">
                                  {item.workman}
                                </td>
                                <td className="py-4">
                                  {item.selectedValue
                                    ? parseInt(item.productPrice)
                                    : item.productPrice}
                                </td>
                                <td className="py-4">
                                  {item.selectedValue ? item.selectedValue : 0}
                                </td>
                                <td className="py-4">0</td>
                                <td className="py-4">0</td>
                                <td className="py-4">
                                  {item.selectedValue
                                    ? parseInt(item.productPrice) -
                                      parseInt(item.selectedValue)
                                    : item.productPrice}
                                </td>
                                <td className="py-4">0</td>
                                
                                <td className="text-nowrap py-4">
                                  {item.dataValue}
                                </td>
                                <td className="d-flex justify-between border-none float-end py-4">
                                  <button
                                    type="button"
                                    className="pr-3"
                                    onClick={() => toggleDropdown(item.id)}
                                  >
                                    <FontAwesomeIcon
                                      icon={faEllipsisVertical}
                                    />
                                  </button>
                                  {isOpenMap[item.id] && (
                                    <ul className="pointer bg-opacity-5">
                                      <li
                                        className="pointer"
                                        onClick={() =>
                                          handleActionClick(item.id, "show")
                                        }
                                      >
                                        Sotuvni ko'rish
                                      </li>
                                      <li
                                        className="c-pointer"
                                        onClick={() =>
                                          handleActionClick(item.id, "delete")
                                        }
                                      >
                                        Sotuvni o'chirish
                                      </li>
                                    </ul>
                                  )}
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

              {/* ✅ JAMI MA'LUMOTLAR - totalValues dan foydalanadi */}
              <ul className="list-group list-group-horizontal-xxl fs-6">
                <li className="list-group-item">
                  Jami - Jami narxi: {formatLargeNumber(totalValues.productPrice)} so'm
                </li>
                <li className="list-group-item">
                  Jami - To'lov: {formatLargeNumber(totalValues.selectedValue)} so'm
                </li>
                <li className="list-group-item">
                  Jami - Naqd to'lov: 0
                </li>
                <li className="list-group-item">
                  Jami - Bank kartasi orqali to'lov: 0
                </li>
                <li className="list-group-item">
                  Jami - Qarz: {formatLargeNumber(totalValues.productPrice - totalValues.selectedValue)}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {salesOpenModal && (
        <div className="modal_container">
          <SalesFormComponent
            handleCloseModal={handleCloseModal}
            handleClickClient={handleClickClient}
            handleSubmit={handleSubmit}
            salesData={salesData}
            handleChange={handleChange}
            totalValue={totalValue}
            salesArray={salesArray}
            allTotalValue={allTotalValue}
            showClientModal={showClientModal}
            setShowClientModal={setShowClientModal}
            setSalesData={setSalesData}
            setSalesArray={setSalesArray}
            value={value}
            setValue={setValue}
            plasticValue={plasticValue}
            setPlasticValue={setPlasticValue}
            productArray={productArray}
            buttonDisabled={buttonDisabled}
            setButtonDisabled={setButtonDisabled}
            loading={loading}
            clientData={clientData}
            fetchProductData={fetchProductData}
            handleFormSubmit={handleFormSubmit}
            handleInputChange={handleInputChange}
            productData={productData}
            btnLoading={btnLoading}
            clientsArray={clientsArray}
            setClientsArray={setClientsArray}
            handleSave={handleSave}
            handleClose={handleClose}
            saveSales={saveSales}
            setSaveSales={setSaveSales}
            handleCustomer={handleCustomer}
            paymet={paymet}
            setPaymet={setPaymet}
            formatInputValue={formatInputValue}
            matchedClients={matchedClients}
            clientById={clientById}
            inputValues={inputValues}
            setInputValues={setInputValues}
          />
        </div>
      )}

      {isOpenDeleteModal && (
        <ConfirmDeleteSales
          handleConfirmDelete={handleConfirmDelete}
          handleCloseDeleteModal={() => setIsOpenDeleteModal(false)}
        />
      )}
    </>
  );
}

export default SalesList;