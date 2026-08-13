/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/display-name */

import { forwardRef } from "react";
import PropTypes from "prop-types";

const PrintComponent = forwardRef(
  ({ salesResult, resultObject, formatLargeNumber, foundIndex }, ref) => {

    const totalPrice =
      Number(resultObject.totalValue) ||
      Number(resultObject.productPrice) ||
      0;

    const clientValue =
      Number(resultObject.clientValue) || 0;

    const plasticValue =
      Number(resultObject.plasticValue) || 0;

    const selectedValue =
      Number(resultObject.selectedValue) || 0;

    // Umumiy to'lov
    const totalPayment =
      selectedValue > 0
        ? selectedValue
        : clientValue + plasticValue;

    // Qarz
    const debtValue = Math.max(
      0,
      totalPrice - totalPayment
    );

    // Mahsulotlar
    const products =
      Array.isArray(resultObject.products)
        ? resultObject.products
        : [];

    return (
      <div
        ref={ref}
        className="print-content"
        style={{
          background: "#fff",
          color: "#000",
          padding: "20px",
          width: "100%",
        }}
      >

        {/* ========================================= */}
        {/* SOTUV MA'LUMOTI */}
        {/* ========================================= */}

        <h1
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Sotuv № {foundIndex + 1}
        </h1>

        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <span>+998902990052</span>
        </div>

        <div className="row mb-3">

          {/* CHAP TOMON */}

          <div className="col-6">

            <ul className="list-group">

              <li className="list-group-item fw-bold">
                Jami narxi:{" "}
                <span>
                  {formatLargeNumber(totalPrice)} so'm
                </span>
              </li>

              <li className="list-group-item fw-bold">
                To'lov:{" "}
                <span>
                  {formatLargeNumber(totalPayment)} so'm
                </span>
              </li>

              <li className="list-group-item fw-bold">
                Chegirma:{" "}
                <span>
                  0 so'm
                </span>
              </li>

              <li className="list-group-item fw-bold">
                Qarzga:{" "}
                <span>
                  {formatLargeNumber(debtValue)} so'm
                </span>
              </li>

              <li className="list-group-item fw-bold">
                Qaytim:{" "}
                <span>
                  0 so'm
                </span>
              </li>

            </ul>

          </div>


          {/* O'NG TOMON */}

          <div className="col-6">

            <ul className="list-group">

              <li className="list-group-item fw-bold">
                Ombor:{" "}
                <span>
                  Основной склад
                </span>
              </li>

              <li className="list-group-item fw-bold">
                Naqd to'lov:{" "}
                <span>
                  {formatLargeNumber(clientValue)} so'm
                </span>
              </li>

              <li className="list-group-item fw-bold">
                Bank kartasi orqali to'lov:{" "}
                <span>
                  {formatLargeNumber(plasticValue)} so'm
                </span>
              </li>

              <li className="list-group-item fw-bold">
                To'lov holati:{" "}

                {debtValue <= 0 ? (
                  <span>
                    To'liq to'langan
                  </span>
                ) : (
                  <span>
                    Qarz mavjud
                  </span>
                )}

              </li>

              <li className="list-group-item fw-bold">
                Vaqti:{" "}
                <span>
                  {resultObject.creationDateTime
                    ? new Date(
                        resultObject.creationDateTime
                      ).toLocaleString("uz-UZ")
                    : "Noma'lum"}
                </span>
              </li>

              <li className="list-group-item fw-bold">
                Mijoz:{" "}
                <span>
                  {resultObject.clientName?.toUpperCase() ||
                    "NOMA'LUM"}
                </span>
              </li>

            </ul>

          </div>

        </div>


        <hr />


        {/* ========================================= */}
        {/* MAHSULOTLAR */}
        {/* ========================================= */}

        <div className="row mt-3">

          <h1
            className="text-center fs-4"
            style={{
              marginBottom: "15px",
            }}
          >
            Sotilgan mahsulotlar ro'yxati
          </h1>

          <div className="col-12">

            <table
              className="table table-bordered"
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >

              <thead>

                <tr>

                  <th>#</th>

                  <th>
                    Mahsulot nomi
                  </th>

                  <th>
                    Soni
                  </th>

                  <th>
                    Sotish narxi
                  </th>

                  <th>
                    Jami narx
                  </th>

                  <th>
                    Holati
                  </th>

                </tr>

              </thead>


              <tbody>

                {products.length > 0 ? (

                  products.map((product, index) => {

                    const quantity =
                      Number(product.productNumber) || 0;

                    const unitPrice =
                      Number(product.productPrice) || 0;

                    const rowTotal =
                      Number(product.totalPrice) ||
                      quantity * unitPrice;

                    return (

                      <tr key={product._id || index}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {product.productName ||
                            "Noma'lum mahsulot"}
                        </td>

                        <td>
                          {formatLargeNumber(quantity)} {product.saleUnit || "dona"}
                        </td>

                        <td>
                          {formatLargeNumber(unitPrice)} so'm
                        </td>

                        <td>
                          {formatLargeNumber(rowTotal)} so'm
                        </td>

                        <td>

                          {debtValue <= 0
                            ? "To'langan"
                            : "Qarz"}

                        </td>

                      </tr>

                    );

                  })

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                      }}
                    >
                      Mahsulot ma'lumotlari mavjud emas
                    </td>

                  </tr>

                )}

              </tbody>


              {/* ================================= */}
              {/* JAMI */}
              {/* ================================= */}

              <tfoot>

                <tr>

                  <td
                    colSpan="2"
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    JAMI:
                  </td>

                  <td
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {formatLargeNumber(
                      products.reduce(
                        (sum, product) =>
                          sum +
                          (Number(
                            product.productNumber
                          ) || 0),
                        0
                      )
                    )}
                  </td>

                  <td></td>

                  <td
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {formatLargeNumber(totalPrice)} so'm
                  </td>

                  <td
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {debtValue <= 0
                      ? "To'langan"
                      : "Qarz"}
                  </td>

                </tr>

              </tfoot>

            </table>

          </div>

        </div>

      </div>
    );
  }
);


PrintComponent.propTypes = {
  salesResult: PropTypes.array.isRequired,
  resultObject: PropTypes.object.isRequired,
  formatLargeNumber: PropTypes.func.isRequired,
  foundIndex: PropTypes.number.isRequired,
};


export default PrintComponent;