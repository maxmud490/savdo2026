import PropTypes from "prop-types";
import Loader from "../Loader";
import { useState, memo, useCallback } from "react";

function TableBody({
  productArray,
  openDeleteModal,
  loading,
  handleEditProduct,
  filteredProduct,
  salesArray,
}) {
  // =====================================================
  // KATTA SONLARNI FORMATLASH
  // =====================================================

  const formatLargeNumber = useCallback((number) => {
    if (number !== undefined && number !== null && number !== "") {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }
    return "";
  }, []);

  // =====================================================
  // PUL FORMATLASH
  // =====================================================

  const formatCurrency = useCallback(
    (number) => {
      if (number !== undefined && number !== null && number !== "") {
        return `${formatLargeNumber(number)} so'm`;
      }
      return "0 so'm";
    },
    [formatLargeNumber],
  );

  // =====================================================
  // DROPDOWN HOLATI
  // =====================================================

  const [openDropdownId, setOpenDropdownId] = useState(null);

  const toggleDropdown = useCallback((id) => {
    setOpenDropdownId((prev) => (prev === id ? null : id));
  }, []);

  // =====================================================
  // BIRINCHI HARFNI KATTA QILISH
  // =====================================================

  const capitalizeFirstLetter = useCallback((str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }, []);

  // =====================================================
  // QIYMAT BO'SH BO'LSA FALLBACK
  // =====================================================

  const getValueOrDefault = useCallback((value, fallback) => {
    if (value === undefined || value === null || value === "") {
      return fallback;
    }
    return value;
  }, []);

  // =====================================================
  // EDIT / DELETE
  // =====================================================

  const handleActionClick = useCallback(
    (productId, action) => {
      if (action === "edit") {
        handleEditProduct(productId);
      } else if (action === "delete") {
        openDeleteModal(productId);
      }
      setOpenDropdownId(null);
    },
    [handleEditProduct, openDeleteModal],
  );

  // =====================================================
  // ✅ SOTILGAN MAHSULOTLAR SONINI HISOBLASH
  // =====================================================

  const getSoldQuantity = useCallback(
    (productName) => {
      if (!salesArray || salesArray.length === 0) return 0;

      // salesArray dan shu mahsulot nomiga mos keladigan sotuvlarni topish
      const soldItems = salesArray.filter(
        (sale) => sale.productNameValue === productName,
      );

      // Jami sotilgan sonini hisoblash
      const totalSold = soldItems.reduce((sum, item) => {
        return sum + (parseFloat(item.productNumber) || 0);
      }, 0);

      return totalSold;
    },
    [salesArray],
  );

  // =====================================================
  // RENDER
  // =====================================================

  if (loading) {
    return (
      <tr>
        <td colSpan="13" className="text-center py-10">
          <Loader />
        </td>
      </tr>
    );
  }

  if (!filteredProduct || filteredProduct.length === 0) {
    return (
      <tr>
        <td colSpan="13" className="text-center py-10 text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <svg
              className="w-12 h-12 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <span>Mahsulot topilmadi</span>
          </div>
        </td>
      </tr>
    );
  }

  return filteredProduct.map((product, index) => {
    const productId = product._id || product.id;

    // Omborga kelib tushgan jami o'ramlar — O'ZGARMAYDI
    const originalQuantity = Number(product.oramlarSoni) || 0;

    // 1 o'ram ichidagi dona soni
    const donaPerOram = Math.max(1, Number(product.donaPerOram) || 1);

    // Eng kichik birlikdagi real qoldiq
    const remainingStockDona =
      product.qoldiqDona !== undefined && product.qoldiqDona !== null
        ? Number(product.qoldiqDona)
        : (product.qoldiq !== undefined && product.qoldiq !== null
            ? Number(product.qoldiq)
            : originalQuantity) * donaPerOram;

    const remainingQuantity = Math.floor(remainingStockDona / donaPerOram);
    const remainingLooseDona = remainingStockDona % donaPerOram;
    const isLow =
      remainingStockDona < donaPerOram * 10 && remainingStockDona > 0;

    return (
      <tr
        key={productId || index}
        className={`border-b hover:bg-gray-50 transition-colors ${
          isLow ? "bg-red-50" : ""
        }`}
      >
        {/* 1. # */}
        <td className="px-2 py-2 text-center text-gray-500 whitespace-nowrap">
          {index + 1}
        </td>

        {/* 2. Mahsulot nomi */}
        <td className="px-2 py-2 font-medium text-gray-900 whitespace-nowrap text-left">
          {capitalizeFirstLetter(product.productName)}
        </td>

        {/* 3. Turkum */}
        <td className="px-2 py-2 whitespace-nowrap text-left">
          <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
            {getValueOrDefault(product.turkum, "-")}
          </span>
        </td>

        {/* 4. Qoldiq - ✅ SOTILGANDAN KEYIN QOLGAN SONI */}
        {/* 4. Qoldiq */}
        <td className="px-2 py-2 font-semibold whitespace-nowrap text-left">
          <span className={isLow ? "text-red-600" : "text-gray-900"}>
            {formatLargeNumber(remainingStockDona)}{" "}
            {getValueOrDefault(product.olchovBirligi, "dona")}
          </span>

          {isLow && (
            <span className="ml-1 text-[10px] bg-red-200 text-red-800 px-1.5 py-0.5 rounded-full whitespace-nowrap">
              !
            </span>
          )}
        </td>

        {/* 5. O'ramlar qoldig'i */}
        <td className="px-2 py-2 whitespace-nowrap text-left">
          {formatLargeNumber(remainingQuantity)}{" "}
          {getValueOrDefault(product.oramlarNomi, "quti")}
          {remainingLooseDona > 0 && (
            <span className="ml-1 text-xs text-gray-500">
              + {formatLargeNumber(remainingLooseDona)}{" "}
              {getValueOrDefault(product.olchovBirligi, "dona")}
            </span>
          )}
        </td>
        {/* 6. Sotish narxi */}
        <td className="px-2 py-2 text-left font-medium text-green-600 whitespace-nowrap">
          {formatCurrency(product.sotishNarxi)}
        </td>

        {/* 7. Ulgurji narxi */}
        <td className="px-2 py-2 text-left text-gray-500 whitespace-nowrap">
          {formatCurrency(product.ulgurjiNarxi || 0)}
        </td>

        {/* 8. Sotib olingan narxi */}
        <td className="px-2 py-2 text-left text-gray-500 whitespace-nowrap">
          {formatCurrency(product.sotibOlinganNarxi || 0)}
        </td>

        {/* 9. O'lchov birligi */}
        <td className="px-2 py-2 text-left whitespace-nowrap">
          <span className="bg-gray-100 text-gray-800 text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
            {getValueOrDefault(product.olchovBirligi, "-")}
          </span>
        </td>

        {/* 10. Oramlar nomi */}
        <td className="px-2 py-2 text-left whitespace-nowrap">
          {getValueOrDefault(product.oramlarNomi, "-")}
        </td>

        {/* 11. Oramlar soni - ✅ ASL SONI (O'ZGARMAS) */}
        {/* 11. Oramlar soni - ASL SONI */}
        <td className="px-2 py-2 text-left whitespace-nowrap font-medium">
          {formatLargeNumber(originalQuantity)}{" "}
          {getValueOrDefault(product.oramlarNomi, "quti")}
        </td>

        {/* 12. Sana */}
        <td className="px-2 py-2 text-[10px] text-gray-500 whitespace-nowrap text-left">
          {product.creationDateTime
            ? new Date(product.creationDateTime).toLocaleString("uz-UZ", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : "-"}
        </td>

        {/* 13. Amallar */}
        <td className="px-2 py-2 text-center">
          <div className="relative inline-block">
            <button
              type="button"
              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors text-base font-bold leading-none"
              onClick={() => toggleDropdown(productId)}
              aria-label="Amallar"
            >
              ⋮
            </button>

            {openDropdownId === productId && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenDropdownId(null)}
                />
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-2"
                    onClick={() => handleActionClick(productId, "edit")}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Tahrirlash
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    onClick={() => handleActionClick(productId, "delete")}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    O'chirish
                  </button>
                </div>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  });
}

// =======================================================
// PROPTYPES
// =======================================================

TableBody.propTypes = {
  productArray: PropTypes.array,
  openDeleteModal: PropTypes.func.isRequired,
  handleEditProduct: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  filteredProduct: PropTypes.array,
  salesArray: PropTypes.array,
};

TableBody.defaultProps = {
  productArray: [],
  loading: false,
  filteredProduct: [],
  salesArray: [],
};

// =======================================================
// EXPORT
// =======================================================

export default memo(TableBody);
