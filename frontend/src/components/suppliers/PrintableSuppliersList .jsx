import { forwardRef } from 'react';

const PrintableSuppliersList = forwardRef(({ suppliers, formatLargeNumber }, ref) => {
  return (
    <div ref={ref}>
      <h2 className="text-center mb-4">Yetkazib beruvchilar ro'yxati</h2>
      <table className="table table-bordered mt-3 table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Yetkazib beruvchi</th>
            <th>Yetkazib beruvchiga qarz</th>
            <th>Malumot</th>
            <th>Tel nomeri</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{(supplier.name || "").toUpperCase()}</td>
              <td> - {formatLargeNumber(supplier.debt)} so'm</td>
              <td>{supplier.information}</td>
              <td>{supplier.phoneNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default PrintableSuppliersList;
