import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function StoreOwnerDashboard() {
  const [averageRating, setAverageRating] = useState(0);
  const [raters, setRaters] = useState([]);
  const navigate = useNavigate();

  const fetchAvgRating = async () => {
    const res = await axios.get('/store-owner/average-rating');
    setAverageRating(res.data.average_rating);
  };

  const fetchRaters = async () => {
    const res = await axios.get('/store-owner/raters');
    setRaters(res.data);
  };

  useEffect(() => {
    fetchAvgRating();
    fetchRaters();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Store Owner Dashboard</h2>
      <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>

      <h3>⭐ Average Rating: {averageRating || 0}</h3>

      <h3>👥 Users Who Rated</h3>
      {raters.length === 0 ? (
        <p>No ratings submitted yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
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
                <td>{rater.rating}</td>
                <td>{new Date(rater.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
