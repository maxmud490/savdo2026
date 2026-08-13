import { useState } from "react";
import './ClientTable.css'

function ClientTable() {
    const [isModalOpen, setModalOpen] = useState(false);

  const addHandler = () => {
    // Open the modal
    setModalOpen(true);
  };

  const closeModal = () => {
    // Close the modal
    setModalOpen(false);
  };
  return (
    <>
    <div className="modal_container">
    <div className="modal_content p-4">
        <div className="row">
          <div className="col col-12">
            <div className="d-flex align-center justify-between">
              <h1>Mijozlar ro'yxati</h1>
              <div className="top-right-button-container">
                <button
                  type="button"
                  className="btn top-right-button btn-orange btn-sm"
                  onClick={addHandler}
                >
                  <span>Yangi mijoz qo'shish</span>
                </button>
                <button
                  type="button"
                  className="btn top-right-button btn-secondary btn-sm"
                >
                  <span>Mijozlarni ulash</span>
                </button>
                <button
                  type="button"
                  className="btn top-right-button btn-secondary btn-sm"
                >
                  <i className="simple-icon-cloud-download"></i>
                  Excel-da yuklab olish
                </button>
              </div>
            </div>
          </div>
          <div className="col col-12">
            <div className="row">
              <div className="col-6">
                <div className="d-flex mr-auto mt-5">
                  <div className=" mr-2 d-block my-2  w-sm-100 btn-group"></div>
                  <div className="search-sm mr-1 my-2">
                    <input
                      type="search"
                      className="form-control form-control-dark rounded-pill"
                      placeholder=" Qidiruv..."
                    />
                  </div>
                </div>
              </div>
              <div className="col-6">
                <div className="d-flex align-items-center justify-end  mt-5">
                  <div className="my-2 mr-1">
                    <label className="pr-2">Korsatish:</label>
                    <div className="d-inline-block btn-group">
                      <button className="btn btn-outline-warning rounded-50 btn-xs">
                        10
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <table className="table table-success table-striped">
        <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Mijoz</th>
      <th scope="col">Qarz</th>
      <th scope="col">Oxirgi sotuv</th>
      <th scope="col">Malumot</th>
      <th scope="col">Telefon raqamlar</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
      <td>@mdo</td>
      <td>@mdo</td>
    </tr>
  </tbody>
       </table>
      </div>
    </div>
    {isModalOpen && (
       
          <div className="modal_container">
             <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title">Modal title</h5>
        <button
        onClick={closeModal}
        type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">X</button>
      </div>
      <div className="modal-body">
        <p>Modal body text goes here.</p>
      </div>
      <div className="modal-footer">
        <button 
         onClick={closeModal}
         type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
 </div>
       
      )}
    </>
  );
}

export default ClientTable;
