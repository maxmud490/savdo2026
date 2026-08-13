import { useState } from "react";
import axios from "axios";

function SalesPaymet({
  capitalizeFirstLetter,
  formatLargeNumber,
  clientById,
  saveSales,
  setSaveSales,
  handleGet,
  setSalesPaymet,
}) {
  const [inputValues, setInputValues] = useState({
    cashPayment: 0,
    bankCard: 0,
    bankTransfer: 0,
    otherMethods: 0,
    loyaltyCard: 0,
  });

  // =====================================================
  // JAMI SUMMA
  // =====================================================

  // ✅ totalValue yoki productPrice dan olish
  const totalPrice = parseFloat(clientById?.totalValue) || 
                     parseFloat(clientById?.productPrice) || 0;

  // ✅ Barcha to'lov turlari
  const totalPayment = 
    (parseFloat(inputValues.cashPayment) || 0) +
    (parseFloat(inputValues.bankCard) || 0) +
    (parseFloat(inputValues.bankTransfer) || 0) +
    (parseFloat(inputValues.otherMethods) || 0) +
    (parseFloat(inputValues.loyaltyCard) || 0);

  const remainingDebt = totalPrice - totalPayment;
  const isPaid = remainingDebt <= 0;

  // =====================================================
  // INPUT O'ZGARGANDA
  // =====================================================

  const handleInputChange = (fieldName, event) => {
    const value = event.target.value.replace(/[^\d]/g, "");
    setInputValues({
      ...inputValues,
      [fieldName]: parseFloat(value) || 0,
    });
  };

  // =====================================================
  // "UMUMIY MIQDOR" TUGMASI
  // =====================================================

  const handleSpanClick = (fieldName) => {
    const otherPayments = Object.keys(inputValues)
      .filter((key) => key !== fieldName)
      .reduce((sum, key) => sum + (parseFloat(inputValues[key]) || 0), 0);

    const remaining = totalPrice - otherPayments;
    
    setInputValues((prev) => ({
      ...prev,
      [fieldName]: remaining > 0 ? remaining : 0,
    }));
  };

  // =====================================================
  // TO'LOVNI TASDIQLASH
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (totalPayment === 0) {
      alert("Iltimos, to'lov summasini kiriting!");
      return;
    }

    if (totalPayment > totalPrice) {
      alert(`To'lov summasi jami summadan (${formatLargeNumber(totalPrice)} so'm) katta bo'lishi mumkin emas!`);
      return;
    }

    const confirmPayment = window.confirm(
      `Mijoz: ${clientById?.clientName || "Noma'lum"}\n` +
      `Jami summa: ${formatLargeNumber(totalPrice)} so'm\n` +
      `To'lov: ${formatLargeNumber(totalPayment)} so'm\n` +
      `Qarz: ${formatLargeNumber(remainingDebt > 0 ? remainingDebt : 0)} so'm\n\n` +
      `To'lovni tasdiqlaysizmi?`
    );

    if (!confirmPayment) return;

    try {
      // =====================================================
      // ✅ MA'LUMOTLARNI YANGILASH - TO'LIQ
      // =====================================================

      const updatedSale = {
        ...clientById,
        // ✅ To'lov ma'lumotlari
        selectedValue: totalPayment,
        cashPayment: parseFloat(inputValues.cashPayment) || 0,
        bankCard: parseFloat(inputValues.bankCard) || 0,
        bankTransfer: parseFloat(inputValues.bankTransfer) || 0,
        otherMethods: parseFloat(inputValues.otherMethods) || 0,
        loyaltyCard: parseFloat(inputValues.loyaltyCard) || 0,
        
        // ✅ clientValue = Naqd to'lov
        clientValue: parseFloat(inputValues.cashPayment) || 0,
        
        // ✅ plasticValue = Bank kartasi + Bank o'tkazmasi
        plasticValue: 
          (parseFloat(inputValues.bankCard) || 0) +
          (parseFloat(inputValues.bankTransfer) || 0),
        
        // ✅ Qarz (agar to'lov yetarli bo'lmasa)
        debtValue: remainingDebt > 0 ? remainingDebt : 0,
        
        // ✅ To'langan holati
        isPaid: isPaid,
        paymentDate: new Date().toISOString(),
        
        // ✅ Mahsulot ma'lumotlari o'zgarmasligi uchun
        productNameValue: clientById?.productNameValue || "",
        productNumber: clientById?.productNumber || 0,
        productPrice: clientById?.productPrice || 0,
        totalValue: clientById?.totalValue || totalPrice,
        dataValue: clientById?.dataValue || "",
        creationDateTime: clientById?.creationDateTime || "",
        workman: clientById?.workman || "",
      };

      console.log("✅ Yangilangan ma'lumotlar:", updatedSale);

      // =====================================================
      // API GA YUBORISH
      // =====================================================

      await axios.post(
        `http://localhost:5000/api/updateSelectedValue/${clientById.id}`,
        {
          selectedValue: totalPayment,
          cashPayment: inputValues.cashPayment,
          bankCard: inputValues.bankCard,
          bankTransfer: inputValues.bankTransfer,
          otherMethods: inputValues.otherMethods,
          loyaltyCard: inputValues.loyaltyCard,
          debtValue: remainingDebt > 0 ? remainingDebt : 0,
          isPaid: isPaid,
        }
      );

      // =====================================================
      // SAVESALES NI YANGILASH
      // =====================================================

      const updatedSales = saveSales.map((item) => {
        if (item.id === clientById.id || item._id === clientById._id) {
          return updatedSale;
        }
        return item;
      });

      setSaveSales(updatedSales);

      // =====================================================
      // LOCALSTORAGE GA SAQLASH
      // =====================================================

      localStorage.setItem("saveSales", JSON.stringify(updatedSales));

      // =====================================================
      // MA'LUMOTLARNI QAYTA YUKLASH
      // =====================================================

      if (handleGet) {
        await handleGet();
      }

      // =====================================================
      // MODALNI YOPISH
      // =====================================================

      setSalesPaymet(false);
      alert("✅ To'lov muvaffaqiyatli tasdiqlandi!");

    } catch (error) {
      console.error("❌ To'lovni tasdiqlashda xatolik:", error);
      alert("❌ To'lovni tasdiqlashda xatolik yuz berdi!");
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="modal_container">
      <div className="modal_content pb-5">
        {/* Header */}
        <div className="row mt-3">
          <div className="col-md-6 col-6">
            {clientById && (
              <h1 className="fs-5">
                {capitalizeFirstLetter(clientById.clientName)}{" "}
                <span>
                  Jami: {formatLargeNumber(totalPrice)} so'm
                </span>
                <span className="ms-3">
                  Qarz:{" "}
                  <span className={remainingDebt > 0 ? "text-danger" : "text-success"}>
                    {formatLargeNumber(remainingDebt > 0 ? remainingDebt : 0)} so'm
                  </span>
                </span>
              </h1>
            )}
          </div>
          <div
            onClick={() => setSalesPaymet(false)}
            className="col-md-6 col-6 text-right cursor-pointer fs-4"
          >
            ✕
          </div>
        </div>

        {/* Form */}
        <div className="row mt-3">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 col-12">
                {/* Bank kartasi */}
                <label className="form-label">Bank kartasi orqali to'lov</label>
                <div className="input-group mb-3">
                  <input
                    value={inputValues.bankCard || ""}
                    onChange={(e) => handleInputChange("bankCard", e)}
                    type="text"
                    className="form-control-sm form-control shadow-none py-2"
                    placeholder="Summani kiriting"
                  />
                  <span
                    onClick={() => handleSpanClick("bankCard")}
                    className="input-group-text bg-orange text-white"
                    style={{ cursor: "pointer", borderRadius: "0 20px 20px 0" }}
                  >
                    umumiy miqdor
                  </span>
                </div>

                {/* Sodiqlik kartasi */}
                <label className="form-label">Sodiqlik kartasi</label>
                <div className="input-group mb-3">
                  <input
                    value={inputValues.loyaltyCard || ""}
                    onChange={(e) => handleInputChange("loyaltyCard", e)}
                    type="text"
                    className="form-control-sm form-control shadow-none py-2"
                    placeholder="Summani kiriting"
                  />
                  <span
                    onClick={() => handleSpanClick("loyaltyCard")}
                    className="input-group-text bg-orange text-white"
                    style={{ cursor: "pointer", borderRadius: "0 20px 20px 0" }}
                  >
                    umumiy miqdor
                  </span>
                </div>
              </div>

              <div className="col-md-6 col-12">
                {/* Naqd to'lov */}
                <label className="form-label">Naqd to'lov</label>
                <div className="input-group mb-3">
                  <input
                    value={inputValues.cashPayment || ""}
                    onChange={(e) => handleInputChange("cashPayment", e)}
                    type="text"
                    className="form-control-sm form-control shadow-none py-2"
                    placeholder="Summani kiriting"
                  />
                  <span
                    onClick={() => handleSpanClick("cashPayment")}
                    className="input-group-text bg-orange text-white"
                    style={{ cursor: "pointer", borderRadius: "0 20px 20px 0" }}
                  >
                    umumiy miqdor
                  </span>
                </div>

                {/* Bank o'tkazmasi */}
                <label className="form-label">Bank o'tkazmasi</label>
                <div className="input-group mb-3">
                  <input
                    value={inputValues.bankTransfer || ""}
                    onChange={(e) => handleInputChange("bankTransfer", e)}
                    type="text"
                    className="form-control-sm form-control shadow-none py-2"
                    placeholder="Summani kiriting"
                  />
                  <span
                    onClick={() => handleSpanClick("bankTransfer")}
                    className="input-group-text bg-orange text-white"
                    style={{ cursor: "pointer", borderRadius: "0 20px 20px 0" }}
                  >
                    umumiy miqdor
                  </span>
                </div>
              </div>
            </div>

            {/* Jami to'lov va qarz */}
            <div className="row mt-3">
              <div className="col-12">
                <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                  <div>
                    <strong>Jami to'lov:</strong>
                    <span className="ms-2 text-primary fs-5">
                      {formatLargeNumber(totalPayment)} so'm
                    </span>
                  </div>
                  <div>
                    <strong>Qarz:</strong>
                    <span className={`ms-2 fs-5 ${remainingDebt > 0 ? "text-danger" : "text-success"}`}>
                      {formatLargeNumber(remainingDebt > 0 ? remainingDebt : 0)} so'm
                    </span>
                    {remainingDebt > 0 ? (
                      <span className="badge bg-danger ms-2">⚠️ Qarz</span>
                    ) : (
                      <span className="badge bg-success ms-2">✅ To'langan</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tugmalar */}
            <div className="row mt-3">
              <div className="col-12 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSalesPaymet(false)}
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={totalPayment === 0}
                >
                  💳 Mijoz to'lovi
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SalesPaymet;