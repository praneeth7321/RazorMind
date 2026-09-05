import { useEffect, useState } from "react";
import axios from "axios";

function MerchantLeaderboard() {
  const [merchants, setMerchants] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://127.0.0.1:8000/dashboard/merchant-leaderboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setMerchants(res.data))
      .catch(console.error);
  }, []);

  return (
    <div
      style={{
        padding: 30,
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Merchant Leaderboard
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={head}>Merchant</th>
            <th style={head}>Transactions</th>
            <th style={head}>Avg Risk</th>
            <th style={head}>AI Confidence</th>
            <th style={head}>Status</th>
          </tr>
        </thead>

        <tbody>
          {merchants.map((m) => (
            <tr key={m.merchant_id}>
              <td style={cell}>{m.merchant_id}</td>
              <td style={cell}>{m.transactions}</td>
              <td style={cell}>{m.avg_risk}</td>
              <td style={cell}>{m.avg_confidence}%</td>

              <td
                style={{
                  ...cell,
                  color:
                    m.status === "Safe"
                      ? "#4CAF50"
                      : m.status === "Watch"
                      ? "#FFC107"
                      : "#F44336",
                  fontWeight: "bold",
                }}
              >
                {m.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const head = {
  border: "1px solid #555",
  padding: 12,
  background: "#1f2937",
};

const cell = {
  border: "1px solid #444",
  padding: 12,
  textAlign: "center",
};

export default MerchantLeaderboard;