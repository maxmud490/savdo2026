/* eslint-disable react/no-unescaped-entities */
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintComponent from "./PrintComponent";
import PropTypes from "prop-types";
import { formatLargeNumber } from "../formatNumber";

function SalesInfoTable({
  setIsOpenShowProduct,
  showProductId,
  clientData,
  saveSales,
}) {
  const componentRef = useRef();

  // =====================================================
  // 🔍 ID NI TO'G'RI QIDIRISH
  // =====================================================

  console.log("=========================================");
  console.log("🔍 SALES INFO TABLE DEBUG");
  console.log("=========================================");

  console.log("🆔 showProductId:", showProductId);
  console.log("📦 saveSales uzunligi:", saveSales?.length);
  console.log("🔥🔥🔥 SAVE SALES TO'LIQ:");
  console.log(JSON.stringify(saveSales, null, 2));

  // ✅ Barcha ID larni ko'rsatish
  if (saveSales && saveSales.length > 0) {
    saveSales.forEach((item, index) => {
      console.log(`📦 saveSales[${index}] ID:`, item?.id, "_id:", item?._id);
    });
  }

  // ✅ ID ni qidirish (barcha fieldlarda)
  const searchId = String(showProductId || "");
  console.log("🔍 Qidirilayotgan ID:", searchId);

  const selectedSale = saveSales?.find((item) => {
    if (!item) return false;

    // Barcha mumkin bo'lgan ID fieldlari
    const ids = [
      item.id,
      item._id,
      item.productId,
      item.saleId,
      item.salesId,
      item?.savedData?.id,
      item?.savedData?._id,
    ];

    for (const id of ids) {
      if (id && String(id) === searchId) {
        console.log(`✅ ID topildi: ${id}`);
        return true;
      }
    }
    return false;
  });

 console.log("🔥 SELECTED SALE:", selectedSale);
console.log("🔥 PRODUCT NAME:", selectedSale?.productNameValue);
console.log("🔥 PRODUCT NUMBER:", selectedSale?.productNumber);
console.log("🔥 PRODUCT PRICE:", selectedSale?.productPrice);

  // =====================================================
  // ⚠️ MA'LUMOT TOPILMASA
  // =====================================================

  if (!selectedSale) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="card mt-4 p-5">
            <h3 className="text-center text-danger">⚠️ Ma'lumot topilmadi!</h3>
            <p className="text-center text-muted">
              Sotuv ID: <strong>{showProductId}</strong> bo'yicha ma'lumot
              topilmadi.
            </p>
            <div className="text-center mt-4">
              <button
                className="btn btn-red"
                onClick={() => setIsOpenShowProduct(false)}
              >
                ⬅ Orqaga
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // MA'LUMOTLARNI PARSLASH
  // =====================================================

  const totalPrice =
    parseFloat(selectedSale.totalValue) ||
    parseFloat(selectedSale.productPrice) ||
    0;

  const selectedValue = parseFloat(selectedSale.selectedValue) || 0;
  const clientValue = parseFloat(selectedSale.clientValue) || 0;
  const plasticValue = parseFloat(selectedSale.plasticValue) || 0;

  const totalPayment = selectedValue + clientValue + plasticValue;
  const debtValue = totalPrice - totalPayment;
  const isPaid = debtValue <= 0;

  // Mahsulotlar ro'yxati
  const productList = Array.isArray(selectedSale.products)
    ? selectedSale.products
    : [];

  const productNumber = productList.reduce(
    (sum, product) => sum + (parseFloat(product.productNumber) || 0),
    0,
  );
 
  // =====================================================
  // SANA FORMATI
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Noma'lum";
    try {
      return new Date(date).toLocaleString("uz-UZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } catch {
      return date;
    }
  };

  // =====================================================
  // PRINT
  // =====================================================

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="main-content">
      <div className="container">
        <div className="row">
          <div className="d-md-flex justify-content-between align-items-center">
            <div>
              <h1 className="fs-3 salesTitle">
                Sotuv № {saveSales.indexOf(selectedSale) + 1}
              </h1>
            </div>
            <div className="d-flex gap-2">
              <button onClick={handlePrint} className="btn btn-orange pdfBtn">
                📄 PDF
              </button>
              <button
                className="btn btn-red backBtn"
                onClick={() => setIsOpenShowProduct(false)}
              >
                ⬅ Orqaga
              </button>
            </div>
          </div>
        </div>

        <div className="card mt-4 p-5 d-none">
          <PrintComponent
            ref={componentRef}
            salesResult={[selectedSale]}
            resultObject={{
              ...selectedSale,
              totalValue: totalPrice,
              debtValue: debtValue > 0 ? debtValue : 0,
            }}
            formatLargeNumber={formatLargeNumber}
            foundIndex={saveSales.indexOf(selectedSale)}
          />
        </div>

        <div className="card mt-4 p-5">
          <div className="row mb-3">
            <div className="col-md-6 col-12">
              <ul className="list-group">
                <li className="list-group-item fw-bold">
                  Jami narxi:{" "}
                  <span className="text-success fs-5">
                    {formatLargeNumber(totalPrice)} so'm
                  </span>
                </li>
                <li className="list-group-item fw-bold">
                  To'lov:{" "}
                  <span className="text-primary fs-5">
                    {formatLargeNumber(totalPayment)} so'm
                  </span>
                </li>
                <li className="list-group-item fw-bold">
                  Chegirma: <span className="text-warning">0 so'm</span>
                </li>
                <li className="list-group-item fw-bold">
                  Qarzga:{" "}
                  <span
                    className={
                      debtValue > 0 ? "text-danger fs-5" : "text-success fs-5"
                    }
                  >
                    {formatLargeNumber(debtValue > 0 ? debtValue : 0)} so'm
                  </span>
                  {debtValue > 0 ? (
                    <span className="badge bg-danger ms-2">⚠️ Qarz mavjud</span>
                  ) : (
                    <span className="badge bg-success ms-2">
                      ✅ To'liq to'langan
                    </span>
                  )}
                </li>
                <li className="list-group-item fw-bold">
                  Qaytim: <span className="text-info">0 so'm</span>
                </li>
              </ul>
            </div>

            <div className="col-md-6 col-12">
              <ul className="list-group">
                <li className="list-group-item fw-bold">
                  Ombor: <span className="text-secondary">Основной склад</span>
                </li>
                <li className="list-group-item fw-bold">
                  Naqd to'lov:{" "}
                  <span className="text-success">
                    {formatLargeNumber(clientValue)} so'm
                  </span>
                </li>
                <li className="list-group-item fw-bold">
                  Bank kartasi:{" "}
                  <span className="text-primary">
                    {formatLargeNumber(plasticValue)} so'm
                  </span>
                </li>
                <li className="list-group-item fw-bold">
                  To'lov holati:{" "}
                  {isPaid ? (
                    <span className="text-success fw-bold">
                      ✅ To'liq to'langan
                    </span>
                  ) : (
                    <span className="text-danger fw-bold">
                      ⚠️ Qarz: {formatLargeNumber(debtValue)} so'm
                    </span>
                  )}
                </li>
                <li className="list-group-item fw-bold">
                  Vaqti:{" "}
                  <span className="text-secondary">
                    {formatDate(selectedSale.creationDateTime)}
                  </span>
                </li>
                <li className="list-group-item fw-bold">
                  Mijoz:{" "}
                  <span className="text-primary fw-bold fs-5">
                    {selectedSale.clientName?.toUpperCase() || "Noma'lum"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <hr />

          <div className="row mt-3">
            <h1 className="text-center fs-4 mb-3">🛒 Sotilgan mahsulotlar</h1>

            <div className="col-12">
              <div className="table-responsive">
                <table className="table table-striped table-hover table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th className="text-center">#</th>
                      <th>Mahsulot nomi</th>
                      <th className="text-center">Soni</th>
                      <th className="text-end">Sotish narxi</th>
                      <th className="text-end">Jami narx</th>
                      <th className="text-center">Holati</th>
                    </tr>
                  </thead>

                  <tbody>
  {productList.length > 0 ? (
    productList.map((product, index) => {
      const quantity =
        parseFloat(product.productNumber) || 0;

      const unitPrice =
        parseFloat(product.productPrice) || 0;

      const rowTotal =
        parseFloat(product.totalPrice) ||
        quantity * unitPrice;

      return (
        <tr key={index}>
          <td className="text-center fw-bold">
            {index + 1}
          </td>

          <td className="fw-medium">
            {product.productName || "Noma'lum mahsulot"}
          </td>

          <td className="text-center">
            {formatLargeNumber(quantity)} {product.saleUnit || "dona"}
          </td>

          <td className="text-end text-primary">
            {formatLargeNumber(unitPrice)} so'm
          </td>

          <td className="text-end fw-bold text-success">
            {formatLargeNumber(rowTotal)} so'm
          </td>

          <td className="text-center">
            {isPaid ? (
              <span className="badge bg-success">
                ✅ To'langan
              </span>
            ) : (
              <span className="badge bg-danger">
                ⚠️ Qarz
              </span>
            )}
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan="6" className="text-center">
        <span className="text-muted">
          Mahsulot ma'lumotlari mavjud emas
        </span>
      </td>
    </tr>
  )}
</tbody>
                  <tfoot className="table-dark fw-bold">
                    <tr>
                      <td colSpan="2" className="text-end">
                        JAMI:
                      </td>

                      <td className="text-center">
                        {formatLargeNumber(productNumber)}
                      </td>

                      <td></td>

                      <td className="text-end text-warning">
                        {formatLargeNumber(totalPrice)} so'm
                      </td>

                      <td className="text-center">
                        {isPaid ? (
                          <span className="text-success">✅ To'langan</span>
                        ) : (
                          <span className="text-danger">⚠️ Qarz</span>
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

SalesInfoTable.propTypes = {
  setIsOpenShowProduct: PropTypes.func.isRequired,
  showProductId: PropTypes.string.isRequired,
  clientData: PropTypes.array,
  saveSales: PropTypes.array,
};

SalesInfoTable.defaultProps = {
  clientData: [],
  saveSales: [],
};

export default SalesInfoTable;
