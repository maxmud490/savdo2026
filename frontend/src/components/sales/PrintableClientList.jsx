import { forwardRef } from "react";

const PrintableClientList = forwardRef(
  (
    {
      clientData,
      formatLargeNumber,
      clientValues,
      plasticValues,
    },
    ref
  ) => {
    const total = clientData.reduce(
      (sum, item) => sum + (Number(item.productPrice) || 0),
      0
    );

    const totalPayment = clientData.reduce(
      (sum, item) => sum + (Number(item.selectedValue) || 0),
      0
    );

    const totalDebt = total - totalPayment;

    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          left: "-9999px",
          top: 0,
          width: "1200px",
          background: "white",
          padding: "20px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          Sotuvlar ro'yxati
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>#</th>
              <th style={thStyle}>Mijoz</th>
              <th style={thStyle}>Sotuv holati</th>
              <th style={thStyle}>To'lov holati</th>
              <th style={thStyle}>Mas'ul xodim</th>
              <th style={thStyle}>Jami narxi</th>
              <th style={thStyle}>To'lov</th>
              <th style={thStyle}>Qarzga</th>
              <th style={thStyle}>Sotuvchi</th>
              <th style={thStyle}>Sotilgan vaqti</th>
            </tr>
          </thead>

          <tbody>
            {clientData.map((item, index) => {
              const productPrice =
                Number(item.productPrice) || 0;

              const selectedValue =
                Number(item.selectedValue) || 0;

              const debt =
                productPrice - selectedValue;

              return (
                <tr key={item.id || item._id || index}>
                  <td style={tdStyle}>{index + 1}</td>

                  <td style={tdStyle}>
                    {item.clientName || "Noma'lum"}
                  </td>

                  <td style={tdStyle}>
                    {selectedValue
                      ? "Tasdiqlangan"
                      : "Tasdiqlanmagan"}
                  </td>

                  <td style={tdStyle}>
                    {selectedValue
                      ? "To'langan"
                      : "Qarz"}
                  </td>

                  <td style={tdStyle}>
                    {item.workman || "-"}
                  </td>

                  <td style={tdStyle}>
                    {formatLargeNumber(productPrice)} so'm
                  </td>

                  <td style={tdStyle}>
                    {formatLargeNumber(selectedValue)} so'm
                  </td>

                  <td style={tdStyle}>
                    {formatLargeNumber(
                      debt > 0 ? debt : 0
                    )}{" "}
                    so'm
                  </td>

                  <td style={tdStyle}>
                    +998902990052
                  </td>

                  <td style={tdStyle}>
                    {item.dataValue || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ marginTop: "25px" }}>
          <p>
            <strong>
              Jami narxi:
            </strong>{" "}
            {formatLargeNumber(total)} so'm
          </p>

          <p>
            <strong>
              Jami to'lov:
            </strong>{" "}
            {formatLargeNumber(totalPayment)} so'm
          </p>

          <p>
            <strong>
              Naqd to'lov:
            </strong>{" "}
            {formatLargeNumber(clientValues || 0)} so'm
          </p>

          <p>
            <strong>
              Bank kartasi:
            </strong>{" "}
            {formatLargeNumber(plasticValues || 0)} so'm
          </p>

          <p>
            <strong>
              Jami qarz:
            </strong>{" "}
            {formatLargeNumber(
              totalDebt > 0 ? totalDebt : 0
            )}{" "}
            so'm
          </p>
        </div>
      </div>
    );
  }
);

const thStyle = {
  border: "1px solid #000",
  padding: "8px",
  background: "#eee",
  textAlign: "center",
};

const tdStyle = {
  border: "1px solid #000",
  padding: "8px",
};

export default PrintableClientList;