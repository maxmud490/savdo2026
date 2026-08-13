/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState, useRef } from "react";
import iconCloud from "../../assets/cloud-download.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {formatLargeNumber} from '../formatNumber'
import PropTypes from 'prop-types'; 
import { useReactToPrint } from 'react-to-print';
import PrintReportsList from './PrintReportsList';

function Reports({ saveSales }) {
    const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(saveSales);

  const componentRef = useRef();

  console.log(saveSales);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (startDate !== null && endDate !== null) { 
      filterData(startDate, endDate, searchTerm);
    }
  }, [startDate, endDate, searchTerm]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
    filterData(date, endDate, searchTerm);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    filterData(startDate, date, searchTerm);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    filterData(event.target.value);
  };

  const filterData = (start, end, search) => {
    const filtered = clientData.filter((item) => {
      const itemDate = new Date(item.dataValue);
      const searchMatch =
        item.clientName.toLowerCase().includes(search.toLowerCase()) ||
        item.dataValue.includes(search);
      return itemDate >= start && itemDate <= end && searchMatch;
    });
  
    const mappedData = filtered.reduce((accumulator, item) => {
      const key = item.clientName;
      const clientValue = parseFloat(item.clientValue);
  
      if (!isNaN(clientValue)) {
        if (accumulator.hasOwnProperty(key)) {
          accumulator[key].newPriceNumber += parseFloat(item.newPriceNumber);
          accumulator[key].debtNewPriceNumber +=
            parseFloat(item.newPriceNumber) - clientValue;
          accumulator[key].clientValue += clientValue;
        } else {
          accumulator[key] = {
            newPriceNumber: parseFloat(item.newPriceNumber),
             debtNewPriceNumber: parseFloat(item.newPriceNumber) - clientValue,
            clientValue: clientValue,
            dataValue: item.dataValue,
            productNumber: item.productNumber,
          };
        }
      }
  
      return accumulator;
    }, {});
  
    const resultArray = Object.keys(mappedData).map((key) => ({
      clientName: key,
      ...mappedData[key],
    }));
  
    setFilteredData(resultArray);
  };
  

  return (
    <div className="main-content">
      <div className="container">
        <div className="row">
          <div className="col col-12">
            <div className="d-flex align-center justify-between">
              <h1 className="fs-3">Mijozlar hisoboti ro'yxati</h1>
              <div className="top-right-button-container">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn top-right-button btn-red btn-sm d-flex align-middle dNone"
                >
                  <img src={iconCloud} alt="icon" className="px-1" />
                  Excel-da yuklab olish
                </button>
              </div>
            </div>
          </div>
          {handlePrint && (
          <div className="card mt-4 p-5 d-none">
            <div className="row mb-3">
            <PrintReportsList filteredData={filteredData} ref={componentRef} />
            </div>
          </div>
            )}
          <div className="col-md-12 col-12">
            <div className="row">
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
                  <div className="mr-2 d-block my-2  w-sm-100 btn-group">
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      placeholderText="Boshlanishi"
                      autoComplete="off"
                      className="form-control form-control-dark rounded-pill dNone"
                    />
                  </div>
                  <div className="mr-2 d-block my-2  w-sm-100 btn-group">
                    <DatePicker
                      selected={endDate}
                      onChange={handleEndDateChange}
                      placeholderText="Tugashi"
                      autoComplete="off"
                      className="form-control form-control-dark rounded-pill dNone"
                    />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center justify-end  mt-5">
                  <div className="my-2 mr-1">
                    <label className="pr-2 dNone">Korsatish:</label>
                    <div className="d-inline-block btn-group">
                      <button className="btn btn-outline-warning rounded-50 btn-xs dNone ">
                        10
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="table-responsive-sm">
        <table className="table table-hover table-bordered border border-white mt-5 fw-bold">
          <thead>
            <tr>
              <th
                colSpan="2"
                scope="colgroup"
                className="text-center table-white"
              ></th>
              <th
                colSpan="4"
                scope="colgroup"
                className="text-center table-success"
              >
                Sotuv
              </th>
              <th
                colSpan="6"
                scope="colgroup"
                className="text-center table-info"
              >
                To'lov
              </th>
            </tr>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Mijoz</th>
              <th scope="col" className="table-success">
                Jami
              </th>
              <th scope="col" className="table-success">
                Soni
              </th>
              <th scope="col" className="table-success">
                Qarzga
              </th>
              <th scope="col" className="table-success">
                Chegirma
              </th>
              <th scope="col" className="table-info">
                Jami
              </th>
              <th scope="col" className="table-info">
                Soni
              </th>
              <th scope="col" className="table-info">
                Naqd
              </th>
              <th scope="col" className="table-info">
                Bank kartasi
              </th>
              <th scope="col" className="table-info">
                Sotilgan vaqti
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item.clientName}</td>
                <td className="table-success">{formatLargeNumber(item.newPriceNumber)}</td>
                <td className="table-success">{item.productNumber}</td>
                <td className="table-success">
                  {item.clientValue !== "" 
                  ? formatLargeNumber(item.newPriceNumber - item.clientValue)
                  : formatLargeNumber(item.newPriceNumber - item.plasticValue)}
                  </td>
                <td className="table-success">0</td>
                <td className="table-info">
                {item.clientValue !== "" 
                  ? formatLargeNumber(item.clientValue)
                  : formatLargeNumber(item.plasticValue)}
                  </td>
                <td className="table-info">{item.productNumber}</td>
                <td className="table-info">
                {item.clientValue !== "" 
                  ? formatLargeNumber(item.clientValue)
                  : 0 }
                  </td>
                <td className="table-info">
                {item.plasticValue !== "" 
                  ? formatLargeNumber(item.plasticValue)
                  : 0 }
                </td>
                <td className="table-info">{item.dataValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
Reports.propTypes = {
  clientData: PropTypes.array.isRequired,
};
export default Reports;
