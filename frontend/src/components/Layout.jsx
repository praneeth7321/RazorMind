import Sidebar from "./Sidebar";

function Layout({ children, onLogout }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#181A20",
        color: "white",
      }}
    >
      <Sidebar onLogout={onLogout} />

      <div
        style={{
          flex: 1,
          padding: "30px",
          overflow: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Layout;