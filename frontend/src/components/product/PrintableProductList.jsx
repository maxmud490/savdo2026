
import PropTypes from "prop-types";
import { forwardRef } from 'react';

const PrintableProductList = forwardRef(({productArray}, ref) => {

    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
      };
    
      const renderValueOrFallback = (value, fallback) => {
        return value.length !== 0 ? value : fallback;
      };
  return (
    <div ref={ref} className="printable-product-list">
      <h2>Mahsulotlar ro'yxati</h2>
      <table className="table table-bordered mt-3 fw-bold">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Mahsulot nomi</th>
            <th scope="col">Turkum</th>
            <th scope="col">Sotish narxi</th>
            <th scope="col">Ulgurji narxi</th>
            <th scope="col">Sotib olingan narxi</th>
            <th scope="col">Olchov birligi</th>
            <th scope="col">Oramlar nomi</th>
            <th scope="col">Oramlar soni</th>
            <th scope="col">Yaratilgan vaqti</th>
            <th scope="col">Setting</th>
          </tr>
        </thead>

        <tbody>
          {productArray.map((product, index) => (
            <tr key={product.id} className="text-nowrap">
              <th scope="row">{index + 1}</th>
              <td className="text-primary fs-5 pt-0 text-wrap">
                {capitalizeFirstLetter(product.productName)}
              </td>
              <td>{renderValueOrFallback(product.turkum, "Tanlanmagan")}</td>
              <td>{product.sotishNarxi} so'm</td>
              <td>{renderValueOrFallback(product.ulgurjiNarxi, "0")} so'm</td>
              <td>{renderValueOrFallback(product.sotibOlinganNarxi, "0")} so'm</td>
              <td>{product.olchovBirligi}</td>
              <td>{renderValueOrFallback(product.oramlarNomi, "Tanlanmagan")}</td>
              <td>{renderValueOrFallback(product.oramlarSoni, "0")}</td>
              <td className="text-wrap">
                {product.creationDateTime
                  ? new Date(product.creationDateTime).toLocaleString()
                  : "Unknown"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

PrintableProductList.propTypes = {
  productArray: PropTypes.array.isRequired,
};

export default PrintableProductList;
