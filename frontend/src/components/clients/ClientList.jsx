import iconCloud from "../../assets/cloud-download.svg";
import DatePicker from "react-datepicker";

function ClientList({ clientsArray }) {
    console.log(clientsArray);
  return (
    <div className="main-content">
      <div className="container">
        <div className="row">
          <div className="col col-12">
            <div className="d-flex align-center justify-between">
              <h1 className="fs-3">Mijozlar ro'yxati</h1>
              <div className="top-right-button-container d-flex">
                <button className="btn rounded-full btn-orange btn-sm mx-2">
                  Yangi qo'shish
                </button>
                <button
                  type="button"
                  // onClick={handlePrint}
                  className="btn top-right-button btn-red btn-sm d-flex align-middle dNone"
                >
                  <img src={iconCloud} alt="icon" className="px-1" />
                  Excel-da yuklab olish
                </button>
              </div>
            </div>
          </div>
          {/* {handlePrint && (
        <div className="card mt-4 p-5 d-none">
          <div className="row mb-3">
          <PrintReportsList filteredData={filteredData} ref={componentRef} />
          </div>
        </div>
          )} */}
          <div className="col-md-12 col-12">
            <div className="row">
              <div className="col-md-10 col-12">
                <div className="d-flex mr-auto mt-5">
                  <div className="input-group">
                    <span className="input-group-text">Qarz</span>
                    <input type="text" className="form-control" />
                    <span className="input-group-text">Hamma qarzlar</span>
                  </div>
                  <div className="search-sm mr-1 my-2 input-group-sm">
                    <input
                      type="search"
                      className="form-control form-control-dark rounded-pill "
                      placeholder=" Qidiruv..."
                      // onChange={handleSearch}
                      // value={searchTerm}
                    />
                  </div>
                  <div className="mr-2 input-group-sm">
                    <DatePicker
                      // selected={startDate}
                      // onChange={handleStartDateChange}
                      placeholderText="Boshlanishi"
                      autoComplete="off"
                      className="form-control form-control-dark rounded-pill dNone"
                    />
                  </div>
                  <div className="mr-2 input-group-sm">
                    <DatePicker
                      // selected={endDate}
                      // onChange={handleEndDateChange}
                      placeholderText="Tugashi"
                      autoComplete="off"
                      className="form-control form-control-dark rounded-pill dNone"
                    />
                  </div>
                </div>
              </div>
              <div className="col-2">
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
        <div className="col-md-12 col-12">
                <div className="card mb-4 table-container">
                  <div className="card-body">
                    <div className="table-responsive-sm">
                    <table className="table table-hover fw-bold">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Mijoz</th>
                          <th scope="col">Qarz</th>
                          <th scope="col">Oxirgi sotuv</th>
                          <th scope="col">Ma'lumot</th>
                          <th scope="col">Bonus tezligi</th>
                          <th scope="col">Telefon raqamlari</th>
                          <th scope="col">Narx turi</th>
                        </tr>
                      </thead>
                      <tbody>
                      {clientsArray && clientsArray.length > 0 ? (
                        clientsArray.map((item, index) => (
                          <tr key={index} className="table-danger">
                            <th scope="row" className="py-4">{index + 1}</th>
                            <td className="py-4">{item.client}</td>
                            <td className="py-4">{/* Render Qarz value here */}</td>
                            <td className="py-4">{/* Render Oxirgi sotuv value here */}</td>
                            <td className="py-4">{item.data}</td>
                            <td className="py-4">{item.percentage}</td>
                            <td className="py-4">{item.tel}</td>
                            <td className="py-4">{item.price}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" className="text-center">
                            No data available
                          </td>
                        </tr>
                      )}
                      </tbody>
                    </table>
                    </div>
                  </div>
                </div>
              </div>
      </div>
    </div>
  );
}

export default ClientList;
