import { useState } from "react";
import iconCloud from "../../assets/cloud-download.svg";
import DatePicker from "react-datepicker";
import AddClientModal from "./AddClientModal";

function ClientList({ clientsArray, setClientsArray }) {
  const [showAddClientModal, setShowAddClientModal] = useState(false);

  // Yangi mijoz qo'shish modalini ochish
  const handleAddClient = () => {
    setShowAddClientModal(true);
  };

  return (
    <>
      {/* =====================================================
          MIJOZ QO'SHISH MODALI
      ====================================================== */}
      {showAddClientModal && (
        <AddClientModal
          clientsArray={clientsArray}
          setClientsArray={setClientsArray}
        />
      )}

      {/* =====================================================
          CLIENT LIST
      ====================================================== */}
      <div className="main-content">
        <div className="container">
          <div className="row">

            {/* ================= HEADER ================= */}
            <div className="col col-12">
              <div className="d-flex align-center justify-between">

                <h1 className="fs-3">
                  Mijozlar ro'yxati
                </h1>

                <div className="top-right-button-container d-flex">

                  {/* YANGI MIJOZ */}
                  <button
                    type="button"
                    onClick={handleAddClient}
                    className="btn rounded-full btn-orange btn-sm mx-2"
                  >
                    Yangi mijoz qo'shish
                  </button>

                  {/* EXCEL */}
                  <button
                    type="button"
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

            {/* ================= FILTERLAR ================= */}
            <div className="col-md-12 col-12">

              <div className="row">

                <div className="col-md-10 col-12">

                  <div className="d-flex mr-auto mt-5">

                    {/* QARZ */}
                    <div className="input-group">

                      <span className="input-group-text">
                        Qarz
                      </span>

                      <input
                        type="text"
                        className="form-control"
                      />

                      <span className="input-group-text">
                        Hamma qarzlar
                      </span>

                    </div>

                    {/* SEARCH */}
                    <div className="search-sm mr-1 my-2 input-group-sm">

                      <input
                        type="search"
                        className="form-control form-control-dark rounded-pill"
                        placeholder="Qidiruv..."
                      />

                    </div>

                    {/* START DATE */}
                    <div className="mr-2 input-group-sm">

                      <DatePicker
                        placeholderText="Boshlanishi"
                        autoComplete="off"
                        className="form-control form-control-dark rounded-pill dNone"
                      />

                    </div>

                    {/* END DATE */}
                    <div className="mr-2 input-group-sm">

                      <DatePicker
                        placeholderText="Tugashi"
                        autoComplete="off"
                        className="form-control form-control-dark rounded-pill dNone"
                      />

                    </div>

                  </div>

                </div>

                {/* KO'RSATISH */}
                <div className="col-2">

                  <div className="d-flex align-items-center justify-end mt-5">

                    <div className="my-2 mr-1">

                      <label className="pr-2 dNone">
                        Korsatish:
                      </label>

                      <div className="d-inline-block btn-group">

                        <button
                          type="button"
                          className="btn btn-outline-warning rounded-50 btn-xs dNone"
                        >
                          10
                        </button>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* ================= TABLE ================= */}
            <div className="col-md-12 col-12">

              <div className="card mb-4 table-container">

                <div className="card-body">

                  <div className="table-responsive-sm">

                    <table className="table table-hover fw-bold">

                      <thead>

                        <tr>

                          <th scope="col">
                            #
                          </th>

                          <th scope="col">
                            Mijoz
                          </th>

                          <th scope="col">
                            Qarz
                          </th>

                          <th scope="col">
                            Oxirgi sotuv
                          </th>

                          <th scope="col">
                            Ma'lumot
                          </th>

                          <th scope="col">
                            Bonus tezligi
                          </th>

                          <th scope="col">
                            Telefon raqamlari
                          </th>

                          <th scope="col">
                            Narx turi
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {clientsArray && clientsArray.length > 0 ? (

                          clientsArray.map((item, index) => (

                            <tr
                              key={item._id || item.id || index}
                              className="table-danger"
                            >

                              <th
                                scope="row"
                                className="py-4"
                              >
                                {index + 1}
                              </th>

                              <td className="py-4">
                                {item.client}
                              </td>

                              <td className="py-4">
                                {item.qarz || ""}
                              </td>

                              <td className="py-4">
                                {item.oxirgiSotuv || ""}
                              </td>

                              <td className="py-4">
                                {item.data}
                              </td>

                              <td className="py-4">
                                {item.percentage}
                              </td>

                              <td className="py-4">
                                {item.tel}
                              </td>

                              <td className="py-4">
                                {item.price}
                              </td>

                            </tr>

                          ))

                        ) : (

                          <tr>

                            <td
                              colSpan="8"
                              className="text-center py-4"
                            >
                              Mijozlar mavjud emas
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
      </div>
    </>
  );
}

export default ClientList;