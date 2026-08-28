import "./ProductDetail.css";
import ModalComponent from "./ModalComponent";
import ProductHeader from "./ProductHeader";
import ProductTable from "./ProductTable";
import axios from 'axios'
import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import PrintableProductList from "./PrintableProductList";

function ProductDetail({
  handleFormSubmit,
  handleInputChange,
  productArray,
  productData,
  setProductArray,
  showModal,
  setShowModal,
  loading,
  fetchProductData,
  btnLoading,
  salesArray,  // ✅ salesArray props
}) {

  const [searchProduct, setSearchProduct] = useState("");
  const [filteredProduct, setFilteredProduct] = useState([]); // ✅ STATE QO'SHILDI

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // ✅ useEffect - salesArray va productArray o'zgarganda qayta hisoblaydi
  useEffect(() => {
    if (productArray && productArray.length > 0) {
      const filtered = productArray.filter((product) =>
        product.productName?.toUpperCase().includes(searchProduct.toUpperCase())
      );
      setFilteredProduct(filtered);
    } else {
      setFilteredProduct([]);
    }
  }, [productArray, searchProduct]); // ✅ salesArray qo'shilmadi, lekin muhim emas

  // ✅ salesArray o'zgarganda ham qayta render bo'lishi uchun
  useEffect(() => {
    // Bu useEffect faqat salesArray o'zgarganda ishlaydi
    // va TableBody ga yangi salesArray yuboriladi
    console.log("📦 salesArray o'zgardi:", salesArray);
  }, [salesArray]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const calculateTotalPurchasedPrice = () => {
    return productArray.reduce(
      (total, product) => total + parseInt((product.sotibOlinganNarxi || 0)),
      0
    );
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`https://savdo2026.onrender.com/api/products/${id}`);

      const updatedArray = productArray.filter(
        (item) => (item._id || item.id) !== id
      );

      setProductArray(updatedArray);
      localStorage.setItem("productArray", JSON.stringify(updatedArray));

      console.log("✅ O'chirildi:", id);
      console.log("📦 Qolgan mahsulotlar:", updatedArray);

    } catch (error) {
      console.error("❌ Error in deleteItem:", error);
    }
  };

  // =====================================================
  // ✅ DEBUG - salesArray ni tekshirish
  // =====================================================

  console.log("📦 ProductDetail - salesArray:", salesArray);
  console.log("📦 ProductDetail - productArray:", productArray);

  return (
    <>
      {handlePrint && (
        <div className="card mt-4 p-5 d-none">
          <div className="row mb-3">
            <PrintableProductList
              ref={componentRef}
              productArray={productArray}
            />
          </div>
        </div>
      )}

      <div className="container">
        <main className="main-content">
          <ProductHeader
            productArray={productArray}
            setSearchProduct={setSearchProduct}
            searchProduct={searchProduct}
            OpenModal={handleOpenModal}
            title="Mahsulotlar ro'yxati"
            excelButtonLabel="Mahsulotlarni Exceldan qo'shish"
            filterButtonLabel="Filtr"
            loadExcelButtonLabel="Excel-da yuklab olish"
            addProduct="Yangi mahsulot qo'shish"
            itemTable="Mahsulotlar ro'yxati"
            handlePrint={handlePrint}
          />

          {showModal && (
            <ModalComponent
              handleCloseModal={handleCloseModal}
              handleInputChange={handleInputChange}
              handleFormSubmit={handleFormSubmit}
              btnLoading={btnLoading}
              productData={productData}
              productArray={productArray}
            />
          )}

          <ProductTable
            productArray={productArray}
            totalPurchasedPrice={calculateTotalPurchasedPrice()}
            deleteItem={deleteItem}
            loading={loading}
            fetchProductData={fetchProductData}
            filteredProduct={filteredProduct}
            setSearchProduct={setSearchProduct}
            salesArray={salesArray}  // ✅ salesArray yuborilmoqda
          />
        </main>
      </div>
    </>
  );
}

export default ProductDetail;