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
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

function Analytics() {
  const [stats, setStats] = useState({});
  const [decisionData, setDecisionData] = useState([]);
  const [paymentsPerDay, setPaymentsPerDay] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get("http://127.0.0.1:8000/dashboard/stats", config)
      .then((res) => setStats(res.data));

    axios
      .get(
        "http://127.0.0.1:8000/dashboard/decision-distribution",
        config
      )
      .then((res) => setDecisionData(res.data));

    axios
      .get(
        "http://127.0.0.1:8000/dashboard/payments-per-day",
        config
      )
      .then((res) => setPaymentsPerDay(res.data));
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: 30 }}>
        Fraud Analytics
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 20,
        }}
      >
        <Card
          title="Total Payments"
          value={stats.total_payments}
        />

        <Card
          title="Successful"
          value={stats.successful_payments}
        />

        <Card
          title="Blocked"
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
          ).toFixed(2)} %`}
        />

        <Card
          title="Avg Risk Score"
          value={Number(
            stats.average_risk_score || 0
          ).toFixed(2)}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 30,
          marginTop: 40,
        }}
      >
        <div
          style={{
            background: "#1F2937",          
            padding: 20,
            borderRadius: 10,
          }}
        >
          <h2>AI Decision Distribution</h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <PieChart>
              <Pie
                data={decisionData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {decisionData.map(
                  (entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            background: "#1F2937",            
            padding: 20,
            borderRadius: 10,
          }}
        >
          <h2>Payments Per Day</h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart data={paymentsPerDay}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="#4CAF50"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#202938",
        border: "1px solid #334155",
        borderRadius: "10px",
        padding: "25px",
        textAlign: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,.25)",
      }}
    >
      <h3
        style={{
          color: "#b8c5d6",
          marginBottom: "15px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color: "white",
          fontSize: "42px",
          margin: 0,
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default Analytics;