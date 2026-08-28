import React, { useState, useEffect,useRef } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import Dashboard from "./components/Dashboard";
import HomePage from "./components/HomePage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductDetail from "./components/product/ProductDetail";
import SalesList from "./components/sales/SalesList";
import axios from "axios";
import Login from "./components/Login";
import Register from "./components/Register";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import ClientTable from "./components/clients/ClientTable";
import Reports from "./components/reports/Reports";
import NotFound from "./NotFound";
import SuppliersList from "./components/suppliers/SuppliersList";
import ClientList from "./components/clients/ClientList";
import { saveData } from "./components/api";


function App() {
  const [showContent, setShowContent] = useState(true);
  const [value, setValue] = useState("");
  const [plasticValue, setPlasticValue] = useState("");
  const [clientData, setClientData] = useState([]);
  const [clientsArray, setClientsArray] = useState([]);
  const [salesOpenModal, setSalesOpenModal] = useState(false);
  const [totalValue, setTotalValue] = useState(0);
  const [allTotalValue, setAllTotalValue] = useState(0);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingSupplier, setLoadingSupplier] = useState(false);
  const [showModalForm, setShowModalForm] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [salesData, setSalesData] = useState({
    dataValue: getCurrentDate(),
    clientName: "",
    productPrice: "",
    workman: "",
    productNameValue: "",
    productNumber: "",
    saleUnit: "dona",
    creationDateTime: "",
  });
  const [inputValues, setInputValues] = useState({
    bankCard: 0,
    cashPayment: 0,
    bankTransfer: 0,
    otherMethods: 0,
    loyaltyCard: 0
  });

 
  const [salesArray, setSalesArray] = useState([]);
  const [productData, setProductData] = useState({
    productName: "",
    turkum: "",
    sotishNarxi: "",
    ulgurjiNarxi: "",
    sotibOlinganNarxi: "",
    olchovBirligi: "",
    oramlarNomi: "",
    oramlarSoni: "",
    donaPerOram: "1",
  });

  const [productArray, setProductArray] = useState([]);
  const [ saveSales, setSaveSales] = useState([])
   const [isLoggedIn, setIsLoggedIn] = useState(
  !!localStorage.getItem("token")
);

const [userInfo, setUserInfo] = useState({
  userId: localStorage.getItem("userId"),
  token: localStorage.getItem("token"),
});

  const onLogin = ({ token, userId }) => {
    setIsLoggedIn(true);
    setUserInfo({
      userId: userId,
      token: token,
    });
  };

 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");

  setIsLoggedIn(false);

  setUserInfo({
    userId: null,
    token: null,
  });
};

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (
      (name === "sotishNarxi" ||
        name === "oramlarSoni" ||
        name === "donaPerOram" ||
        name === "ulgurjiNarxi" ||
        name === "sotibOlinganNarxi") &&
      type === "text"
    ) {
      const formattedValue = value.replace(/[^\d]/g, "");

      setProductData((prevData) => ({ ...prevData, [name]: formattedValue }));
    } else {
      setProductData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const fetchProductData = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://https://savdo2026.onrender.com/api/products",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProductArray(response.data.products);
    setLoading(false);

  } catch (error) {
    console.error(
      "Error fetching products:",
      error.response?.data || error.message
    );
  }
};

 const fetchClients = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://https://savdo2026.onrender.com/api/getClients",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("CLIENTS:", response.data);

    if (response.status === 200) {
      setClientsArray(response.data.clients);
    }
  } catch (error) {
    console.error("Error in fetchClients:", error);
    console.error("Status:", error.response?.status);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
  }
};
 
 useEffect(() => {
  if (!isLoggedIn) return;

  fetchProductData();
  fetchClients();
}, [isLoggedIn]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setBtnLoading(true);
      const newProductData = {
        id: uuidv4(),
        ...productData,
      };
      await axios.post("http://https://savdo2026.onrender.com/api/products", newProductData);

      setProductData({
        productName: "",
        turkum: "",
        sotishNarxi: "",
        ulgurjiNarxi: "",
        sotibOlinganNarxi: "",
        olchovBirligi: "",
        oramlarNomi: "",
        oramlarSoni: "",
        donaPerOram: "1",
      });
      setShowModal(false);
      fetchProductData();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalesData((prevData) => ({ ...prevData, [name]: value }));
  };

  useEffect(() => {
    const quantity = Number(salesData.productNumber) || 0;
    const price = Number(salesData.productPrice) || 0;
    setTotalValue(quantity * price);
  }, [salesData.productNumber, salesData.productPrice]);

  const calculateTotalValue = (item) => {
    return Number(item.productNumber) * Number(item.productPrice);
  };

  useEffect(() => {
    const newTotalValue = salesArray.reduce(
      (total, salesItem) => total + calculateTotalValue(salesItem),
      0
    );
    setAllTotalValue(newTotalValue);
  }, [salesArray]);

 
 // =====================================================
// handleSubmit - MAHSULOT QO'SHISH
// =====================================================

const handleSalesModal = () => {
  setSalesOpenModal(true);
};
 // ✅ QO'SHING:
  const handleCloseModal = () => {
    setSalesOpenModal(false);
  };

  // ✅ QO'SHING:
  const resetSalesArray = () => {
    setSalesArray([]);
  };

  // ✅ QO'SHING:
  const handleClose = () => {
    handleCloseModal();
    resetSalesArray();
  };


    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const {
      productNameValue,
      productNumber,
      productPrice,
      saleUnit,
    } = salesData;

    const quantity = Number(productNumber) || 0;

    if (!productNameValue || quantity <= 0) {
      alert("Iltimos, mahsulot va to'g'ri sonni kiriting!");
      return;
    }

    const product = productArray.find(
      (item) => item.productName === productNameValue
    );

    if (!product) {
      alert("Mahsulot topilmadi!");
      return;
    }

    // 1 o'ramdagi miqdor
    const donaPerOram = Math.max(
      1,
      Number(product.donaPerOram) || 1
    );

    // Sotuv birligi
    const saleUnitValue =
      saleUnit === "quti" ? "quti" : "dona";

    // Haqiqiy sotilayotgan miqdor
    const stockQuantity =
      saleUnitValue === "quti"
        ? quantity * donaPerOram
        : quantity;

    // Ombordagi qoldiq
    const currentStockDona =
      product.qoldiqDona !== undefined &&
      product.qoldiqDona !== null
        ? Number(product.qoldiqDona)
        : (Number(product.qoldiq) || 0) * donaPerOram;

    // Omborda yetarlimi?
    if (stockQuantity > currentStockDona) {
      const availableQuti = Math.floor(
        currentStockDona / donaPerOram
      );

      const availableDona =
        currentStockDona % donaPerOram;

      alert(
        `Omborda yetarli mahsulot yo'q.\n\n` +
        `Qoldiq: ${availableQuti} ${product.oramlarNomi || "quti"} ` +
        `${availableDona} ${product.olchovBirligi || "dona"}`
      );

      return;
    }

    // Sotuvni vaqtincha salesArray ga qo'shamiz
    const newSales = {
      id: uuidv4(),

      creationDateTime: new Date().toISOString(),

      productNameValue,

      // Foydalanuvchi kiritgan son
      productNumber: quantity,

      // dona yoki quti
      saleUnit: saleUnitValue,

      // 1 o'ramdagi miqdor
      donaPerOram,

      // Ombordan haqiqiy ayriladigan miqdor
      stockQuantity,

      productPrice: Number(productPrice) || 0,

      totalValue:
        quantity * (Number(productPrice) || 0),

      dataValue:
        salesData.dataValue || getCurrentDate(),

      clientName:
        salesData.clientName || "",

      workman:
        salesData.workman || "",
    };

    setSalesArray((prev) => [
      ...prev,
      newSales,
    ]);

    // Formani tozalash
    setSalesData((prevData) => ({
      ...prevData,

      id: uuidv4(),

      productPrice: "",
      productNameValue: "",
      productNumber: "",

      saleUnit: "dona",

      creationDateTime: "",
    }));



  } catch (error) {
    console.error(
      "❌ handleSubmit xatoligi:",
      error
    );

    alert(
      "Mahsulot qo'shishda xatolik yuz berdi!"
    );
  }
};


// =====================================================
// handleSave - SAVDONI SAQLASH (QARZGA YOKI TO'LOV BILAN)
// =====================================================

const handleSave = async () => {
  try {
    // =====================================================
    // 1. salesArray ni tekshirish
    // =====================================================

    console.log("📦 handleSave - salesArray:", salesArray);
    console.log("📦 handleSave - salesArray uzunligi:", salesArray.length);

    if (!salesArray || salesArray.length === 0) {
      alert("Hech qanday mahsulot qo'shilmagan!");
      return;
    }

    if (!salesData.clientName) {
      alert("Iltimos, mijozni tanlang!");
      return;
    }

    // =====================================================
    // 2. HAR BIR MAHSULOTNI HISOBLASH
    // =====================================================

    const updatedSalesArray = salesArray.map((item) => {
      const productPrice = parseFloat(item.productPrice) || 0;
      const productNumber = parseFloat(item.productNumber) || 0;
      const totalValue = productPrice * productNumber;

      return {
        ...item,
        productPrice,
        productNumber,
        totalValue,
        saleUnit: item.saleUnit === "quti" ? "quti" : "dona",
        donaPerOram: Number(item.donaPerOram) || 1,
        stockQuantity: Number(item.stockQuantity) || productNumber,
      };
    });

    console.log("🔥 UPDATED SALES ARRAY:", updatedSalesArray);

    // =====================================================
    // 3. JAMI SOTUV NARXINI HISOBLASH
    // =====================================================

    const totalSaleValue = updatedSalesArray.reduce(
      (total, item) => total + (parseFloat(item.totalValue) || 0),
      0
    );

    console.log("💰 JAMI SOTUV NARXI:", totalSaleValue);

    // =====================================================
    // 4. TO'LOVLARNI OLISH
    // =====================================================

    const cashValue = parseFloat(value) || 0;
    const cardValue = parseFloat(plasticValue) || 0;
    const totalPaid = cashValue + cardValue;

    console.log("💵 NAQD:", cashValue);
    console.log("💳 PLASTIK:", cardValue);
    console.log("💰 JAMI TO'LOV:", totalPaid);

    // =====================================================
    // 5. QARZNI HISOBLASH
    // =====================================================

    const debtValue = Math.max(0, totalSaleValue - totalPaid);
    console.log("🔴 QARZ:", debtValue);

    // =====================================================
    // 6. MAHSULOT NOMLARINI ARRAY SIFATIDA OLISH
    // =====================================================

    const productNames = updatedSalesArray.map(item => item.productNameValue);
    const totalProductNumber = updatedSalesArray.reduce(
      (sum, item) => sum + (parseFloat(item.productNumber) || 0), 
      0
    );

    console.log("📦 MAHSULOT NOMLARI (ARRAY):", productNames);
    console.log("🔢 JAMI MAHSULOT SONI:", totalProductNumber);

    // =====================================================
    // 7. SALES OBJECT YARATISH
    // =====================================================

    const combineSalesObj = {
      id: Date.now().toString(),
      clientName: salesData.clientName || "",
      dataValue: salesData.dataValue || getCurrentDate(),
      creationDateTime: new Date().toISOString(),
      workman: salesData.workman || "",
      
      // ✅ MAHSULOT NOMLARI - ARRAY
      productNameValue: productNames,
      
      // Jami mahsulot soni
      productNumber: totalProductNumber,
      
      // Jami narx
      productPrice: totalSaleValue,
      totalValue: totalSaleValue,
      
      // To'lovlar
      clientValue: cashValue,
      plasticValue: cardValue,
      selectedValue: totalPaid,
      
      // Qarz
      debtValue: debtValue,
      
      // ✅ HAR BIR MAHSULOT TAFSILOTLARI
      products: updatedSalesArray.map(item => ({
        productName: item.productNameValue,
        productNumber: parseFloat(item.productNumber) || 0,
        productPrice: parseFloat(item.productPrice) || 0,
        totalPrice: (parseFloat(item.productNumber) || 0) * (parseFloat(item.productPrice) || 0),
        saleUnit: item.saleUnit === "quti" ? "quti" : "dona",
        donaPerOram: Number(item.donaPerOram) || 1,
        stockQuantity: Number(item.stockQuantity) || 0,
      })),
      
      // ✅ TO'LIQ SALES ARRAY
      salesArray: updatedSalesArray,
    };

    console.log("==========================================");
    console.log("🔥 SAQLANADIGAN SALE OBJECT:");
    console.log(combineSalesObj);
    console.log("==========================================");

    // =====================================================
    // 8. SERVERGA SAQLASH
    // =====================================================

    const updatedSaveSales = await saveData(combineSalesObj);

    console.log("✅ SERVERDAN QAYTGAN MA'LUMOT:", updatedSaveSales);

    // =====================================================
    // 9. FRONTEND STATE YANGILASH
    // =====================================================

    const savedSale = updatedSaveSales?.savedData || 
                      updatedSaveSales?.data || 
                      updatedSaveSales || 
                      combineSalesObj;

    setSaveSales([savedSale, ...saveSales]);

    // =====================================================
    // 10. LOCALSTORAGE GA SAQLASH
    // =====================================================

    const newSaveSales = [savedSale, ...saveSales];
    localStorage.setItem("saveSales", JSON.stringify(newSaveSales));

    // =====================================================
    // 11. salesArray ni TOZALASH
    // =====================================================

    setSalesArray([]);

    // =====================================================
    // 12. MA'LUMOTLARNI QAYTA OLISH
    // =====================================================

    if (handleGet) {
      await handleGet();
      console.log("✅ handleGet bajarildi");
    }

    // =====================================================
    // 13. FORMNI YOPISH
    // =====================================================

    handleClose();

    // =====================================================
    // 14. FORMNI TOZALASH
    // =====================================================

    setSalesData(() => ({
      dataValue: getCurrentDate(),
      productPrice: "",
      clientName: "",
      workman: "",
      productNameValue: "",
      productNumber: "",
      saleUnit: "dona",
      creationDateTime: "",
    }));

    if (setValue) {
      setValue("");
    }

    if (setPlasticValue) {
      setPlasticValue("");
    }

    console.log("✅ SAVDO MUVAFFAQIYATLI SAQLANDI");

  } catch (error) {
    console.error("❌ SAVDONI SAQLASHDA XATO:", error);
    alert("Saqlashda xatolik yuz berdi!");
  }
};


  const handleGet = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      "http://https://savdo2026.onrender.com/api/getList",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const retrievedData = response.data;

    console.log("Data retrieved successfully:", retrievedData);

    setSaveSales(
      Array.isArray(retrievedData.salesArray)
        ? retrievedData.salesArray
        : []
    );

  } catch (error) {
    console.error(
      "Error fetching data:",
      error.response?.data || error.message
    );
  }
};

  useEffect(() => {
  if (!isLoggedIn) return;

  handleGet();
}, [isLoggedIn]);


  /////////////////////////////////////

  useEffect(() => {
    const savedClientArray =
      JSON.parse(localStorage.getItem("clientData")) || [];
    setClientData((prevClientData) => {
      if (prevClientData !== savedClientArray) {
        console.log("Previous Client Data:", prevClientData);
      }
      return savedClientArray;
    });
  }, []);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://https://savdo2026.onrender.com/api/clients");
      setClientData(response.data.clients);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, []);

 
  
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://https://savdo2026.onrender.com/api/client/${id}`
      );
      console.log('Axios response:', response);
      if (response.data.success) {
        const updatedArray = saveSales.filter((item) => item.id !== id);
        console.log(updatedArray);
        setSaveSales(updatedArray);
        fetchClientData();
        toast.success("Mijozni muvafaqqiyatli o'chirildi.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Error in handleDelete:", error);

      toast.error("Mijozni oʻchirishda xatolik yuz berdi.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handlerShowContent = () => {
    setShowContent((prev) => !prev);
  };
  ///////////////////
 const fetchSuppliers = async () => {
  try {
    setLoadingSupplier(true);

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Token topilmadi!");
      return;
    }

    const response = await axios.get(
      "http://https://savdo2026.onrender.com/api/suppliers",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSuppliers(response.data.suppliers);

  } catch (error) {
    console.error(
      "Error fetching suppliers:",
      error.response?.data || error.message
    );
  } finally {
    setLoadingSupplier(false);
  }
};
 useEffect(() => {
  if (!isLoggedIn) return;

  fetchSuppliers();
}, [isLoggedIn]);

  const handleSuppliersSubmit = async (e) => {
  e.preventDefault();

  const supplierData = {
    id: uuidv4(),
    name: e.target.elements.supplierName.value,
    debt: e.target.elements.debt.value,
    information: e.target.elements.information.value,
    phoneNumber: e.target.elements.phoneNumber.value,
  };

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      "http://https://savdo2026.onrender.com/api/suppliers",
      supplierData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setSuppliers((prev) => [...prev, response.data]);

    await fetchSuppliers();

    setShowModalForm(false);

  } catch (error) {
    console.error(
      "Error while making POST request:",
      error.response?.data || error.message
    );
  }
};

  return (
    <BrowserRouter>
    
         {!isLoggedIn ? (
    <>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Login onLogin={onLogin} />} />
      </Routes>
    </>
        ) : ( 
          <>
            <Navbar handlerShowContent={handlerShowContent}  handleLogout={handleLogout}/>
          <Dashboard showContent={showContent} />
          <Routes>
            <Route
              path="/"
              element={
                <HomePage saveSales={saveSales} suppliers={suppliers} />
              }
            />
            <Route
              path="/1"
              element={
                <ProductDetail
                  handleFormSubmit={handleFormSubmit}
                  btnLoading={btnLoading}
                  handleInputChange={handleInputChange}
                  productArray={productArray}
                  productData={productData}
                  showModal={showModal}
                  setShowModal={setShowModal}
                  setProductArray={setProductArray}
                  loading={loading}
                  fetchProductData={fetchProductData}
                  salesArray={salesArray}
                />
              }
            />
            <Route
              path="/2"
              element={
                <SalesList
                  salesArray={salesArray}
                  handleSalesModal={handleSalesModal}
                  clientData={clientData}
                  setClientData={setClientData}
                  salesOpenModal={salesOpenModal}
                  handleCloseModal={handleCloseModal}
                  handleSubmit={handleSubmit}
                  salesData={salesData}
                  handleChange={handleChange}
                  totalValue={totalValue}
                  allTotalValue={allTotalValue}
                  showClientModal={showClientModal}
                  setShowClientModal={setShowClientModal}
                  setSalesData={setSalesData}
                  setSalesArray={setSalesArray}
                  value={value}
                  setValue={setValue}
                  plasticValue={plasticValue}
                  setPlasticValue={setPlasticValue}
                  handleDelete={handleDelete}
                  productArray={productArray}
                  loading={loading}
                  fetchProductData={fetchProductData}
                  handleFormSubmit={handleFormSubmit}
                  handleInputChange={handleInputChange}
                  productData={productData}
                  btnLoading={btnLoading}
                  clientsArray={clientsArray}
                  setClientsArray={setClientsArray}
                  setSaveSales={setSaveSales}
                  saveSales={saveSales}
                  getCurrentDate={getCurrentDate}
                  inputValues={inputValues}
                  setInputValues={setInputValues}
                  handleSave={handleSave}
                  handleClose={handleClose}
                  resetSalesArray={resetSalesArray}
                  handleGet={handleGet}
                />
              }
            />
             <Route
              path="products/8"
              element={<Reports  saveSales={saveSales}/>}
            /> 
            <Route path="products/13" element={<ClientTable />} />
            <Route
              path="products/9"
              element={
                <SuppliersList
                  suppliers={suppliers}
                  setSuppliers={setSuppliers}
                  handleSuppliersSubmit={handleSuppliersSubmit}
                  loadingSupplier={loadingSupplier}
                  showModalForm={showModalForm}
                  setShowModalForm={setShowModalForm}
                  fetchSuppliers={fetchSuppliers}
                />
              }
            />
            <Route
              path="products/10"
              element={
                <ClientList clientsArray={clientsArray}  setClientsArray={setClientsArray} />
              }
            />
            <Route path="*" element={<NotFound />} />
           
                   </Routes>
        </>
      )}
    </BrowserRouter>
  
  );
}

export default App;