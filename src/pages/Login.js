import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance.js"; // Adjust the import based on your project structure

const Login = () => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await API.post("/auth/login", JSON.stringify({ email, password }), {
      headers: {
        "Content-Type": "application/json",
      },
      });
      const token = response.data.accessToken; // Backend sends a token

      localStorage.setItem("adminToken", token); // Store token
      console.log("token", token);
      if (response.data.isAdmin) {
        console.log("User is an admin");
        navigate("/admin"); // Redirect to admin panel
      } else {
        alert("You are not authorized to access the admin panel");
        return;
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh", backgroundColor: "#f5f5f5" }}>
      <div style={{ padding: "20px", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", width: "300px" }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>Admin Login</h1>
        <input
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "20px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
