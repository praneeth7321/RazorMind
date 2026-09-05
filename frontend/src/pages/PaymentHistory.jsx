import { useEffect, useState } from "react";
import axios from "axios";

function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://127.0.0.1:8000/dashboard/payment-history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setPayments(res.data))
      .catch(console.error);
  }, []);

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.razorpay_order_id
        ?.toLowerCase()
        .includes(search.toLowerCase()) || false;

    const matchesStatus =
      statusFilter === "All" ||
      payment.status.toLowerCase() ===
        statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div
      style={{
        padding: "20px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Payment History
      </h1>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        <input
          type="text"
          placeholder="Search Order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: "250px",
            padding: "10px",
            fontSize: "16px",
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
            borderRadius: "6px",
          }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            background: "#1f2937",
            color: "#fff",
            border: "1px solid #374151",
            borderRadius: "6px",
          }}
        >
          <option>All</option>
          <option>created</option>
          <option>paid</option>
          <option>failed</option>
        </select>
      </div>

      <div
        style={{
          overflowX: "auto",
          borderRadius: "8px",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: "1400px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              {[
                "ID",
                "Order ID",
                "Amount",
                "Currency",
                "Status",
                "Risk Score",
                "Decision",
                "Confidence",
                "Reason",
                "Customer",
                "Merchant",
                "Created At",
              ].map((head) => (
                <th
                  key={head}
                  style={{
                    border: "1px solid #374151",
                    padding: "12px",
                    background: "#1f2937",
                    color: "#ffffff",
                    position: "sticky",
                    top: 0,
                  }}
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id}>
                <td style={cell}>{payment.id}</td>

                <td style={cell}>
                  {payment.razorpay_order_id}
                </td>

                <td style={cell}>
                  ₹{payment.amount}
                </td>

                <td style={cell}>
                  {payment.currency}
                </td>

                <td style={cell}>
                  {payment.status}
                </td>

                <td style={cell}>
                  {payment.risk_score ?? "-"}
                </td>

                <td style={cell}>
                  {payment.decision ?? "-"}
                </td>

                <td style={cell}>
                  {payment.confidence != null
                    ? `${payment.confidence}%`
                    : "-"}
                </td>

                <td
                  style={{
                    ...cell,
                    maxWidth: "320px",
                    minWidth: "320px",
                    textAlign: "left",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {payment.reason ?? "-"}
                </td>

                <td style={cell}>
                  {payment.customer_id}
                </td>

                <td style={cell}>
                  {payment.merchant_id}
                </td>

                <td style={cell}>
                  {new Date(
                    payment.created_at
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cell = {
  border: "1px solid #374151",
  padding: "10px",
  textAlign: "center",
  color: "#fff",
};

export default PaymentHistory;