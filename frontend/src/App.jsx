import { useEffect, useState } from 'react';
import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});
const today = () => new Date().toISOString().slice(0, 10);

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [createdAt, setCreatedAt] = useState(today());
  const [status, setStatus] = useState('active');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editCreatedAt, setEditCreatedAt] = useState(today());
  const [editStatus, setEditStatus] = useState('active');
  const [busyId, setBusyId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setMessage('❌ Error: ' + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      setMessage('❌ Name and email are required');
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/users', {
        name: name.trim(),
        email: email.trim(),
        country: country.trim() || null,
        created_at: createdAt || today(),
        status: status === 'inactive' ? 'inactive' : 'active',
      });

      setMessage('✅ ' + res.data.message);
      setName('');
      setEmail('');
      setCountry('');
      setCreatedAt(today());
      setStatus('active');
      fetchUsers();
    } catch (err) {
      setMessage('❌ Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!editName.trim() || !editEmail.trim()) {
      setMessage('❌ Name and email are required');
      return;
    }

    try {
      setBusyId(id);
      const res = await API.put(`/users/${id}`, {
        name: editName.trim(),
        email: editEmail.trim(),
        country: editCountry.trim() || null,
        created_at: editCreatedAt || null,
        status: editStatus === 'inactive' ? 'inactive' : 'active',
      });

      setMessage('✅ ' + res.data.message);
      setEditingId(null);
      setEditName('');
      setEditEmail('');
      setEditCountry('');
      setEditCreatedAt(today());
      setEditStatus('active');
      fetchUsers();
    } catch (err) {
      setMessage('❌ Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete user #${id}?`)) return;

    try {
      setBusyId(id);
      const res = await API.delete(`/users/${id}`);
      setMessage('✅ ' + res.data.message);
      fetchUsers();
    } catch (err) {
      setMessage('❌ Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setBusyId(null);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.user_id ?? user.id);
    setEditName(user.name || '');
    setEditEmail(user.email || '');
    setEditCountry(user.country || '');
    setEditCreatedAt(user.created_at || today());
    setEditStatus(user.status === 'inactive' ? 'inactive' : 'active');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditEmail('');
    setEditCountry('');
    setEditCreatedAt(today());
    setEditStatus('active');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          👥 User Management
        </h1>

        <form onSubmit={handleSubmit} className="mb-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              value={createdAt}
              onChange={(e) => setCreatedAt(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Adding...' : '➕ Add User'}
          </button>
        </form>

        {message && <p className="text-sm text-green-600 mb-4">{message}</p>}

        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Users ({users.length})
        </h2>

        {users.length === 0 ? (
          <p className="text-gray-500 text-sm">No users yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-3 py-2 text-left">ID</th>
                  <th className="px-3 py-2 text-left">Name</th>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Country</th>
                  <th className="px-3 py-2 text-left">Created At</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const userId = u.user_id ?? u.id;
                  const isEditing = editingId === userId;
                  const isBusy = busyId === userId;

                  return (
                    <tr key={userId} className="border-t border-gray-200 align-top">
                      {isEditing ? (
                        <>
                          <td className="px-3 py-2">#{userId}</td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={editCountry}
                              onChange={(e) => setEditCountry(e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="date"
                              value={editCreatedAt}
                              onChange={(e) => setEditCreatedAt(e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdate(userId)}
                                disabled={isBusy}
                                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-60"
                              >
                                {isBusy ? '...' : '💾 Save'}
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-2">#{userId}</td>
                          <td className="px-3 py-2">{u.name || 'Unknown'}</td>
                          <td className="px-3 py-2">{u.email || '—'}</td>
                          <td className="px-3 py-2">{u.country || '—'}</td>
                          <td className="px-3 py-2">{u.created_at || '—'}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                u.status === 'inactive'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {u.status || 'active'}
                            </span>
                          </td>
                          <td className="px-3 py-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEdit(u)}
                                className="px-3 py-1 bg-yellow-500 text-white rounded text-xs hover:bg-yellow-600"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleDelete(userId)}
                                disabled={isBusy}
                                className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 disabled:opacity-60"
                              >
                                {isBusy ? '...' : '🗑️ Delete'}
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;