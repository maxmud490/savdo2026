import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import LoaderButton from "../LoaderButton";

function AddClientModal({ clientsArray, setClientsArray }) {
  const [formData, setFormData] = useState({
    client: "",
    data: "",
    percentage: "0",
    tel: "+998",
    price: "Belgilanmagan",
  });
  
  const [modalVisible, setModalVisible] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false)
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    const newClient = { id: uuidv4(), ...formData };

    try {
        setBtnLoading(true)
      const token = localStorage.getItem("token");

const response = await axios.post(
  "http://https://savdo2026.onrender.com/api/addClients",
  newClient,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
      if (response.status === 200 || response.status === 201) {
        console.log("Client data successfully submitted to the server");
      } else {
        console.error("Failed to submit client data to the server");
      }
 
      setClientsArray((prevArray) => [newClient, ...prevArray]);

      setFormData({
        client: "",
        data: "",
        percentage: "0",
        tel: "+998",
        price: "Belgilanmagan",
      });

      // Close the modal
      setModalVisible(false);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
    finally{
        setBtnLoading(false)
    }
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };

  if (!modalVisible) {
    return null;
  }
 
  return (
    <div className="modal_container">
      <div className="row">
        <div className="col-4 offset-4">
          <div className="bg-white p-4 mt-5">
            <div className="d-flex justify-between">
              <div>
                <h2 className="fs-5 text-center mb-3">Yangi mijoz qo'shish</h2>
              </div>
              <div
              onClick={handleCloseModal}
              className="cursor-pointer fs-5">X</div>
            </div>
            <hr />
            <form onSubmit={handleSubmit}>
              <div className="mb-3 mt-5">
                <label htmlFor="client" className="form-label">
                  Mijoz *
                </label>
                <input
                  id="client"
                  type="text"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="form-control bg-opacity-0 shadow-none product-input py-2"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="data">Ma'lumot</label>
                <textarea
                  id="data"
                  value={formData.data}
                  onChange={handleInputChange}
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
                  type="text"
                  value={formData.percentage}
                  onChange={handleInputChange}
                  className="form-control bg-opacity-0 shadow-none product-input py-2"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                  Telefon raqami
                </label>
                <input
                  id="tel"
                  type="tel"
                  value={formData.tel}
                  onChange={handleInputChange}
                  className="form-control bg-opacity-0 shadow-none product-input py-2"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Narx turi
                </label>
                <select
                  id="price"
                  value={formData.price}
                  onChange={handleInputChange}
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
                className="btn w-xs-100 my-2 btn-red btn-sm px-3 mx-2">
                  Yopish
                </button>
                <button
                  className="btn w-xs-100 my-2 btn-orange btn-sm px-3"
                  type="submit"
                  disabled={btnLoading}
                >
                    {btnLoading ? (
                        <LoaderButton/>
                    ): (
                        <span className="w-min-10">Qoshish</span>
                    )}
                 
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddClientModal;
