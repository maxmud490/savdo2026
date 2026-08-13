import React, { useState } from "react";

function EditClientModal({ handleCloseModal, handleSubmit, btnLoading }) {
  const [editedClient, setEditedClient] = useState({
    client: "",
    data: "",
    percentage: "",
    tel: "",
    price: "Belgilanmagan",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedClient((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = () => {
    // Implement your logic for editing client data
    // You can use the editedClient state to get the updated values
    console.log("Edited Client Data:", editedClient);
  };

  return (
    <div className="modal_container">
      <div className="row">
        <div className="col-4 offset-4">
          <div className="bg-white p-4 mt-5">
            <div className="d-flex justify-between">
              <div>
                <h2 className="fs-5 text-center mb-3">Mijozni tahrirlash</h2>
              </div>
              <div
                className="cursor-pointer fs-5"
                onClick={handleCloseModal}
              >
                X
              </div>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="mb-3 mt-5">
                <label htmlFor="client" className="form-label">
                  Mijoz *
                </label>
                <input
                  id="client"
                  name="client"
                  type="text"
                  value={editedClient.client}
                  onChange={handleChange}
                  className="form-control bg-opacity-0 shadow-none product-input py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="data">Ma'lumot</label>
                <textarea
                  id="data"
                  name="data"
                  value={editedClient.data}
                  onChange={handleChange}
                  className="form-control bg-opacity-0 shadow-none product-input py-2"
                  style={{ height: "50px" }}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="percentage" className="form-label">
                  Sodiqlik foizi
                </label>
                <input
                  id="percentage"
                  name="percentage"
                  type="text"
                  value={editedClient.percentage}
                  onChange={handleChange}
                  className="form-control bg-opacity-0 shadow-none product-input py-2"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                  Telefon raqami
                </label>
                <input
                  id="tel"
                  name="tel"
                  type="tel"
                  value={editedClient.tel}
                  onChange={handleChange}
                  className="form-control bg-opacity-0 shadow-none product-input py-2"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Narx turi
                </label>
                <select
                  id="price"
                  name="price"
                  value={editedClient.price}
                  onChange={handleChange}
                  className="form-select bg-opacity-0 shadow-none product-input py-2"
                >
                  <option value="Belgilanmagan">Belgilanmagan</option>
                  <option value="chakana narx">Chakana narx</option>
                  <option value="ulgurji narx">Ulgurji narx</option>
                </select>
              </div>
              <div className="d-flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="btn w-xs-100 my-2 btn-red btn-sm px-3 mx-2"
                >
                  Yopish
                </button>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="btn w-xs-100 my-2 btn-orange btn-sm px-3"
                  disabled={btnLoading}
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditClientModal;
