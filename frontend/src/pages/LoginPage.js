import { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./LoginPage.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);

      if (res.data.user.role === "admin") navigate("/admin");
      else if (res.data.user.role === "user") navigate("/user");
      else if (res.data.user.role === "store_owner") navigate("/store-owner");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-wrapper d-flex justify-content-center align-items-center">
      <div className="card login-card shadow-lg p-4">
        <h3 className="text-center mb-2 fw-bold text-primary">Welcome Back 👋</h3>
        <p className="text-center text-muted mb-4">Please login to continue</p>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-envelope-fill text-secondary"></i>
              </span>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <i className="bi bi-lock-fill text-secondary"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3 fw-semibold">
            Login
          </button>

          <p className="text-center text-muted mt-3">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
            >
              Sign up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
