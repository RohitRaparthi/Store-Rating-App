import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ padding: '2rem' }}>
      <h2>User Dashboard</h2>
      <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>

      <div style={{ marginBottom: '1rem' }}>
        <input placeholder="Store Name" onChange={e => setFilters({ ...filters, name: e.target.value })} />
        <input placeholder="Address" onChange={e => setFilters({ ...filters, address: e.target.value })} />
        <button onClick={fetchStores}>Search</button>
      </div>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Submit/Update</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.address}</td>
              <td>{store.overall_rating || 0}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newRatings[store.id] || ''}
                  onChange={e => handleRatingChange(store.id, e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => submitRating(store.id)}>Submit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
