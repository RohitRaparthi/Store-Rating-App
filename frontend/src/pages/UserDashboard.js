import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [newRatings, setNewRatings] = useState({});
  const navigate = useNavigate();

  const fetchStores = async () => {
    const res = await axios.get('/user/stores', { params: filters });
    setStores(res.data);
    const ratingsMap = {};
    res.data.forEach((store) => {
      ratingsMap[store.id] = store.user_rating || '';
    });
    setNewRatings(ratingsMap);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleRatingChange = (storeId, value) => {
    setNewRatings({ ...newRatings, [storeId]: value });
  };

  const submitRating = async (storeId) => {
    const rating = parseInt(newRatings[storeId]);
    if (rating < 1 || rating > 5) return alert('Rating must be between 1 and 5');

    try {
      await axios.post(`/user/rating/${storeId}`, { rating });
      fetchStores();
      alert('Rating submitted successfully!');
    } catch (err) {
      alert('Failed to submit rating');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-start p-4"
      style={{
        background:
          'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
      }}
    >
      {/* Header */}
      <div className="w-100 d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">User Dashboard</h2>
        <button className="btn btn-danger px-4 shadow-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Search Filters */}
      <div className="card shadow-lg border-0 p-4 mb-4 w-100" style={{ maxWidth: '1000px', borderRadius: '20px' }}>
        <h5 className="mb-3 text-secondary">🔍 Search Stores</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Store Name"
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              onChange={(e) => setFilters({ ...filters, address: e.target.value })}
            />
          </div>
          <div className="col-md-4 text-center">
            <button className="btn btn-primary w-100" onClick={fetchStores}>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <div className="card shadow-lg border-0 p-4 w-100" style={{ maxWidth: '1000px', borderRadius: '20px' }}>
        <h5 className="mb-3 text-secondary">🏪 Available Stores</h5>
        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="table-primary">
              <tr>
                <th>Store Name</th>
                <th>Address</th>
                <th>Overall Rating ⭐</th>
                <th>Your Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {stores.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No stores found. Try changing filters.
                  </td>
                </tr>
              ) : (
                stores.map((store) => (
                  <tr key={store.id}>
                    <td className="fw-semibold">{store.name}</td>
                    <td>{store.address}</td>
                    <td className="fw-bold text-warning">
                      {store.overall_rating ? store.overall_rating.toFixed(1) : 0}
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={newRatings[store.id] || ''}
                        onChange={(e) => handleRatingChange(store.id, e.target.value)}
                        className="form-control text-center"
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-success btn-sm px-3 rounded-pill"
                        onClick={() => submitRating(store.id)}
                      >
                        Submit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
