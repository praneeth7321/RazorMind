import { useEffect, useState } from "react";
import axios from "axios";

export default function FraudAlerts() {
  const [alerts, setAlerts] =useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://127.0.0.1:8000/dashboard/fraud-alerts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setAlerts(res.data))
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "30px", color: "white" }}>
      <h1
        style={{
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        🚨 Fraud Alerts
      </h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          color: "white",
        }}
      >
        <thead>
          <tr>
            <th style={head}>Payment</th>
            <th style={head}>Merchant</th>
            <th style={head}>Customer</th>
            <th style={head}>Amount</th>
            <th style={head}>Risk</th>
            <th style={head}>Confidence</th>
            <th style={head}>Decision</th>
            <th style={head}>Time</th>
            <th style={head}>Action</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((a) => (
            <tr key={a.id}>
              <td style={cell}>{a.id}</td>

              <td style={cell}>{a.merchant}</td>

              <td style={cell}>{a.customer}</td>

              <td style={cell}>₹{a.amount}</td>

              <td
                style={{
                  ...cell,
                  color:
                    a.risk_score >= 90
                      ? "#ef4444"
                      : a.risk_score >= 70
                      ? "#f59e0b"
                      : "#22c55e",
                  fontWeight: "bold",
                }}
              >
                {a.risk_score}
              </td>

              <td style={cell}>{a.confidence}%</td>

              <td
                style={{
                  ...cell,
                  color:
                    a.decision === "BLOCK"
                      ? "#ef4444"
                      : a.decision === "REVIEW"
                      ? "#f59e0b"
                      : "#22c55e",
                  fontWeight: "bold",
                }}
              >
                {a.decision}
              </td>

              <td style={cell}>
                {new Date(a.created_at).toLocaleString()}
              </td>

              <td style={cell}>
                <button
                  onClick={() => setSelectedAlert(a)}
                  style={{
                    padding: "8px 14px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Explain
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedAlert && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "600px",
              background: "#1f2937",
              borderRadius: "12px",
              padding: "25px",
              color: "white",
              boxShadow: "0 0 25px rgba(0,0,0,.5)",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              🤖 AI Fraud Analysis
            </h2>

            <p>
              <b>Payment ID:</b> {selectedAlert.id}
            </p>

            <p>
              <b>Merchant:</b> {selectedAlert.merchant}
            </p>

            <p>
              <b>Customer:</b> {selectedAlert.customer}
            </p>

            <p>
              <b>Amount:</b> ₹{selectedAlert.amount}
            </p>

            <hr
              style={{
                margin: "18px 0",
                borderColor: "#374151",
              }}
            />

            <p>
              <b>Risk Score:</b>{" "}
              <span
                style={{
                  color:
                    selectedAlert.risk_score >= 90
                      ? "#ef4444"
                      : selectedAlert.risk_score >= 70
                      ? "#f59e0b"
                      : "#22c55e",
                }}
              >
                {selectedAlert.risk_score}
              </span>
            </p>

            <p>
              <b>Confidence:</b> {selectedAlert.confidence}%
            </p>

            <p>
              <b>Decision:</b>{" "}
              <span
                style={{
                  color:
                    selectedAlert.decision === "BLOCK"
                      ? "#ef4444"
                      : selectedAlert.decision === "REVIEW"
                      ? "#f59e0b"
                      : "#22c55e",
                  fontWeight: "bold",
                }}
              >
                {selectedAlert.decision}
              </span>
            </p>

            <hr
              style={{
                margin: "18px 0",
                borderColor: "#374151",
              }}
            />

            <h3>🧠 AI Explanation</h3>

            <div
              style={{
                background: "#111827",
                padding: "18px",
                borderRadius: "10px",
                marginTop: "12px",
                lineHeight: "1.8",
                color: "#d1d5db",
              }}
            >
              {selectedAlert.reason}
            </div>

            <div
              style={{
                marginTop: "25px",
                padding: "18px",
                background: "#111827",
                borderRadius: "10px",
              }}
            >
              <b>Recommendation</b>

              <p
                style={{
                  marginTop: "12px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  color:
                    selectedAlert.decision === "BLOCK"
                      ? "#ef4444"
                      : selectedAlert.decision === "REVIEW"
                      ? "#f59e0b"
                      : "#22c55e",
                }}
              >
                {selectedAlert.decision === "BLOCK"
                  ? "🚫 AI recommends blocking this payment immediately."
                  : selectedAlert.decision === "REVIEW"
                  ? "🟡 AI recommends sending this payment for manual review."
                  : "🟢 AI recommends approving this payment."}
              </p>
            </div>

            <button
              onClick={() => setSelectedAlert(null)}
              style={{
                marginTop: "25px",
                width: "100%",
                padding: "12px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const head = {
  border: "1px solid #555",
  padding: "12px",
  background: "#1f2937",
  color: "white",
};

const cell = {
  border: "1px solid #555",
  padding: "12px",
  textAlign: "center",
};