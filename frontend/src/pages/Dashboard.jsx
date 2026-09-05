import { useEffect, useState } from "react";
import axios from "axios";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF4D4F"];

function Dashboard() {
  const [stats, setStats] = useState({
    total_payments: 0,
    successful_payments: 0,
    blocked_payments: 0,
    review_queue: 0,
    average_ai_confidence: 0,
    average_risk_score: 0,
  });

  const [decisionData, setDecisionData] = useState([]);
  const [paymentsPerDay, setPaymentsPerDay] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      window.location.href = "/";
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get("http://127.0.0.1:8000/dashboard/stats", config)
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      });

    axios
      .get(
        "http://127.0.0.1:8000/dashboard/decision-distribution",
        config
      )
      .then((res) => setDecisionData(res.data))
      .catch(console.error);

    axios
      .get(
        "http://127.0.0.1:8000/dashboard/payments-per-day",
        config
      )
      .then((res) => setPaymentsPerDay(res.data))
      .catch(console.error);

    axios
      .get(
        "http://127.0.0.1:8000/dashboard/recent-payments",
        config
      )
      .then((res) => setRecentPayments(res.data))
      .catch(console.error);
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        width: "100%",
        maxWidth: "100%",
        overflowX: "auto",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        RazorMind Dashboard
      </h1>

      {/* Dashboard Cards */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
        }}
      >
        <Card title="Total Payments" value={stats.total_payments} />

        <Card
          title="Successful Payments"
          value={stats.successful_payments}
        />

        <Card
          title="Blocked Payments"
          value={stats.blocked_payments}
        />

        <Card
          title="Review Queue"
          value={stats.review_queue}
        />

        <Card
          title="Avg AI Confidence"
          value={`${Number(
            stats.average_ai_confidence || 0
          ).toFixed(2)}%`}
        />

        <Card
          title="Avg Risk Score"
          value={Number(
            stats.average_risk_score || 0
          ).toFixed(2)}
        />
      </div>

      {/* Charts */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          marginTop: "50px",
        }}
      >
        {/* Pie Chart */}

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            AI Decision Distribution
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={decisionData.filter((x) => x.value > 0)}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {decisionData
                  .filter((x) => x.value > 0)
                  .map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
          }}
        >
          <h2 style={{ textAlign: "center" }}>
            Payments Per Day
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={paymentsPerDay}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis allowDecimals={false} />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="count"
                fill="#4CAF50"
                name="Payments"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Payments */}

      <div
        style={{
          marginTop: "50px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          overflowX: "auto",
        }}
      >
        <h2 style={{ textAlign: "center" }}>
          Recent Payments
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
              {[
                "Payment ID",
                "Amount",
                "Status",
                "Decision",
                "Confidence",
                "Risk Score",
              ].map((heading) => (
                <th
                  key={heading}
                  style={{
                    border: "1px solid #ddd",
                    padding: "12px",
                    background: "#f5f5f5",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {recentPayments.map((payment) => (
              <tr key={payment.payment_id}>
                <td style={cellStyle}>{payment.payment_id}</td>

                <td style={cellStyle}>
                  ₹{payment.amount}
                </td>

                <td style={cellStyle}>
                  {payment.status}
                </td>

                <td style={cellStyle}>
                  {payment.decision}
                </td>

                <td style={cellStyle}>
                  {payment.confidence}%
                </td>

                <td style={cellStyle}>
                  {payment.risk_score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {recentPayments.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No recent payments found.
          </p>
        )}
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "25px",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,.1)",
      }}
    >
      <h3>{title}</h3>

      <h1>{value}</h1>
    </div>
  );
}

const cellStyle = {
  border: "1px solid #ddd",
  padding: "10px",
  textAlign: "center",
};

export default Dashboard;