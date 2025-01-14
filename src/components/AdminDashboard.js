import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [searchPost, setSearchPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // Untuk gambar yang dipilih
  const [isModalOpen, setIsModalOpen] = useState(false); // Untuk modal
  const navigate = useNavigate();

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    const username = sessionStorage.getItem('username'); // Mengambil username dari session storage
    
    if (!role || role !== 'admin') {
      alert('Access denied! Only admin can access this page.');
      navigate('/login');
    } else {
      // Mengambil data users dan posts dari server
      axios.get('http://localhost:3001/admin', { params: { username } })
        .then(response => {
          setUsers(response.data.users);
          setPosts(response.data.posts);
        })
        .catch(error => alert('Error loading admin data'));
    }
  }, [navigate]);

  // Fungsi untuk menghapus user
  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:3001/user/${id}`);
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  // Fungsi untuk menghapus post
  const handleDeletePost = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:3001/post/${id}`);
        setPosts(posts.filter(post => post.id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  };

  // Fungsi untuk membuka modal dan menampilkan gambar besar
  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/');
  };

  // Filter untuk pencarian user
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.email.toLowerCase().includes(searchUser.toLowerCase())
  );

  // Filter untuk pencarian post
  const filteredPosts = posts.filter(post =>
    post.username.toLowerCase().includes(searchPost.toLowerCase()) ||
    post.text.toLowerCase().includes(searchPost.toLowerCase())
  );

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Tombol Logout dan Tambah Admin */}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleLogout} className="btn logout-btn" style={{ marginRight: '10px' }}>Logout</button>
        <Link to="/register-admin">
          <button className="btn add-admin-btn">Tambah Admin</button>
        </Link>
      </div>

      {/* Modal untuk melihat gambar yang diperbesar */}
      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img src={`http://localhost:3001/uploads/${selectedImage}`} alt="Selected" className="enlarged-image" />
          </div>
        </div>
      )}

      {/* Bagian Users dengan Tabel dan Pencarian */}
      <div className="section">
        <h3>Users</h3>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search users..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <Link to={`/edituser/${user.id}`} className="btn">Edit</Link>
                  <button onClick={() => handleDeleteUser(user.id)} className="btn delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bagian Posts dengan Tabel dan Pencarian */}
      <div className="section">
        <h3>Posts</h3>
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchPost}
            onChange={(e) => setSearchPost(e.target.value)}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Username</th>
              <th>Text</th>
              <th>Date</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post, index) => (
              <tr key={post.id}>
                <td>{index + 1}</td>
                <td>{post.username}</td>
                <td>{post.text}</td>
                <td>{new Date(post.date).toLocaleString()}</td>
                <td>
                  {post.image ? (
                    <img
                      src={`http://localhost:3001/uploads/${post.image}`}
                      alt="Post"
                      style={{ width: '100px', cursor: 'pointer' }}
                      onClick={() => openModal(post.image)}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  <Link to={`/editpost/${post.id}`} className="btn">Edit</Link>
                  <button onClick={() => handleDeletePost(post.id)} className="btn delete-btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
