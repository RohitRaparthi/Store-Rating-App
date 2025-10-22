import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StoreOwnerDashboard.css";

export default function StoreOwnerDashboard() {
  const [averageRating, setAverageRating] = useState(0);
  const [raters, setRaters] = useState([]);
  const navigate = useNavigate();

  const fetchAvgRating = async () => {
    const res = await axios.get("/store-owner/average-rating");
    setAverageRating(res.data.average_rating);
  };

  const fetchRaters = async () => {
    const res = await axios.get("/store-owner/raters");
    setRaters(res.data);
  };

  useEffect(() => {
    fetchAvgRating();
    fetchRaters();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="store-dashboard-container">
      <nav className="navbar navbar-light bg-white shadow-sm p-3 mb-4">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <h4 className="fw-bold text-primary mb-0">Store Owner Dashboard 🏪</h4>
          <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        {/* Stats Section */}
        <div className="card shadow-sm border-0 mb-4 p-4 text-center">
          <h5 className="text-muted mb-2">⭐ Average Rating</h5>
          <h1 className="text-warning display-5 fw-bold">
            {averageRating ? averageRating.toFixed(1) : "0.0"}
          </h1>
        </div>

        {/* Raters Section */}
        <div className="card shadow-sm border-0 p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">👥 Users Who Rated</h5>
            <span className="badge bg-primary fs-6">
              {raters.length} {raters.length === 1 ? "User" : "Users"}
            </span>
          </div>

          {raters.length === 0 ? (
            <p className="text-muted text-center mb-0">No ratings submitted yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>User Name</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Rated At</th>
                  </tr>
                </thead>
                <tbody>
                  {raters.map((rater) => (
                    <tr key={rater.user_id}>
                      <td>{rater.name}</td>
                      <td>{rater.email}</td>
                      <td>
                        <span className="badge bg-warning text-dark px-3 py-2">
                          {rater.rating} ⭐
                        </span>
                      </td>
                      <td>{new Date(rater.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
