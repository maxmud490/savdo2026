/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import iconCloud from "../../assets/cloud-download.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatLargeNumber } from "../formatNumber";
import PropTypes from "prop-types";
import { useReactToPrint } from "react-to-print";
import PrintReportsList from "./PrintReportsList";

function Reports({ saveSales }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const componentRef = useRef(null);

  // ==========================================
  // SAVE SALES NI TEKSHIRISH
  // ==========================================

  const sales = Array.isArray(saveSales) ? saveSales : [];

  console.log("REPORTS saveSales:", sales);

  // ==========================================
  // PRINT
  // ==========================================

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // ==========================================
  // NUMBER
  // ==========================================

  const toNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  // ==========================================
  // REPORTNI HISOBLASH
  // ==========================================

  const filterData = () => {
    const search = searchTerm.trim().toLowerCase();

    // ------------------------------------------
    // 1. FILTER
    // ------------------------------------------

    const filtered = sales.filter((item) => {
      // Sana
      const itemDate = item.dataValue
        ? new Date(item.dataValue)
        : item.creationDateTime
        ? new Date(item.creationDateTime)
        : null;

      // Boshlanish sanasi
      if (startDate && itemDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);

        if (itemDate < start) {
          return false;
        }
      }

      // Tugash sanasi
      if (endDate && itemDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (itemDate > end) {
          return false;
        }
      }

      // Qidiruv
      if (search) {
        const clientName = String(item.clientName || "").toLowerCase();

        if (!clientName.includes(search)) {
          return false;
        }
      }

      return true;
    });

    // ------------------------------------------
    // 2. MIJOZLAR BO'YICHA GROUP
    // ------------------------------------------

    const clients = {};

    filtered.forEach((item) => {
      const clientName = item.clientName || "Noma'lum mijoz";

      if (!clients[clientName]) {
        clients[clientName] = {
          clientName,

          // Sotuv
          totalValue: 0,
          productNumber: 0,
          debtValue: 0,

          // To'lov
          selectedValue: 0,
          clientValue: 0,
          plasticValue: 0,

          // Sana
          dataValue: item.dataValue || "",

          // Sotuvlar soni
          salesCount: 0,
        };
      }

      // ----------------------------------------
      // JAMI SOTUV
      // ----------------------------------------

      const totalValue = toNumber(
        item.totalValue
      );

      clients[clientName].totalValue += totalValue;

      // ----------------------------------------
      // MAHSULOT SONI
      // ----------------------------------------

      if (Array.isArray(item.products)) {
        const productCount = item.products.reduce(
          (sum, product) =>
            sum + toNumber(product.productNumber),
          0
        );

        clients[clientName].productNumber +=
          productCount;
      } else {
        clients[clientName].productNumber +=
          toNumber(item.productNumber);
      }

      // ----------------------------------------
      // QARZ
      // ----------------------------------------

      clients[clientName].debtValue += toNumber(
        item.debtValue
      );

      // ----------------------------------------
      // NAQD
      // ----------------------------------------

      clients[clientName].clientValue += toNumber(
        item.clientValue
      );

      // ----------------------------------------
      // PLASTIK
      // ----------------------------------------

      clients[clientName].plasticValue += toNumber(
        item.plasticValue
      );

      // ----------------------------------------
      // JAMI TO'LOV
      // ----------------------------------------

      clients[clientName].selectedValue += toNumber(
        item.selectedValue
      );

      // ----------------------------------------
      // SOTUVLAR SONI
      // ----------------------------------------

      clients[clientName].salesCount += 1;

      // ----------------------------------------
      // OXIRGI SANA
      // ----------------------------------------

      if (item.dataValue) {
        clients[clientName].dataValue =
          item.dataValue;
      }
    });

    // ------------------------------------------
    // 3. OBJECT -> ARRAY
    // ------------------------------------------

    const result = Object.values(clients);

    console.log(
      "📊 REPORT RESULT:",
      result
    );

    setFilteredData(result);
  };

  // ==========================================
  // SAVE SALES O'ZGARGANDA
  // ==========================================

  useEffect(() => {
    filterData();
  }, [
    saveSales,
    startDate,
    endDate,
    searchTerm,
  ]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // ==========================================
  // START DATE
  // ==========================================

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  // ==========================================
  // END DATE
  // ==========================================

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  return (
    <div className="main-content">
      <div className="container">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="row">
          <div className="col col-12">

            <div className="d-flex align-center justify-between">

              <h1 className="fs-3">
                Mijozlar hisoboti ro'yxati
              </h1>

              <div className="top-right-button-container">

                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn top-right-button btn-red btn-sm d-flex align-middle dNone"
                >
                  <img
                    src={iconCloud}
                    alt="icon"
                    className="px-1"
                  />

                  Excel-da yuklab olish
                </button>

              </div>

            </div>

          </div>

          {/* PRINT */}
          <div className="card mt-4 p-5 d-none">

            <div className="row mb-3">

              <PrintReportsList
                filteredData={filteredData}
                ref={componentRef}
              />

            </div>

          </div>

          {/* ======================================
              FILTER
          ====================================== */}

          <div className="col-md-12 col-12">

            <div className="row">

              {/* SEARCH */}

              <div className="col-md-6 col-12">

                <div className="d-flex mr-auto mt-5">

                  <div className="search-sm mr-1 my-2">

                    <input
                      type="search"
                      className="form-control form-control-dark rounded-pill"
                      placeholder=" Qidiruv..."
                      onChange={handleSearch}
                      value={searchTerm}
                    />

                  </div>

                  {/* START DATE */}

                  <div className="mr-2 d-block my-2 w-sm-100 btn-group">

                    <DatePicker
                      selected={startDate}
                      onChange={
                        handleStartDateChange
                      }
                      placeholderText="Boshlanishi"
                      autoComplete="off"
                      className="form-control form-control-dark rounded-pill dNone"
                    />

                  </div>

                  {/* END DATE */}

                  <div className="mr-2 d-block my-2 w-sm-100 btn-group">

                    <DatePicker
                      selected={endDate}
                      onChange={
                        handleEndDateChange
                      }
                      placeholderText="Tugashi"
                      autoComplete="off"
                      className="form-control form-control-dark rounded-pill dNone"
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ======================================
            TABLE
        ====================================== */}

        <div className="table-responsive-sm">

          <table className="table table-hover table-bordered border border-white mt-5 fw-bold">

            <thead>

              {/* GROUP HEADER */}

              <tr>

                <th
                  colSpan="2"
                  className="text-center table-white"
                />

                <th
                  colSpan="4"
                  className="text-center table-success"
                >
                  Sotuv
                </th>

                <th
                  colSpan="5"
                  className="text-center table-info"
                >
                  To'lov
                </th>

              </tr>

              {/* COLUMN HEADER */}

              <tr>

                <th>#</th>

                <th>Mijoz</th>

                <th className="table-success">
                  Jami
                </th>

                <th className="table-success">
                  Soni
                </th>

                <th className="table-success">
                  Qarzga
                </th>

                <th className="table-success">
                  Sotuvlar
                </th>

                <th className="table-info">
                  Jami to'lov
                </th>

                <th className="table-info">
                  Naqd
                </th>

                <th className="table-info">
                  Bank kartasi
                </th>

                <th className="table-info">
                  Qoldiq
                </th>

                <th className="table-info">
                  Sotilgan vaqti
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredData.length === 0 ? (

                <tr>

                  <td
                    colSpan="11"
                    className="text-center py-4"
                  >
                    Ma'lumot topilmadi
                  </td>

                </tr>

              ) : (

                filteredData.map(
                  (item, index) => (

                    <tr key={`${item.clientName}-${index}`}>

                      {/* # */}

                      <th scope="row">
                        {index + 1}
                      </th>

                      {/* MIJOZ */}

                      <td>
                        {item.clientName}
                      </td>

                      {/* JAMI SOTUV */}

                      <td className="table-success">

                        {formatLargeNumber(
                          item.totalValue
                        )}

                      </td>

                      {/* MAHSULOT SONI */}

                      <td className="table-success">

                        {formatLargeNumber(
                          item.productNumber
                        )}

                      </td>

                      {/* QARZ */}

                      <td className="table-success">

                        {formatLargeNumber(
                          item.debtValue
                        )}

                      </td>

                      {/* SOTUVLAR SONI */}

                      <td className="table-success">

                        {item.salesCount}

                      </td>

                      {/* JAMI TO'LOV */}

                      <td className="table-info">

                        {formatLargeNumber(
                          item.selectedValue
                        )}

                      </td>

                      {/* NAQD */}

                      <td className="table-info">

                        {formatLargeNumber(
                          item.clientValue
                        )}

                      </td>

                      {/* PLASTIK */}

                      <td className="table-info">

                        {formatLargeNumber(
                          item.plasticValue
                        )}

                      </td>

                      {/* QOLDIQ */}

                      <td className="table-info">

                        {formatLargeNumber(
                          item.totalValue -
                          item.selectedValue
                        )}

                      </td>

                      {/* SANA */}

                      <td className="table-info">

                        {item.dataValue}

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}

Reports.propTypes = {
  saveSales: PropTypes.array,
};

Reports.defaultProps = {
  saveSales: [],
};

export default Reports;