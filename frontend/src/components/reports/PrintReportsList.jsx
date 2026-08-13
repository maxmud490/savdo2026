import { forwardRef } from 'react';
import { formatLargeNumber } from '../formatNumber';

const PrintReportsList = forwardRef(({ filteredData }, ref) => {
  return (
    <div ref={ref}>
      <h2>Mijozlar hisoboti ro'yxati</h2>
      <table className="table table-hover table-bordered border border-white mt-5 fw-bold">
          <thead>
            <tr>
              <th
                colSpan="2"
                scope="colgroup"
                className="text-center table-white"
              ></th>
              <th
                colSpan="4"
                scope="colgroup"
                className="text-center table-success"
              >
                Sotuv
              </th>
              <th
                colSpan="6"
                scope="colgroup"
                className="text-center table-info"
              >
                To'lov
              </th>
            </tr>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Mijoz</th>
              <th scope="col" className="table-success">
                Jami
              </th>
              <th scope="col" className="table-success">
                Soni
              </th>
              <th scope="col" className="table-success">
                Qarzga
              </th>
              <th scope="col" className="table-success">
                Chegirma
              </th>
              <th scope="col" className="table-info">
                Jami
              </th>
              <th scope="col" className="table-info">
                Soni
              </th>
              <th scope="col" className="table-info">
                Naqd
              </th>
              <th scope="col" className="table-info">
                Bank kartasi
              </th>
              <th scope="col" className="table-info">
                Sotilgan vaqti
              </th>
            </tr>
          </thead>

          <tbody>
          {filteredData.map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{item.clientName}</td>
                <td className="table-success">{formatLargeNumber(item.newPriceNumber)}</td>
                <td className="table-success">{item.productNumber}</td>
                <td className="table-success">
                  {item.clientValue !== "" 
                  ? formatLargeNumber(item.newPriceNumber - item.clientValue)
                  : formatLargeNumber(item.newPriceNumber - item.plasticValue)}
                  </td>
                <td className="table-success">0</td>
                <td className="table-info">
                {item.clientValue !== "" 
                  ? formatLargeNumber(item.clientValue)
                  : formatLargeNumber(item.plasticValue)}
                  </td>
                <td className="table-info">{item.productNumber}</td>
                <td className="table-info">
                {item.clientValue !== "" 
                  ? formatLargeNumber(item.clientValue)
                  : 0 }
                  </td>
                <td className="table-info">
                {item.plasticValue !== "" 
                  ? formatLargeNumber(item.plasticValue)
                  : 0 }
                </td>
                <td className="table-info">{item.dataValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
})

export default PrintReportsList;
