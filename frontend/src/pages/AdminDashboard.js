import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userFilters, setUserFilters] = useState({ name: "", email: "", role: "" });
  const [storeFilters, setStoreFilters] = useState({ name: "", email: "", address: "" });

  const fetchStats = async () => {
    const res = await axios.get("/admin/stats");
    setStats(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get("/admin/users", { params: { ...userFilters } });
    setUsers(res.data);
  };

  const fetchStores = async () => {
    const res = await axios.get("/admin/stores", { params: { ...storeFilters } });
    setStores(res.data);
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="admin-dashboard-container">
      <nav className="navbar navbar-light bg-white shadow-sm p-3 mb-4">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h4 className="fw-bold text-primary mb-0">Admin Dashboard ⚙️</h4>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        {/* Stats Section */}
        <div className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm border-0 p-3">
              <h6 className="text-muted mb-2">👥 Total Users</h6>
              <h3 className="fw-bold text-primary">{stats.totalUsers || 0}</h3>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm border-0 p-3">
              <h6 className="text-muted mb-2">🏪 Total Stores</h6>
              <h3 className="fw-bold text-success">{stats.totalStores || 0}</h3>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card text-center shadow-sm border-0 p-3">
              <h6 className="text-muted mb-2">⭐ Total Ratings</h6>
              <h3 className="fw-bold text-warning">{stats.totalRatings || 0}</h3>
            </div>
          </div>
        </div>

        {/* Add User Section */}
        <div className="card shadow-sm border-0 p-4 mb-4">
          <h5 className="fw-bold mb-3 text-primary">➕ Add New User</h5>
          <form
            className="row g-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const data = {
                name: e.target.name.value,
                email: e.target.email.value,
                address: e.target.address.value,
                password: e.target.password.value,
                role: e.target.role.value,
              };
              try {
                const res = await axios.post("/admin/add-user", data);
                alert("User added successfully!");
                fetchUsers();
                e.target.reset();
              } catch (err) {
                alert("Failed to add user");
              }
            }}
          >
            <div className="col-md-4">
              <input name="name" placeholder="Name" className="form-control" required />
            </div>
            <div className="col-md-4">
              <input name="email" placeholder="Email" className="form-control" required />
            </div>
            <div className="col-md-4">
              <input name="address" placeholder="Address" className="form-control" required />
            </div>
            <div className="col-md-4">
              <input name="password" placeholder="Password" className="form-control" required />
            </div>
            <div className="col-md-4">
              <select name="role" className="form-select" required>
                <option value="">--Select Role--</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="store_owner">Store Owner</option>
              </select>
            </div>
            <div className="col-md-4 d-grid">
              <button type="submit" className="btn btn-primary">
                Add User
              </button>
            </div>
          </form>
        </div>

        {/* Add Store Section */}
        <div className="card shadow-sm border-0 p-4 mb-4">
          <h5 className="fw-bold mb-3 text-success">🏪 Add New Store</h5>
          <form
            className="row g-3"
            onSubmit={async (e) => {
              e.preventDefault();
              const data = {
                name: e.target.name.value,
                email: e.target.email.value,
                address: e.target.address.value,
                owner_id: e.target.ownerId.value,
              };
              try {
                await axios.post("/admin/add-store", data);
                alert("Store added successfully!");
                fetchStores();
                e.target.reset();
              } catch (err) {
                alert("Failed to add store");
              }
            }}
          >
            <div className="col-md-3">
              <input name="name" placeholder="Store Name" className="form-control" required />
            </div>
            <div className="col-md-3">
              <input name="email" placeholder="Store Email" className="form-control" required />
            </div>
            <div className="col-md-3">
              <input name="address" placeholder="Store Address" className="form-control" required />
            </div>
            <div className="col-md-2">
              <input name="ownerId" placeholder="Owner ID" className="form-control" required />
            </div>
            <div className="col-md-1 d-grid">
              <button type="submit" className="btn btn-success">
                Add
              </button>
            </div>
          </form>
        </div>

        {/* Users Table */}
        <div className="card shadow-sm border-0 p-4 mb-4">
          <h5 className="fw-bold mb-3 text-dark">👥 Users</h5>
          <div className="row g-2 mb-3">
            <div className="col">
              <input
                placeholder="Filter by Name"
                className="form-control"
                onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })}
              />
            </div>
            <div className="col">
              <input
                placeholder="Filter by Email"
                className="form-control"
                onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })}
              />
            </div>
            <div className="col">
              <input
                placeholder="Filter by Role"
                className="form-control"
                onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-primary" onClick={fetchUsers}>
                Apply
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-primary">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.address}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stores Table */}
        <div className="card shadow-sm border-0 p-4 mb-5">
          <h5 className="fw-bold mb-3 text-dark">🏪 Stores</h5>
          <div className="row g-2 mb-3">
            <div className="col">
              <input
                placeholder="Filter by Name"
                className="form-control"
                onChange={(e) => setStoreFilters({ ...storeFilters, name: e.target.value })}
              />
            </div>
            <div className="col">
              <input
                placeholder="Filter by Email"
                className="form-control"
                onChange={(e) => setStoreFilters({ ...storeFilters, email: e.target.value })}
              />
            </div>
            <div className="col">
              <input
                placeholder="Filter by Address"
                className="form-control"
                onChange={(e) => setStoreFilters({ ...storeFilters, address: e.target.value })}
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-outline-primary" onClick={fetchStores}>
                Apply
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-success">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.address}</td>
                    <td>
                      <span className="badge bg-warning text-dark">{s.rating || 0} ⭐</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
