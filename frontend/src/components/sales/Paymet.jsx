import PropTypes from 'prop-types';
import { saveData } from "../api";

function Paymet({
  capitalizeFirstLetter,
  setPaymet,
  formatLargeNumber,
  saveSales,
  setSaveSales,
  salesArray,
  inputValues,
  setInputValues,
  handleClose,

}) {

console.log("🔥 PAYMET salesArray TO'LIQ:", salesArray);
console.log("🔥 PAYMET BIRINCHI MAHSULOT:", salesArray?.[0]);


  const updatedSalesArray = Array.isArray(salesArray) && salesArray.length > 0
  ? salesArray.map(item => ({
      ...item,
      totalValue: parseFloat(item.productNumber) * parseFloat(item.productPrice)
    }))
  : [];

  
  
 const combineSalesObj =
  Array.isArray(updatedSalesArray) && updatedSalesArray.length > 0
    ? {
        id: updatedSalesArray[0]?.id,
        clientName: updatedSalesArray[0]?.clientName,
        dataValue: updatedSalesArray[0]?.dataValue,

        // Umumiy son
        productNumber: updatedSalesArray.reduce(
          (sum, item) =>
            sum + (parseFloat(item.productNumber) || 0),
          0
        ),

        // Umumiy narx
        productPrice: updatedSalesArray.reduce(
          (sum, item) =>
            sum + (parseFloat(item.totalValue) || 0),
          0
        ),

        workman: updatedSalesArray[0]?.workman || "",

        // 🔥 MUHIM: barcha sotilgan mahsulotlar
        products: updatedSalesArray.map((item) => ({
          productName:
            item.productNameValue ||
            item.productName ||
            "",

          productNumber:
            parseFloat(item.productNumber) || 0,

          productPrice:
            parseFloat(item.productPrice) || 0,

          totalPrice:
            parseFloat(item.totalValue) || 0,

          saleUnit: item.saleUnit === "quti" ? "quti" : "dona",
          donaPerOram: Number(item.donaPerOram) || 1,
          stockQuantity: Number(item.stockQuantity) || 0,
        })),
      }
    : {};
const handleClientSubmit = async (e) => {
  e.preventDefault();

  const selectedPaymentMethod = inputValues
    ? Object.keys(inputValues).find(
        (key) => Number(inputValues[key]) !== 0
      )
    : null;

  const selectedValue = selectedPaymentMethod
    ? inputValues[selectedPaymentMethod]
    : 0;

  const combinedData = {
    selectedValue,
    ...combineSalesObj,
  };

  setInputValues({
    bankCard: 0,
    cashPayment: 0,
    bankTransfer: 0,
    otherMethods: 0,
    loyaltyCard: 0,
  });

  try {
    const response = await saveData(combinedData);

    console.log("🔥 SERVER JAVOBI:", response);
    console.log("🔥 SERVER savedData:", response?.savedData);
    console.log(
      "🔥 savedData ARRAYMI:",
      Array.isArray(response?.savedData)
    );

    const newSales = Array.isArray(response?.savedData)
      ? response.savedData
      : response?.savedData
        ? [response.savedData]
        : [];

    console.log("🔥 STATEGA QO'SHILADIGAN:", newSales);

    setSaveSales((prevSales) => {
      console.log("🔥 OLD saveSales:", prevSales);

      const newState = [
        ...newSales,
        ...prevSales,
      ];

      console.log("🔥 YANGI saveSales:", newState);

      return newState;
    });

    setPaymet(false);
    handleClose();

  } catch (error) {
    console.error("❌ TO'LOV SAQLASHDA XATO:", error);
  }
};

  const handleInputChange = (fieldName, event) => {
    setInputValues({
      ...inputValues,
      [fieldName]: event.target.value
    });
  };
  const handleSpanClick = (fieldName) => {
    setInputValues((prevInputValues) => {
    
      const newInputValues = { ...prevInputValues };
  
      newInputValues[fieldName] = 
      combineSalesObj.productPrice 
    
  
      Object.keys(newInputValues).forEach((key) => {
        if (key !== fieldName) {
          newInputValues[key] = 0;
        }
      });
  
      return newInputValues;
    });
  };
  
 
  return (
    <div className="modal_container">
      <div className="modal_content pb-5">
        <div className="row mt-3">
          <div className="col-md-6  col-6 ">
            {/* <div>
            {clientById && saveSalesData && (
                <h1 className="fs-5">
                  {capitalizeFirstLetter(saveSalesData.clientName)}{" "}
                  <span>
                    Qarz: {formatLargeNumber(saveSalesData.productPrice)} so'm
                  </span>
                  <strong className="ml-5 fs-6">
                    Mijozning bonuslari: <span className="text-warning">0</span>
                  </strong>
                </h1>
              )}
            </div> */}
          </div>
          <div
            onClick={() => setPaymet(false)}
            className="col-md-6  col-6 text-right cursor-pointer fs-4"
          >
            X
          </div>
        </div>
        <div className="row mt-3">
          <form onSubmit={handleClientSubmit}>
            <div className="row">
              <div className="col-md-6 col-12 ">
                <label className="form-label">Chegirma</label>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                  />
                  <button
                    className="btn btn-orange dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  ></button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <a className="dropdown-item" href="#">
                        Miqdorda
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Foizda
                      </a>
                    </li>
                  </ul>
                </div>
                <label className="form-label">Bank kartasi orqali to'lov</label>
                <div className="input-group mb-3">
                  <input
                   value={inputValues?.bankCard || ''}
                   onChange={(e) => handleInputChange("bankCard", e)}
                    type="text"
                    className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                  />
                  <span
                   onClick={() => handleSpanClick("bankCard")}
                    className="input-group-text bg-orange text-white"
                    style={{
                      borderBottomRightRadius: "20px",
                      borderTopRightRadius: "20px",
                    }}
                  >
                    umumiy miqdor
                  </span>
                </div>
                <label className="form-label">Bank kartasi orqali to'lov</label>
                <div className=" input-group mb-3">
                  <input
                     value={inputValues?.bankTransfer || ''}
                    onChange={(e) => handleInputChange("bankTransfer", e)}
                    type="text"
                    className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                  />
                  <span
                   onClick={() => handleSpanClick("bankTransfer")}
                    className="input-group-text bg-orange text-white"
                    style={{
                      borderBottomRightRadius: "20px",
                      borderTopRightRadius: "20px",
                    }}
                  >
                    umumiy miqdor
                  </span>
                </div>
              </div>
              <div className="col-md-6 col-12">
                <label className="form-label">Naqd to'lov</label>
                <div className="input-group mb-3">
                  <input
                  value={inputValues?.cashPayment || ''}
                  onChange={(e) => handleInputChange("cashPayment", e)}
                    type="text"
                    className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                  />
                  <span
                 onClick={() => handleSpanClick("cashPayment")}
                    className="input-group-text bg-orange text-white"
                    style={{
                      borderBottomRightRadius: "20px",
                      borderTopRightRadius: "20px",
                    }}
                  >
                    umumiy miqdor
                  </span>
                </div>
                <label className="form-label">
                  Bank o'tkazmasi orqali to'lov
                </label>
                <div className="input-group mb-3">
                  <input
                   value={inputValues?.loyaltyCard || ''}
                   onChange={(e) => handleInputChange("loyaltyCard", e)}
                    type="text"
                    className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                  />
                  <span
                 onClick={() => handleSpanClick("loyaltyCard")}
                    className="input-group-text bg-orange text-white"
                    style={{
                      borderBottomRightRadius: "20px",
                      borderTopRightRadius: "20px",
                    }}
                  >
                    umumiy miqdor
                  </span>
                </div>
                <label className="form-label">
                  Boshqa usullar bilan to'lov
                </label>
                <div className="input-group mb-3">
                  <input
                      value={inputValues?.otherMethods || ''}
                      onChange={(e) => handleInputChange("otherMethods", e)}
                    type="text"
                    className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                  />
                  <span
                  onClick={() => handleSpanClick("otherMethods")}
                    className="input-group-text bg-orange text-white"
                    style={{
                      borderBottomRightRadius: "20px",
                      borderTopRightRadius: "20px",
                    }}
                  >
                    umumiy miqdor
                  </span>
                </div>
                <label className="form-label">
                  Sodiqlik kartasi uchun otkazma
                </label>
                <div className="input-group mb-3">
                  <input
                  // value
                    type="text"
                    className="form-control-sm bg-opacity-0 form-control shadow-none product-input py-2"
                  />
                  <span
                  // onclick
                    className="input-group-text bg-orange text-white"
                    style={{
                      borderBottomRightRadius: "20px",
                      borderTopRightRadius: "20px",
                    }}
                  >
                    umumiy miqdor
                  </span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn w-xs-100 btn-sm px-3"

            >
              Mijoz tolovi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

Paymet.propTypes = {
  // other props...
  setSaveSales: PropTypes.func.isRequired,
};
export default Paymet;