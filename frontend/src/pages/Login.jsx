import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.access_token;

      localStorage.setItem("token", token);

      onLogin();
    } catch (err) {
      alert("Invalid Email or Password");
      console.log(err);
    }
  };

  return (
    <div
      style={{
        width: "350px",
        margin: "100px auto",
        textAlign: "center",
      }}
    >
      <h1>RazorMind Login</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
        }}
      />

      <button
        onClick={login}
        style={{
          padding: "10px 30px",
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;