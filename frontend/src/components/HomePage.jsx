import "./HomePage.css";
import { salesInformation } from "../datalist/dropListItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";


function HomePage({ saveSales, suppliers }) {

  function formatLargeNumber(number) {
    if (typeof number !== 'undefined' && number !== null) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    return '';
  }

  const calculateTotalPrice = (selectedTimePeriod) => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  
    const filteredData =
      selectedTimePeriod === "day"
        ? saveSales.filter(
            (item) =>
              new Date(item.dataValue).toDateString() === today.toDateString()
          )
        : selectedTimePeriod === "week"
        ? saveSales.filter(
            (item) =>
              new Date(item.dataValue) >= oneWeekAgo &&
              new Date(item.dataValue) <= today
          )
        : selectedTimePeriod === "month"
        ? saveSales.filter(
            (item) =>
              new Date(item.dataValue) >= oneMonthAgo &&
              new Date(item.dataValue) <= today
          )
        : saveSales;
  
     const total = filteredData.reduce(
    (total, price) => {
      const clientValue = parseInt(price.selectedValue);
      
      const isValidClientValue = !isNaN(clientValue);
      

      return total + (isValidClientValue ? clientValue : 0)
    },
    0
  );
  
    return total;
  };
  

  // Example usage:
  const totalDay = calculateTotalPrice("day");
  const totalWeek = calculateTotalPrice("week");
  const totalMonth = calculateTotalPrice("month");

  const [selectedTimePeriod, setSelectedTimePeriod] = useState("day");

  // Function to handle time period button clicks
  const handleTimePeriodButtonClick = (timePeriod) => {
    setSelectedTimePeriod(timePeriod);
  };

  ////////////////////////////////////////////////////////////////////////////
  function calculateTotalValue(arr) {
    return arr.reduce((accumulator, item) => {
      const clientValue = parseFloat(item.selectedValue) || 0;
     
      const newNumber = parseFloat(item.productPrice) - clientValue;
      return accumulator += newNumber;
    }, 0);
  }

  const result = calculateTotalValue(saveSales);


  function calculateDebtTotalValue(arr) {
    return arr.reduce((accumulator, item) => {
        return accumulator + parseInt(item.debt); 
     
    }, 0);
  }
 
const debtResult = calculateDebtTotalValue(suppliers);


  return (
    <div className="main-content">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-12">
            <div className="d-md-flex align-center">
              <h1 className="fs-2 text-center">Bosh sahifa</h1>
              <button
                onClick={() => handleTimePeriodButtonClick("week")}
                className={`btn btn-xs ml-5 text-white hover d-none d-md-block py-0 px-2 bradius ${
                  selectedTimePeriod === "week" ? "active" : ""
                }`}
                style={{ backgroundColor: "#f18024", fontSize: "12px" }}
              >
                Bir haftalik
              </button>
              <button
                onClick={() => handleTimePeriodButtonClick("unselected")}
                className={`btn btn-xs ml-2 text-white d-none d-md-block py-0 px-2 bradius ${
                  selectedTimePeriod === "unselected" ? "active" : ""
                }`}
                style={{ backgroundColor: "#f18024", fontSize: "12px" }}
              >
                Tanlanmagan
              </button>
            </div>
            <div className="separator mb-5 mt-4"></div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6 col-12">
            <div className="row">
              <div className="h5 ml-2 text-md-start text-center">
              Sotuvlar
              </div>
              {salesInformation.map((item) => {
                let totalValue;

                if (item.title === "Bugun") {
                  totalValue = totalDay;
                } else if (item.title === "Неделя") {
                  totalValue = totalWeek;
                } else if (item.title === "Месяц") {
                  totalValue = totalMonth;
                } else {
                  return null; 
                }

                return (
                  <div key={item.id} className="col-md-4 mb-3">
                    <div className="card mb-4 text-center px-4 py-8 rounded-3 border-none bg-white">
                      <div className="card-body">
                        <FontAwesomeIcon
                          icon={item.icon}
                          className="icon-cards"
                        />
                        <p className="card-text font-weight-semibold mb-0">
                        {item.title}
                        </p>
                        <p className="lead text-center text-nowrap">{formatLargeNumber(totalValue)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          <div className="col-md-6 col-12">
            <div className="row">
              <div className="h5 ml-2 text-md-start text-center">O'zaro hisob-kitoblar</div>
              {salesInformation.slice(3).map((item) => (
                <div key={item.id} className="col-md-6 mb-3">
                  <div className="card mb-4 text-center px-4 py-8 rounded-3 border-none bg-white">
                    <div className="card-body">
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="icon-cards"
                      />
                      <p className="card-text font-weight-semibold mb-0">
                      {item.title}
                      </p>
                      <p className="lead text-center">
                      {item.id === 19 && formatLargeNumber(result)}
                      {item.id === 20 && formatLargeNumber(- debtResult)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
