import { NavLink } from "react-router-dom";

function Sidebar({ onLogout }) {
  const menu = [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Payments",
      path: "/payment",
    },
    {
      name: "Payment History",
      path: "/payments",
    },
    {
      name: "Analytics",
      path: "/analytics",
   },
    {
      name: "Settings",
      path: "/settings",
    },
    {
      name: "Leaderboard",
      path: "/merchant-leaderboard",
   },
   {
      name: "Fraud Alerts",
      path: "/fraud-alerts",
    },
  ];

  return (
    <div
      style={{
        width: "250px",
        background: "#111827",
        padding: "25px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          marginBottom: "40px",
          color: "#4CAF50",
        }}
      >
        RazorMind
      </h2>

      {menu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          style={({ isActive }) => ({
            display: "block",
            padding: "14px",
            marginBottom: "12px",
            textDecoration: "none",
            borderRadius: "8px",
            color: "white",
            background: isActive
              ? "#4CAF50"
              : "transparent",
          })}
        >
          {item.name}
        </NavLink>
      ))}

      <button
        onClick={onLogout}
        style={{
          marginTop: "auto",
          width: "100%",
          padding: "12px",
          background: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Logout
      </button>
    </div>

    
  );
}

export default Sidebar;