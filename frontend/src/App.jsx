import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Payment from "./pages/Payment.jsx";
import PaymentHistory from "./pages/PaymentHistory";
import Login from "./pages/Login";
import Merchants from "./pages/Merchants";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import MerchantLeaderboard from "./pages/MerchantLeaderboard";
import FraudAlerts from "./pages/FraudAlerts";
import Layout from "./components/Layout";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  if (!loggedIn) {
    return (
      <Login
        onLogin={() => setLoggedIn(true)}
      />
    );
  }

  return (
    <BrowserRouter>
      <Layout
        onLogout={() => {
          localStorage.removeItem("token");
          setLoggedIn(false);
        }}
      >
        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/payment"
            element={<Payment />}
          />

          <Route
            path="/payments"
            element={<PaymentHistory />}
          />

          <Route
            path="/merchants"
            element={<Merchants />}
          />

          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="*"
            element={<Navigate to="/" />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/fraud-alerts"
            element={<FraudAlerts />}
          />

          <Route
            path="/merchant-leaderboard"
            element={<MerchantLeaderboard />}
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;