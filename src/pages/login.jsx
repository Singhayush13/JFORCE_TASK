import { useContext, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const submit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await api.post("/auth/login", form);

    login(res.data.token);

    // 🔥 ROLE-BASED REDIRECT
    const decoded = JSON.parse(atob(res.data.token.split(".")[1]));

    if (decoded.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-4" style={{ width: "380px" }}>
        <h3 className="text-center mb-4">Login</h3>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register link */}
        <div className="text-center mt-3">
          <small>
            Not a user?{" "}
            <span
              className="text-primary fw-semibold"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;
