import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [userFilters, setUserFilters] = useState({ name: '', email: '', role: '' });
  const [storeFilters, setStoreFilters] = useState({ name: '', email: '', address: '' });

  const fetchStats = async () => {
    const res = await axios.get('/admin/stats');
    setStats(res.data);
  };

  const fetchUsers = async () => {
    const params = { ...userFilters };
    const res = await axios.get('/admin/users', { params });
    setUsers(res.data);
  };

  const fetchStores = async () => {
    const params = { ...storeFilters };
    const res = await axios.get('/admin/stores', { params });
    setStores(res.data);
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };
  

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard</h2>
      <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>

      <h3>📊 Stats</h3>
      <p>Total Users: {stats.totalUsers}</p>
      <p>Total Stores: {stats.totalStores}</p>
      <p>Total Ratings: {stats.totalRatings}</p>

      <h3>➕ Add New User</h3>
      <form onSubmit={async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const address = e.target.address.value;
        const password = e.target.password.value;
        const role = e.target.role.value;

        try {
          const res = await axios.post('/admin/add-user', { name, email, address, password, role });
          if (role === 'store_owner') {
            alert(`Store Owner created. Their ID is: ${res.data.id}`);
          } else {
            alert('User added');
          }

          fetchUsers();
          e.target.reset();
        } catch (err) {
          alert('Failed to add user');
        }
      }}>
        <input name="name" placeholder="Name" required />
        <input name="email" placeholder="Email" required />
        <input name="address" placeholder="Address" required />
        <input name="password" placeholder="Password" required />
        <select name="role" required>
          <option value="">--Select Role--</option>
          <option value="user">Normal User</option>
          <option value="admin">Admin</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button type="submit">Add User</button>
      </form>
      
      <h3>🏪 Add New Store</h3>
      <form onSubmit={async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const address = e.target.address.value;
        const ownerId = e.target.ownerId.value;

        try {
          await axios.post('/admin/add-store', { name, email, address, owner_id: ownerId });
          alert('Store added');
          fetchStores();
          e.target.reset();
        } catch (err) {
          alert('Failed to add store');
        }
      }}>
        <input name="name" placeholder="Store Name" required />
        <input name="email" placeholder="Store Email" required />
        <input name="address" placeholder="Store Address" required />
        <input name="ownerId" placeholder="Store Owner ID" required />
        <button type="submit">Add Store</button>
      </form>


      <h3>👥 Users</h3>
      <input placeholder="Name" onChange={e => setUserFilters({ ...userFilters, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setUserFilters({ ...userFilters, email: e.target.value })} />
      <input placeholder="Role" onChange={e => setUserFilters({ ...userFilters, role: e.target.value })} />
      <button onClick={fetchUsers}>Apply Filters</button>

      <table border="1" cellPadding="10" style={{ marginTop: '1rem' }}>
        <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr></thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td><td>{user.email}</td><td>{user.address}</td><td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>🏪 Stores</h3>
      <input placeholder="Name" onChange={e => setStoreFilters({ ...storeFilters, name: e.target.value })} />
      <input placeholder="Email" onChange={e => setStoreFilters({ ...storeFilters, email: e.target.value })} />
      <input placeholder="Address" onChange={e => setStoreFilters({ ...storeFilters, address: e.target.value })} />
      <button onClick={fetchStores}>Apply Filters</button>

      <table border="1" cellPadding="10" style={{ marginTop: '1rem' }}>
        <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Rating</th></tr></thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id}>
              <td>{store.name}</td><td>{store.email}</td><td>{store.address}</td><td>{store.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    
  );
}
